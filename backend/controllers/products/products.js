const database = require('../../database');
const {
    asyncQuery,
    generateUpdateQuery,
    buildLikeCondition,
    paginatedQuery,
    today,
    escape,
} = require('../../helpers/queryHelper');
const { getPaginationParams, createPaginatedResponse } = require('../../helpers/pagination');

/**
 * Products Controller - Optimized Version
 * Phase 1: Database Optimization
 * - Fixed SQL injection vulnerabilities
 * - Added pagination
 * - Improved query performance
 * - Added parameterized queries
 */

module.exports = {
    /**
     * Get products with pagination and filtering
     * FIXED: SQL injection, Added: Pagination
     */
    getProduct: async (req, res) => {
        const { _sort, _order, search, category } = req.query;
        const { page, limit, offset } = getPaginationParams(req);

        try {
            // Build sort clause safely
            const allowedSortFields = ['name', 'regular_price', 'sale_price', 'released_date', 'rating'];
            let sortField = allowedSortFields.includes(_sort) ? _sort : 'released_date';
            let sortOrder = _order && _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            // Base query with joins
            let baseQuery = `
                SELECT
                    p.status_id, p.store_id, s.store_name, p.id, p.name, p.description,
                    p.regular_price,
                    (p.regular_price - p.sale_price)/p.regular_price AS discount,
                    p.sale_price, p.stock, p.weight, p.released_date, p.updated_date,
                    tb1.image, tb2.total_review, tb2.rating, tb3.category, tb4.tags,
                    tb5.total_sales_qty
                FROM products p
                JOIN stores s ON p.store_id = s.user_id
                JOIN (
                    SELECT product_id, GROUP_CONCAT(image) AS image
                    FROM product_image
                    GROUP BY product_id
                ) AS tb1 ON p.id = tb1.product_id
                LEFT JOIN (
                    SELECT od.product_id, COUNT(rating) AS total_review, AVG(rating) AS rating
                    FROM product_review pr
                    JOIN order_details od ON pr.review_id = od.review_id
                    GROUP BY product_id
                ) AS tb2 ON p.id = tb2.product_id
                JOIN (
                    SELECT pc.product_id, GROUP_CONCAT(c.name) AS category
                    FROM product_category pc
                    JOIN category_product c ON pc.category_id = c.id
                    GROUP BY pc.product_id
                ) AS tb3 ON p.id = tb3.product_id
                JOIN (
                    SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags
                    FROM product_tag pt
                    JOIN tag_product tp ON pt.tag_id = tp.id
                    GROUP BY pt.product_id
                ) AS tb4 ON p.id = tb4.product_id
                LEFT JOIN (
                    SELECT product_id, SUM(qty) AS total_sales_qty
                    FROM order_details
                    GROUP BY product_id
                ) tb5 ON p.id = tb5.product_id
                WHERE p.status_id = 1
            `;

            // Build parameters array
            const params = [];

            // Add filters
            if (category && search) {
                baseQuery += ` AND tb3.category LIKE ? AND p.name LIKE ?`;
                params.push(`%${category}%`, `%${search}%`);
            } else if (search) {
                baseQuery += ` AND p.name LIKE ?`;
                params.push(`%${search}%`);
            } else if (category) {
                baseQuery += ` AND tb3.category LIKE ?`;
                params.push(`%${category}%`);
            }

            // Add sorting
            baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

            // Count query
            const countQuery = `
                SELECT COUNT(DISTINCT p.id) as total
                FROM products p
                JOIN product_category pc ON p.id = pc.product_id
                JOIN category_product c ON pc.category_id = c.id
                WHERE p.status_id = 1
                ${category ? 'AND c.name LIKE ?' : ''}
                ${search ? 'AND p.name LIKE ?' : ''}
            `;

            const countParams = [];
            if (category) countParams.push(`%${category}%`);
            if (search) countParams.push(`%${search}%`);

            // Execute paginated query
            const result = await paginatedQuery(
                baseQuery,
                countQuery,
                params,
                page,
                limit
            );

            // Process results - convert comma-separated strings to arrays
            result.data.forEach((item, index) => {
                if (item.category) {
                    result.data[index].category = item.category.split(',');
                }
                if (item.tags) {
                    result.data[index].tags = item.tags.split(',');
                }
                if (item.image) {
                    result.data[index].image = item.image.split(',');
                }
            });

            // Send paginated response
            res.status(200).send(createPaginatedResponse(
                result.data,
                result.total,
                page,
                limit,
                'Products retrieved successfully'
            ));
        } catch (error) {
            console.error('getProduct error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Get product details by ID
     * FIXED: SQL injection vulnerability
     */
    getProductDetails: async (req, res) => {
        const { id } = req.params;

        try {
            const query = `
                SELECT
                    p.status_id, p.store_id, s.store_name, p.id, p.name, p.description,
                    p.regular_price, p.sale_price, p.stock, p.weight, p.released_date,
                    p.updated_date, tb1.image, tb2.total_review, tb2.rating, tb3.category,
                    tb4.tags, tb5.total_sales_qty
                FROM products p
                JOIN stores s ON p.store_id = s.user_id
                JOIN (
                    SELECT product_id, GROUP_CONCAT(image) AS image
                    FROM product_image
                    GROUP BY product_id
                ) AS tb1 ON p.id = tb1.product_id
                LEFT JOIN (
                    SELECT od.product_id, COUNT(rating) AS total_review, AVG(rating) AS rating
                    FROM product_review pr
                    JOIN order_details od ON pr.review_id = od.review_id
                    GROUP BY product_id
                ) AS tb2 ON p.id = tb2.product_id
                JOIN (
                    SELECT pc.product_id, GROUP_CONCAT(c.name) AS category
                    FROM product_category pc
                    JOIN category_product c ON pc.category_id = c.id
                    GROUP BY pc.product_id
                ) AS tb3 ON p.id = tb3.product_id
                JOIN (
                    SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags
                    FROM product_tag pt
                    JOIN tag_product tp ON pt.tag_id = tp.id
                    GROUP BY pt.product_id
                ) AS tb4 ON p.id = tb4.product_id
                LEFT JOIN (
                    SELECT product_id, SUM(qty) AS total_sales_qty
                    FROM order_details
                    GROUP BY product_id
                ) tb5 ON p.id = tb5.product_id
                WHERE p.id = ?
            `;

            const result = await asyncQuery(query, [id]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Product not found',
                });
            }

            // Process result
            const product = result[0];
            if (!product.rating) {
                product.rating = 0;
            }

            product.image = product.image ? product.image.split(',') : [];
            product.category = product.category ? product.category.split(',') : [];
            product.tags = product.tags ? product.tags.split(',') : [];

            res.status(200).send({
                status: 'success',
                message: 'Product details retrieved successfully',
                data: product,
            });
        } catch (error) {
            console.error('getProductDetails error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Get products by store
     * FIXED: SQL injection vulnerability
     */
    getProductStore: async (req, res) => {
        const { id } = req.params;
        const { categories, tags, name } = req.query;

        try {
            let query = `
                SELECT
                    p.status_id, p.store_id, s.store_name, p.id, p.name, p.description,
                    p.regular_price, p.sale_price, p.stock, p.weight, p.released_date,
                    p.updated_date, tb1.image, tb3.category, tb4.tags
                FROM products p
                JOIN stores s ON p.store_id = s.user_id
                JOIN (
                    SELECT product_id, GROUP_CONCAT(image) AS image
                    FROM product_image
                    GROUP BY product_id
                ) AS tb1 ON p.id = tb1.product_id
                JOIN (
                    SELECT pc.product_id, GROUP_CONCAT(c.name) AS category
                    FROM product_category pc
                    JOIN category_product c ON pc.category_id = c.id
                    GROUP BY pc.product_id
                ) AS tb3 ON p.id = tb3.product_id
                JOIN (
                    SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags
                    FROM product_tag pt
                    JOIN tag_product tp ON pt.tag_id = tp.id
                    GROUP BY pt.product_id
                ) AS tb4 ON p.id = tb4.product_id
                WHERE p.store_id = ?
            `;

            const params = [id];

            // Add filters with parameterized queries
            if (categories) {
                query += ` AND tb3.category LIKE ?`;
                params.push(`%${categories}%`);
            }
            if (tags) {
                query += ` AND tb4.tags LIKE ?`;
                params.push(`%${tags}%`);
            }
            if (name) {
                query += ` AND p.name LIKE ?`;
                params.push(`%${name}%`);
            }

            query += ' ORDER BY released_date DESC';

            const result = await asyncQuery(query, params);

            // Process results
            result.forEach((item, index) => {
                result[index].image = item.image ? item.image.split(',') : [];
                result[index].category = item.category ? item.category.split(',') : [];
                result[index].tags = item.tags ? item.tags.split(',') : [];
            });

            res.status(200).send({
                status: 'success',
                message: 'Store products retrieved successfully',
                data: result,
            });
        } catch (error) {
            console.error('getProductStore error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Get products for admin with pagination
     * FIXED: SQL injection, Added: Pagination
     */
    getProductAdmin: async (req, res) => {
        const { _sort, _order, search, status } = req.query;
        const { page, limit } = getPaginationParams(req);

        try {
            // Build sort clause safely
            const allowedSortFields = ['name', 'regular_price', 'released_date', 'updated_date'];
            let sortField = allowedSortFields.includes(_sort) ? _sort : 'released_date';
            let sortOrder = _order && _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            let baseQuery = `
                SELECT
                    p.status_id, p.store_id, u.username, p.id, p.name, p.description,
                    p.regular_price, p.sale_price, p.stock, p.weight, p.released_date,
                    p.updated_date, tb1.image
                FROM products p
                JOIN users u ON p.store_id = u.id
                JOIN (
                    SELECT product_id, GROUP_CONCAT(image) AS image
                    FROM product_image
                    GROUP BY product_id
                ) AS tb1 ON p.id = tb1.product_id
            `;

            const params = [];
            const whereClauses = [];

            // Add filters
            if (status) {
                whereClauses.push('p.status_id = ?');
                params.push(status);
            }

            if (search) {
                whereClauses.push('(p.name LIKE ? OR u.username LIKE ?)');
                params.push(`%${search}%`, `%${search}%`);
            }

            if (whereClauses.length > 0) {
                baseQuery += ' WHERE ' + whereClauses.join(' AND ');
            }

            baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

            // Count query
            let countQuery = 'SELECT COUNT(*) as total FROM products p JOIN users u ON p.store_id = u.id';
            if (whereClauses.length > 0) {
                countQuery += ' WHERE ' + whereClauses.join(' AND ');
            }

            // Execute paginated query
            const result = await paginatedQuery(baseQuery, countQuery, params, page, limit);

            // Process results
            result.data.forEach((item, index) => {
                result.data[index].image = item.image ? item.image.split(',') : [];
            });

            res.status(200).send(createPaginatedResponse(
                result.data,
                result.total,
                page,
                limit,
                'Admin products retrieved successfully'
            ));
        } catch (error) {
            console.error('getProductAdmin error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Add new product
     * FIXED: SQL injection vulnerability
     */
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
            // Check if product exists
            const checkQuery = 'SELECT * FROM products WHERE name = ?';
            const existingProduct = await asyncQuery(checkQuery, [name]);

            if (existingProduct.length > 0) {
                return res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Product already exists',
                });
            }

            // Validate prices
            if (regularPrice < salePrice) {
                return res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Regular price must be greater than or equal to sale price',
                });
            }

            // Insert product with parameterized query
            const insertQuery = `
                INSERT INTO products
                (name, description, weight, regular_price, sale_price, released_date,
                 updated_date, store_id, status_id, stock)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await asyncQuery(insertQuery, [
                name,
                description,
                weight,
                regularPrice,
                salePrice,
                today,
                today,
                storeId,
                statusId,
                stock,
            ]);

            res.status(201).send({
                status: 'success',
                message: 'New product has been added to database',
            });
        } catch (error) {
            console.error('addProduct error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Edit product
     * FIXED: SQL injection, using parameterized queries
     */
    editProduct: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if product exists
            const checkQuery = 'SELECT * FROM products WHERE id = ?';
            const existingProduct = await asyncQuery(checkQuery, [id]);

            if (existingProduct.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product with id = ${id} doesn't exist`,
                });
            }

            const product = existingProduct[0];

            // Validate prices if provided
            const newRegularPrice = req.body.regular_price || product.regular_price;
            const newSalePrice = req.body.sale_price || product.sale_price;

            if (newRegularPrice < newSalePrice) {
                return res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Regular price must be greater than or equal to sale price',
                });
            }

            // Update product with parameterized query
            const { setClause, values } = generateUpdateQuery({
                ...req.body,
                updated_date: today,
            });

            const updateQuery = `UPDATE products SET ${setClause} WHERE id = ?`;
            await asyncQuery(updateQuery, [...values, id]);

            res.status(200).send({
                status: 'success',
                message: `Product with id ${id} has been updated`,
            });
        } catch (error) {
            console.error('editProduct error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Delete product
     * FIXED: SQL injection vulnerability
     */
    deleteProduct: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if product exists
            const checkQuery = 'SELECT * FROM products WHERE id = ?';
            const existingProduct = await asyncQuery(checkQuery, [id]);

            if (existingProduct.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product with id: ${id} doesn't exist`,
                });
            }

            // Delete related data and product
            await asyncQuery('DELETE FROM product_category WHERE product_id = ?', [id]);
            await asyncQuery('DELETE FROM product_tag WHERE product_id = ?', [id]);
            await asyncQuery('DELETE FROM product_image WHERE product_id = ?', [id]);
            await asyncQuery('DELETE FROM products WHERE id = ?', [id]);

            res.status(200).send({
                status: 'success',
                message: `Product with id: ${id} has been deleted from database`,
            });
        } catch (error) {
            console.error('deleteProduct error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Get product images
     * FIXED: SQL injection vulnerability
     */
    getProductImage: async (req, res) => {
        const { id } = req.query;

        try {
            let query = `
                SELECT pi.id, pi.product_id, p.name, pi.image
                FROM product_image pi
                RIGHT JOIN products p ON pi.product_id = p.id
            `;

            const params = [];
            if (id !== undefined) {
                query += ' WHERE pi.product_id = ?';
                params.push(id);
            }

            const result = await asyncQuery(query, params);

            res.status(200).send({
                status: 'success',
                message: 'Product images retrieved successfully',
                data: result,
            });
        } catch (error) {
            console.error('getProductImage error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Add product image
     * FIXED: SQL injection vulnerability
     */
    addProductImage: async (req, res) => {
        let { id: productId } = req.params;

        // Check productId
        if (productId === 'new-product') {
            const lastIdQuery = 'SELECT MAX(id) AS AUTO_INCREMENT FROM products';
            const getLastId = await asyncQuery(lastIdQuery);
            productId = getLastId[0].AUTO_INCREMENT;
        }

        // Check file upload
        if (req.files === undefined || req.files.length === 0) {
            return res.status(400).send({
                status: 'fail',
                code: 400,
                message: 'No images provided',
            });
        }

        try {
            // Check if product exists
            const checkQuery = 'SELECT * FROM products WHERE id = ?';
            const existingProduct = await asyncQuery(checkQuery, [productId]);

            if (existingProduct.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: "Product doesn't exist in our database",
                });
            }

            // Insert images with parameterized queries
            const insertQuery = 'INSERT INTO product_image (product_id, image) VALUES (?, ?)';
            const promises = req.files.map((file) =>
                asyncQuery(insertQuery, [productId, `image/products/${file.filename}`])
            );

            await Promise.all(promises);

            res.status(200).send({
                status: 'success',
                message: `New images for product id: ${productId} have been added to database`,
            });
        } catch (error) {
            console.error('addProductImage error:', error);

            if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(500).send({
                    status: 'fail',
                    code: 500,
                    message: 'Too many files to upload',
                });
            }

            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Edit product image
     * FIXED: SQL injection vulnerability
     */
    editProductImage: async (req, res) => {
        const { image } = req.body;
        const { id } = req.params;

        try {
            // Check if image exists
            const checkQuery = 'SELECT * FROM product_image WHERE id = ?';
            const existingImage = await asyncQuery(checkQuery, [id]);

            if (existingImage.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product image with id = ${id} doesn't exist`,
                });
            }

            // Update image
            const updateQuery = 'UPDATE product_image SET image = ? WHERE id = ?';
            await asyncQuery(updateQuery, [image, id]);

            res.status(200).send({
                status: 'success',
                message: `Product image with id: ${id} has been updated`,
            });
        } catch (error) {
            console.error('editProductImage error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Delete product image
     * FIXED: SQL injection vulnerability
     */
    deleteProductImage: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if image exists
            const checkQuery = 'SELECT * FROM product_image WHERE id = ?';
            const existingImage = await asyncQuery(checkQuery, [id]);

            if (existingImage.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product image with id: ${id} doesn't exist`,
                });
            }

            // Delete image
            const deleteQuery = 'DELETE FROM product_image WHERE id = ?';
            await asyncQuery(deleteQuery, [id]);

            res.status(200).send({
                status: 'success',
                message: `Product image with id: ${id} has been deleted from database`,
            });
        } catch (error) {
            console.error('deleteProductImage error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
