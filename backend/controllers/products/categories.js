const database = require('../../database');
const { asyncQuery } = require('../../helpers');

module.exports = {
    getCategory: async (req, res) => {
        const { name } = req.query;
        try {
            // get all categories data
            let categories = 'SELECT * FROM category_product';

            // filter by name of category
            if (Object.prototype.hasOwnProperty.call(req.query, 'name')) {
                categories += ` WHERE name LIKE '%${name}%'`;
            }

            const getCategories = await asyncQuery(categories);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully!',
                data: getCategories,
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
    getCategoryChild: async (req, res) => {
        try {
            const query = `WITH RECURSIVE category_path (id, name, lvl, parent_id) AS
            (
              SELECT id, name, 0 lvl, parent_id
                FROM category_product
                WHERE parent_id IS NULL
              UNION ALL
              SELECT c.id, c.name, cp.lvl + 1, c.parent_id
                FROM category_path AS cp JOIN category_product AS c
                  ON cp.id = c.parent_id
            )
            SELECT * FROM category_path
            ORDER BY lvl;`;
            const result = await asyncQuery(query);

            const parent = [];
            const child1 = [];
            const child2 = [];
            result.forEach((item) => {
                if (item.lvl === 0) {
                    parent.push(item);
                } else if (item.lvl === 1) {
                    child1.push(item);
                } else if (item.lvl === 2) {
                    child2.push(item);
                }
            });

            const finalResult = {};
            finalResult.parent = parent;
            finalResult.child1 = child1;
            finalResult.child2 = child2;
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
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
    editCategory: async (req, res) => {
        const { name, parentId } = req.body;
        const { id } = req.params;
        try {
            // check category in database
            const checkCategory = `SELECT * FROM category_product WHERE id = ${database.escape(id)}`;
            const getCheckCategory = await asyncQuery(checkCategory);

            if (getCheckCategory.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Category not found',
                });
                return;
            }

            // edit categories data
            const editCategory = `UPDATE category_product SET name = ${database.escape(name)}, parent_id = ${database.escape(parentId)}  WHERE id = ${database.escape(id)}`;
            await asyncQuery(editCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Category with id: ${id} has been updated`,
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
    addCategory: async (req, res) => {
        const { name, parentId } = req.body;
        try {
            // check category
            const category = `SELECT * FROM category_product WHERE name = ${database.escape(name)}`;
            const result = await asyncQuery(category);

            if (result.length !== 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: `Name with title = ${name} already exists`,
                });
                return;
            }

            // insert new category
            const insertCategory = `INSERT INTO category_product (name, parent_id) VALUES (${database.escape(name)}, ${database.escape(parentId)})`;
            await asyncQuery(insertCategory);

            // send response
            res.status(201).send({
                status: 'success',
                message: 'Category has been added to database',
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
    deleteCategory: async (req, res) => {
        const { id } = req.params;
        try {
            // check category in database
            const checkCategory = `SELECT * FROM category_product WHERE id = ${database.escape(id)}`;
            const getCheckCategory = await asyncQuery(checkCategory);

            if (getCheckCategory.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Category not found',
                });
                return;
            }

            // delete category
            const allCategory = `WITH RECURSIVE category_path (id, name, parent_id) AS
                            (
                                SELECT id, name, parent_id
                                FROM category_product
                                WHERE id = ${database.escape(id)} -- child node
                                UNION ALL
                                SELECT c.id, c.name, c.parent_id
                                FROM category_path AS cp
                                JOIN category_product AS c ON cp.id = c.parent_id
                            )
                            SELECT id from category_path;`;
            const getAllCategory = await asyncQuery(allCategory);

            const deleteAll = [];
            getAllCategory.forEach((item) => {
                const deleteCategory = `DELETE FROM category_product WHERE id = ${item.id}`;
                deleteAll.push(asyncQuery(deleteCategory));
            });
            await Promise.all(deleteAll);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Category with id: ${id} has been deleted`,
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
