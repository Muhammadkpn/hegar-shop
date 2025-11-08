/* eslint-disable no-await-in-loop */
const database = require('../../database');
const { asyncQuery } = require('../../helpers');

module.exports = {
    getProductCategory: async (req, res) => {
        try {
            // get product category
            const query = `SELECT p.store_id, u.username, pc.product_id, p.name, p.sale_price, p.regular_price, pc.category_id, cp.name AS category FROM product_category pc
                JOIN products p ON pc.product_id = p.id
                JOIN category_product cp ON pc.category_id = cp.id
                JOIN users u ON p.store_id = u.id`;
            const result = await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully!',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    countCategory: async (req, res) => {
        try {
            // count category
            const countCategory = `SELECT pc.category_id, cp.name AS category, COUNT(pc.category_id) AS count FROM product_category pc
                            JOIN category_product cp ON pc.category_id = cp.id GROUP BY pc.category_id, cp.name ORDER BY count DESC;`;
            const result = await asyncQuery(countCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully!',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    countCategoryByStore: async (req, res) => {
        const { id } = req.params;
        try {
            // count category
            const countCategory = `SELECT pc.category_id, cp.name AS category, COUNT(pc.category_id) AS count FROM product_category pc
            JOIN category_product cp ON pc.category_id = cp.id
            JOIN products p ON pc.product_id = p.id
            WHERE p.store_id = ${database.escape(id)}
            GROUP BY pc.category_id, cp.name ORDER BY count DESC;`;
            const result = await asyncQuery(countCategory);
            const finalResult = { store_id: id, countCategory: result };

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully!',
                data: finalResult,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    addProductCategory: async (req, res) => {
        const { categoryId } = req.body;

        try {
            // Get product id
            const productId = 'SELECT MAX(id) AS AUTO_INCREMENT FROM products;';
            const getProductId = await asyncQuery(productId);

            // check duplicate in CategoryId
            const checkDuplicate = [...new Set(categoryId)];
            if (checkDuplicate.length !== categoryId.length) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Your input has duplicate',
                });
                return;
            }

            // get level for each category
            const level = `WITH RECURSIVE category_path (id, name, lvl) AS
                        (
                            SELECT id, name, 0 lvl
                            FROM category_product
                            WHERE parent_id IS NULL
                            UNION ALL
                            SELECT c.id, c.name, cp.lvl + 1
                            FROM category_path AS cp JOIN category_product AS c
                                ON cp.id = c.parent_id
                        )
                        SELECT * FROM category_path
                        ORDER BY lvl;`;
            const resultLevel = await asyncQuery(level);

            const filterLevel = [];
            resultLevel.forEach((item) => {
                categoryId.forEach((value) => {
                    if (item.id === value) {
                        filterLevel.push(item);
                    }
                });
            });

            // check every category already exists in database
            if (filterLevel.length !== categoryId.length) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'One of the category doesn\'t exists in database',
                });
                return;
            }

            for (let i = 0; i < filterLevel.length; i += 1) {
                // get parent category_id
                const getAllCategory = ((childId) => {
                    const query = `WITH RECURSIVE category_path (id, name, parent_id) AS
                                (
                                    SELECT id, name, parent_id
                                    FROM category_product
                                    WHERE id = ${childId} -- child node
                                    UNION ALL
                                    SELECT c.id, c.name, c.parent_id
                                    FROM category_path AS cp
                                    JOIN category_product AS c ON cp.parent_id = c.id
                                )
                                SELECT id from category_path`;
                    return query;
                });
                const allCategory1 = await asyncQuery(getAllCategory(filterLevel[i].id));

                let value = '';
                for (let j = 0; j < allCategory1.length; j += 1) {
                    // check category in product
                    const checkCategory = `SELECT * FROM product_category WHERE category_id = ${allCategory1[j].id} AND product_id = ${getProductId[0].AUTO_INCREMENT}`;
                    const getCheckCategory = await asyncQuery(checkCategory);

                    if (getCheckCategory.length === 0) {
                        // insert query
                        value += `(${getProductId[0].AUTO_INCREMENT}, ${allCategory1[j].id}),`;
                    }
                }
                // insert new product category
                const addQuery = `INSERT INTO product_category (product_id, category_id) VALUES ${value.slice(0, -1)}`;
                await asyncQuery(addQuery);
            }

            // send response
            res.status(200).send({
                status: 'success',
                message: 'New product category has been added to database',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editProductCategory: async (req, res) => {
        const { categoryId } = req.body;
        const { id } = req.params;

        try {
            // Check product in our database
            const checkId = `SELECT * FROM product_category WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            // check result
            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Id = ${id} doesn't exists`,
                });
                return;
            }

            // check category in product
            const checkCategory = `SELECT * FROM product_category WHERE category_id = ${database.escape(categoryId)} AND product_id = ${resultCheck[0].product_id}`;
            const getCheckCategory = await asyncQuery(checkCategory);

            // check result
            if (getCheckCategory.length !== 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: `Product id = ${resultCheck[0].product_id} with category id = ${categoryId} already exists`,
                });
                return;
            }

            // get parent category_id
            const getAllCategory = ((childId) => {
                const query = `WITH RECURSIVE category_path (id, name, parent_id) AS
                (
                    SELECT id, name, parent_id
                    FROM category_product
                    WHERE id = ${childId} -- child node
                    UNION ALL
                    SELECT c.id, c.name, c.parent_id
                    FROM category_path AS cp 
                    JOIN category_product AS c ON cp.parent_id = c.id
                )
                SELECT id from category_path`;
                return query;
            });
            const allCategory1 = await asyncQuery(getAllCategory(categoryId));
            const allCategory2 = await asyncQuery(getAllCategory(resultCheck[0].category_id));

            // insert query
            let value = '';
            let deleted = '';
            allCategory1.forEach((item) => {
                value += `(${resultCheck[0].product_id}, ${item.id}),`;
                return value;
            });
            allCategory2.forEach((item) => {
                deleted += `${item.id},`;
                return deleted;
            });

            // delete product
            const del = `DELETE FROM product_category WHERE product_id = ${resultCheck[0].product_id} AND category_id IN (${deleted.slice(0, -1)})`;
            await asyncQuery(del);

            // insert new product category
            const addQuery = `INSERT INTO product_category (product_id, category_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(addQuery);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product category with id: ${categoryId} has been updated`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editProductCategoryByStore: async (req, res) => {
        const { categoryId } = req.body;
        const { id } = req.params;

        try {
            // check duplicate in CategoryId
            const checkDuplicate = [...new Set(categoryId)];
            if (checkDuplicate.length !== categoryId.length) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Your input has duplicate',
                });
                return;
            }

            // get level for each category
            const level = `WITH RECURSIVE category_path (id, name, lvl) AS
            (
                SELECT id, name, 0 lvl
                FROM category_product
                WHERE parent_id IS NULL
                UNION ALL
                SELECT c.id, c.name,cp.lvl + 1
                FROM category_path AS cp JOIN category_product AS c
                    ON cp.id = c.parent_id
            )
            SELECT * FROM category_path
            ORDER BY lvl;`;
            const resultLevel = await asyncQuery(level);

            const filterLevel = [];
            resultLevel.forEach((item) => {
                categoryId.forEach((value) => {
                    if (item.id === value) {
                        filterLevel.push(item);
                    }
                });
            });

            // check every category already exists in database
            if (filterLevel.length !== categoryId.length) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'One of the category doesn\'t exists in database',
                });
                return;
            }

            // delete product in product category
            const deleteAll = `DELETE FROM product_category WHERE product_id = ${database.escape(id)}`;
            await asyncQuery(deleteAll);

            for (let i = 0; i < filterLevel.length; i += 1) {
                // get parent category_id
                const getAllCategory = ((childId) => {
                    const query = `WITH RECURSIVE category_path (id, name, parent_id) AS
                    (
                        SELECT id, name, parent_id
                        FROM category_product
                        WHERE id = ${childId} -- child node
                        UNION ALL
                        SELECT c.id, c.name, c.parent_id
                        FROM category_path AS cp
                        JOIN category_product AS c ON cp.parent_id = c.id
                    )
                    SELECT id from category_path`;
                    return query;
                });
                const allCategory1 = await asyncQuery(getAllCategory(filterLevel[i].id));

                let value = '';
                for (let j = 0; j < allCategory1.length; j += 1) {
                    // check category in product
                    const checkCategory = `SELECT * FROM product_category WHERE category_id = ${allCategory1[j].id} AND product_id = ${id}`;
                    const getCheckCategory = await asyncQuery(checkCategory);

                    if (getCheckCategory.length === 0) {
                        // insert query
                        value += `(${id}, ${allCategory1[j].id}),`;
                    }
                }
                // insert new product category
                const addQuery = `INSERT INTO product_category (product_id, category_id) VALUES ${value.slice(0, -1)}`;
                await asyncQuery(addQuery);
            }

            res.status(200).send({
                status: 'success',
                message: 'Edit product category has been successfully',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    deleteProductCategory: async (req, res) => {
        const { id } = req.params;
        try {
            // check if user with id is exists in our database
            const checkId = `SELECT * FROM product_category WHERE product_id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            // check result
            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product with product_id: ${id} doesn't exists.`,
                });
                return;
            }

            // if user exists in our databse
            const del = `DELETE FROM product_category WHERE product_id = ${database.escape(id)}`;
            await asyncQuery(del);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product category with product_id: ${id} has been deleted`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
