const database = require('../../database');
const { asyncQuery, generateQuery, today } = require('../../helpers/queryHelper');

module.exports = {
    getProduct: async (req, res) => {
        const {
            _sort, _order, search, category,
        } = req.query;

        try {
            // check sort query
            let sort = '';
            if (_sort) {
                sort += ` ORDER BY ${_sort} ${_order ? _order.toUpperCase() : 'ASC'}`;
            }

            // get all data product (product, image, review, category, and store)
            let getProduct = `SELECT p.status_id, p.store_id, s.store_name, p.id, p.name, p.description, p.regular_price, (p.regular_price - p.sale_price)/regular_price AS discount,
                          p.sale_price, p.stock, p.weight, p.released_date, p.updated_date, tb1.image, tb2.total_review, tb2.rating, tb3.category, tb4.tags, tb5.total_sales_qty FROM products p
                          JOIN stores s ON p.store_id = s.user_id
                          JOIN ( SELECT product_id, GROUP_CONCAT(image) AS image FROM product_image
                            GROUP BY product_id ) AS tb1 ON p.id = tb1.product_id
                          LEFT JOIN ( SELECT od.product_id, COUNT(rating) AS total_review,  AVG(rating) AS rating FROM product_review pr
                            JOIN order_details od ON  pr.review_id = od.review_id
                            GROUP BY product_id ) AS tb2 ON p.id = tb2.product_id
                          JOIN ( SELECT pc.product_id, GROUP_CONCAT(c.name) AS category FROM product_category pc
                            JOIN category_product c ON pc.category_id = c.id
                            GROUP BY pc.product_id ) AS tb3 ON p.id = tb3.product_id
                          JOIN ( SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags FROM product_tag pt
                            JOIN tag_product tp ON pt.tag_id= tp.id
                            GROUP BY pt.product_id) AS tb4 ON p.id = tb4.product_id
                          LEFT JOIN (SELECT product_id, SUM(qty) AS total_sales_qty FROM order_details od
                            GROUP BY product_id) tb5 ON p.id = tb5.product_id
                          WHERE p.status_id = 1`;

            // type of query
            const checkCategory = Object.prototype.hasOwnProperty.call(req.query, 'category');
            const checkSearch = Object.prototype.hasOwnProperty.call(req.query, 'search');
            if (checkCategory && checkSearch) {
                getProduct += ` AND category LIKE '%${category}%' AND name LIKE'%${search}%'`;
            } else if (checkSearch) { // Products in specific category
                getProduct += ` AND name LIKE '%${search}%'`;
            } else if (checkCategory) {
                getProduct += ` AND category LIKE '%${category}%'`;
            }

            getProduct += ` ${sort}`;
            const result = await asyncQuery(getProduct);

            // convert data to array
            let image = '';
            let tempCategory = '';
            let tempTags = '';
            result.forEach((item, index) => {
                if (item.category) {
                    tempCategory = item.category.split(',');
                    result[index].category = tempCategory;
                }
                if (item.tags) {
                    tempTags = item.tags.split(',');
                    result[index].tags = tempTags;
                }
                if (item.image) {
                    image = item.image.split(',');
                    result[index].image = image;
                }
            });

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
    getProductDetails: async (req, res) => {
        const { id } = req.params;

        try {
            // get all data product (product, image, review, category, and store)
            const getProductDetails = `SELECT p.status_id, p.store_id, s.store_name, p.id, p.name, p.description, p.regular_price, 
                          p.sale_price, p.stock, p.weight, p.released_date, p.updated_date, tb1.image, tb2.total_review, tb2.rating, tb3.category, tb4.tags, tb5.total_sales_qty FROM products p
                          JOIN stores s ON p.store_id = s.user_id
                          JOIN ( SELECT product_id, GROUP_CONCAT(image) AS image FROM product_image
                            GROUP BY product_id ) AS tb1 ON p.id = tb1.product_id
                          LEFT JOIN ( SELECT od.product_id, COUNT(rating) AS total_review, AVG(rating) AS rating FROM product_review pr
                            JOIN order_details od ON  pr.review_id = od.review_id
                            GROUP BY product_id ) AS tb2 ON p.id = tb2.product_id
                          JOIN ( SELECT pc.product_id, GROUP_CONCAT(c.name) AS category FROM product_category pc
                            JOIN category_product c ON pc.category_id = c.id
                            GROUP BY pc.product_id ) AS tb3 ON p.id = tb3.product_id
                          JOIN ( SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags FROM product_tag pt
                            JOIN tag_product tp ON pt.tag_id= tp.id
                            GROUP BY pt.product_id) AS tb4 ON p.id = tb4.product_id
                          LEFT JOIN (SELECT product_id, SUM(qty) AS total_sales_qty FROM order_details od
                            GROUP BY product_id) tb5 ON p.id = tb5.product_id
                          WHERE p.id = ${database.escape(id)}`;
            const result = await asyncQuery(getProductDetails);

            // convert data to array
            let image = '';
            let category = '';
            let tags = '';
            result.forEach((item, index) => {
                if (!item.rating) {
                    result[index].rating = 0;
                }

                image = item.image.split(',');
                category = item.category.split(',');
                tags = item.tags.split(',');
                result[index].image = image;
                result[index].category = category;
                result[index].tags = tags;
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully!',
                data: result[0],
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
    getProductStore: async (req, res) => {
        const { id } = req.params;
        const { categories, tags, name } = req.query;

        try {
            // get all data product (product, image, review, category, and store)
            let getProductStore = `SELECT p.status_id, p.store_id, s.store_name, p.id, p.name, p.description, p.regular_price, 
                          p.sale_price, p.stock, p.weight, p.released_date, p.updated_date, tb1.image, tb3.category, tb4.tags FROM products p
                          JOIN stores s ON p.store_id = s.user_id
                          JOIN ( SELECT product_id, GROUP_CONCAT(image) AS image FROM product_image
                            GROUP BY product_id ) AS tb1 ON p.id = tb1.product_id
                          JOIN ( SELECT pc.product_id, GROUP_CONCAT(c.name) AS category FROM product_category pc
                            JOIN category_product c ON pc.category_id = c.id
                            GROUP BY pc.product_id ) AS tb3 ON p.id = tb3.product_id
                          JOIN ( SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags FROM product_tag pt
                            JOIN tag_product tp ON pt.tag_id= tp.id
                            GROUP BY pt.product_id) AS tb4 ON p.id = tb4.product_id
                          WHERE p.store_id = ${database.escape(id)}`;

            // type of query
            const checkCategory = Object.prototype.hasOwnProperty.call(req.query, 'categories');
            const checkTag = Object.prototype.hasOwnProperty.call(req.query, 'tags');
            const checkName = Object.prototype.hasOwnProperty.call(req.query, 'name');

            if (checkCategory && checkTag && checkName) {
                getProductStore += ` AND tb3.category LIKE '%${categories}%' AND tb4.tags LIKE '%${tags}%' AND p.name LIKE '%${name}%'`;
            } else if (checkCategory && checkTag) {
                getProductStore += ` AND tb3.category LIKE '%${categories}%' AND tb4.tags LIKE '%${tags}%'`;
            } else if (checkCategory && checkName) {
                getProductStore += ` AND tb3.category LIKE '%${categories}%'AND p.name LIKE '%${name}%'`;
            } else if (checkTag && checkName) {
                getProductStore += ` AND tb4.tags LIKE '%${tags}%' AND p.name LIKE '%${name}%'`;
            } else if (checkCategory) {
                getProductStore += ` AND tb3.category LIKE '%${categories}%'`;
            } else if (checkTag) {
                getProductStore += ` AND tb4.tags LIKE '%${tags}%'`;
            } else if (checkName) {
                getProductStore += ` AND p.name LIKE '%${name}%'`;
            }

            getProductStore += ' ORDER BY released_date DESC';
            const result = await asyncQuery(getProductStore);

            // convert data to array
            let image = '';
            let category = '';
            let tag = '';
            result.forEach((item, index) => {
                image = item.image.split(',');
                category = item.category.split(',');
                tag = item.tags.split(',');

                result[index].image = image;
                result[index].category = category;
                result[index].tags = tag;
            });

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
    getProductAdmin: async (req, res) => {
        const {
            _sort,
            _order,
            search,
            status,
        } = req.query;

        try {
            // check sort query
            let sort = '';
            if (_sort && _order) {
                sort += ` ORDER BY ${_sort} ${_order ? _order.toUpperCase() : 'ASC'}`;
            }

            // get all data product (product, image, review, category, and store)
            let getProductAdmin = `SELECT p.status_id, p.store_id, u.username, p.id, p.name, p.description, p.regular_price, 
                        p.sale_price, p.stock, p.weight, p.released_date, p.updated_date, tb1.image FROM products p
                        JOIN users u ON p.store_id = u.id
                        JOIN ( SELECT product_id, GROUP_CONCAT(image) AS image FROM product_image
                        GROUP BY product_id ) AS tb1 ON p.id = tb1.product_id`;

            // filter product admin
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'status');
            const checkSearch = Object.prototype.hasOwnProperty.call(req.query, 'search');
            if (checkStatus && checkSearch) {
                getProductAdmin += ` WHERE p.status_id = ${status} AND p.name LIKE '%${search}%' OR u.username LIKE '%${search}%'`;
            } else if (checkSearch) {
                getProductAdmin += ` WHERE p.name LIKE '%${search}%' OR u.username LIKE '%${search}%'`;
            } else if (checkStatus) {
                getProductAdmin += ` WHERE p.status_id = ${status}`;
            }
            getProductAdmin += sort.length !== 0 ? sort : '';
            const result = await asyncQuery(getProductAdmin);

            // convert string to array
            let image = [];
            result.forEach((item, index) => {
                image = item.image.split(',');
                result[index].image = image;
            });

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
    addProduct: async (req, res) => {
        const {
            name,
            description,
            weight,
            regularPrice,
            salePrice,
            storeId,
            statusId,
            stock,
        } = req.body;

        try {
            // check if product with id exist in our database
            const checkProduct = `SELECT * FROM products WHERE name = ${database.escape(name)}`;
            const resultCheck = await asyncQuery(checkProduct);

            // check duplicate product in table products
            if (resultCheck.length > 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'product already exist',
                });
                return;
            }

            // check regular price vs sale price
            if (Object.prototype.hasOwnProperty.call(req.body, 'regularPrice' && 'salePrice')) {
                if (regularPrice < salePrice) {
                    res.status(403).send({
                        status: 'fail',
                        code: 403,
                        message: 'Regular price must be greater than Sale Price',
                    });
                    return;
                }
            }

            // insert new products into database
            const add = `INSERT INTO products (\`name\`, \`description\`, weight, regular_price, sale_price, released_date, updated_date, store_id, status_id, stock) 
                    VALUES (${database.escape(name)}, ${database.escape(description)}, ${database.escape(weight)}, ${database.escape(regularPrice)}, 
                    ${database.escape(salePrice)}, '${today}', '${today}', ${database.escape(storeId)} , ${database.escape(statusId)}, ${database.escape(stock)})`;
            await asyncQuery(add);

            // send response
            res.status(201).send({
                status: 'success',
                message: 'New product has been added to database',
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
    editProduct: async (req, res) => {
        const { id } = req.params;
        try {
            // Check product in our database
            const checkId = `SELECT * FROM products WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            // send response if product doesnt exists
            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product with id = ${id} doesn't exists`,
                });
                return;
            }

            // check regular price vs sale price
            if (Object.prototype.hasOwnProperty.call(req.body, 'regular_price' && 'sale_price')) {
                if (req.body.regular_price < req.body.sale_price) {
                    res.status(403).send({
                        status: 'fail',
                        code: 403,
                        message: 'Regular price must be greater than Sale Price',
                    });
                    return;
                }
            } else if (Object.prototype.hasOwnProperty.call(req.body, 'regular_price' || 'sale_price')) {
                if (req.body.regular_price < resultCheck[0].sale_price) {
                    res.status(403).send({
                        status: 'fail',
                        message: 'Regular price must be greater than Sale Price',
                    });
                } else if (resultCheck[0].regular_price < req.body.sale_price) {
                    res.status(403).send({
                        status: 'fail',
                        code: 403,
                        message: 'Regular price must be greater than Sale Price',
                    });
                } else if (resultCheck[0].regular_price < resultCheck[0].sale_price) {
                    res.status(403).send({
                        status: 'fail',
                        code: 403,
                        message: 'Regular price must be greater than Sale Price',
                    });
                }
                return;
            }

            // edit product in database
            const editQuery = `UPDATE products SET updated_date = '${today}', ${generateQuery(req.body)} WHERE id = ${resultCheck[0].id}`;
            await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product with ${id} has been updated`,
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
    deleteProduct: async (req, res) => {
        const { id } = req.params;

        try {
            // check if product with id is exists in our database
            const checkProduct = `SELECT * FROM products WHERE id=${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkProduct);

            // send response if product already exists
            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `products with id: ${id} doesn't exists`,
                });
                return;
            }

            // delete data products in table products, product image, and product category
            const delProducts = `DELETE FROM products WHERE id = ${database.escape(id)}`;
            await asyncQuery(delProducts);
            const delProcat = `DELETE FROM product_category WHERE product_id = ${database.escape(id)}`;
            await asyncQuery(delProcat);
            const delProTag = `DELETE FROM product_tag WHERE product_id = ${database.escape(id)}`;
            await asyncQuery(delProTag);
            const delImage = `DELETE FROM product_image WHERE product_id = ${database.escape(id)}`;
            await asyncQuery(delImage);

            // send result
            res.status(200).send({
                status: 'success',
                message: `Product with id: ${id} already deleted from database`,
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
    getProductImage: async (req, res) => {
        const { id } = req.query;
        try {
            // get product image
            const query = `SELECT pi.id, pi.product_id, p.name, pi.image FROM product_image pi
                        RIGHT JOIN products p ON pi.product_id = p.id
                        ${id !== undefined ? `WHERE pi.product_id = ${id}` : ''}`;
            const result = await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
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
    addProductImage: async (req, res) => {
        let { id: productId } = req.params;

        // check productId
        if (productId === 'new-product') {
            // get product id
            const lastId = 'SELECT MAX(id) AS AUTO_INCREMENT FROM products;';
            const getLastId = await asyncQuery(lastId);
            productId = getLastId[0].AUTO_INCREMENT;
        }

        // check file upload
        if (req.files === undefined) {
            res.status(400).send({
                status: 'fail',
                code: 400,
                message: 'no image',
            });
            return;
        }

        try {
            // check if product with id exist in our database
            const checkProduct = `SELECT * FROM products WHERE id = '${parseInt(productId, 10)}'`;
            const check = await asyncQuery(checkProduct);

            // check duplicate product in table products
            if (check.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Product doesn\'t exists in our database',
                });
                return;
            }

            // insert new products into database
            const promises = [];
            req.files.forEach((item) => {
                const add = `INSERT INTO product_image (product_id, image) VALUES (${parseInt(productId, 10)}, 'image/products/${item.filename}')`;
                asyncQuery(add);
            });
            await Promise.all(promises);

            // send response
            res.status(200).send({
                status: 'success',
                message: `New image of product with id: ${parseInt(productId, 10)} has been added to database`,
            });
        } catch (error) {
            console.log(error);
            if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                res.status(500).send({
                    status: 'fail',
                    code: 500,
                    message: 'Too many files to upload.',
                });
                return;
            }
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: `Error when trying upload many files: ${error}`,
            });
        }
    },
    editProductImage: async (req, res) => {
        const { image } = req.body;
        const { id } = req.params;
        try {
            // Check product in our database
            const checkId = `SELECT * FROM product_image WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            // send response if product doesnt exists
            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product image with id = ${id} doesn't exists`,
                });
                return;
            }

            // edit product in database
            const editQuery = `UPDATE product_image SET image = ${database.escape(image)} WHERE id = ${parseInt(id, 10)}`;
            await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product image with id: ${id} has been updated`,
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
    deleteProductImage: async (req, res) => {
        const { id } = req.params;

        try {
            // check if product with id is exists in our database
            const checkProduct = `SELECT * FROM product_image WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkProduct);

            // send response if product already exists
            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `product image with id: ${id} doesn't exists.`,
                });
                return;
            }

            // delete data products in table product image
            const delImage = `DELETE FROM product_image WHERE id = ${database.escape(id)}`;
            await asyncQuery(delImage);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product image with id: ${id} already deleted from database`,
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
