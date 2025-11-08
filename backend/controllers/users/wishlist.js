const { asyncQuery, getImageUrl } = require('../../helpers/queryHelper');

/**
 * User Wishlist Controller - Optimized
 * Phase 1: Fixed SQL injection vulnerabilities
 */

module.exports = {
    /**
     * Get wishlist
     * FIXED: SQL injection vulnerability
     */
    getWishlist: async (req, res) => {
        const { id } = req.params;
        const { type } = req.query;

        try {
            let query = `
                SELECT uw.user_id,
                       CONCAT('{"store_id":', p.store_id,
                              ',"product_id":', p.id,
                              ',"name": "', p.name,
                              '","regular_price":', p.regular_price,
                              ',"sale_price":', p.sale_price,
                              ',"weight":', p.weight,
                              ',"image": "', pi.image,
                              '"}') AS products
                FROM user_wishlist uw
                JOIN products p ON uw.product_id = p.id
                JOIN product_image pi ON uw.product_id = pi.product_id
            `;

            const params = [];

            // Filter by user id
            if (type === 'user-id') {
                query += ' WHERE uw.user_id = ?';
                params.push(id);
            }

            query += ' GROUP BY uw.user_id, uw.product_id';

            let result = await asyncQuery(query, params);

            // Process results
            const finalResult = [];
            result.forEach((item) => {
                const product = JSON.parse(item.products);

                // Convert image path to full URL
                if (product.image) {
                    product.image = getImageUrl(product.image, req);
                }

                // Check if user already exists in finalResult
                const existingUser = finalResult.find((u) => u.user_id === item.user_id);

                if (!existingUser) {
                    finalResult.push({
                        user_id: item.user_id,
                        products: [product],
                    });
                } else {
                    existingUser.products.push(product);
                }
            });

            res.status(200).send({
                status: 'success',
                message: 'Wishlist retrieved successfully',
                data: type === 'user-id' ? finalResult[0] : finalResult,
            });
        } catch (error) {
            console.error('getWishlist error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Update wishlist (toggle add/remove)
     * FIXED: SQL injection vulnerabilities
     */
    updateWishlist: async (req, res) => {
        const { productId, userId } = req.body;

        try {
            // Check if product is already in wishlist
            const checkQuery = 'SELECT * FROM user_wishlist WHERE user_id = ? AND product_id = ?';
            const wishlist = await asyncQuery(checkQuery, [userId, productId]);

            if (wishlist.length !== 0) {
                // Remove from wishlist
                const deleteQuery = 'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?';
                await asyncQuery(deleteQuery, [userId, productId]);
            } else {
                // Add to wishlist
                const addQuery = 'INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)';
                await asyncQuery(addQuery, [userId, productId]);
            }

            res.status(200).send({
                status: 'success',
                message: wishlist.length !== 0
                    ? 'Product removed from wishlist'
                    : 'Product added to wishlist',
            });
        } catch (error) {
            console.error('updateWishlist error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Delete from wishlist
     * FIXED: SQL injection vulnerabilities
     */
    deleteWishlist: async (req, res) => {
        const { productId, userId } = req.params;

        try {
            // Check if exists
            const checkQuery = 'SELECT * FROM user_wishlist WHERE user_id = ? AND product_id = ?';
            const wishlist = await asyncQuery(checkQuery, [userId, productId]);

            if (wishlist.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Item not found in wishlist',
                });
            }

            // Delete from wishlist
            const deleteQuery = 'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?';
            await asyncQuery(deleteQuery, [userId, productId]);

            res.status(200).send({
                status: 'success',
                message: 'Item removed from wishlist',
            });
        } catch (error) {
            console.error('deleteWishlist error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
