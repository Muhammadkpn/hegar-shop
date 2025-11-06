const database = require('../../database');
const { asyncQuery } = require('../../helpers/queryHelper');

module.exports = {
    getWishlist: async (req, res) => {
        const { id } = req.params;
        const { type } = req.query;
        try {
            // get data wishlist
            let query = `SELECT uw.user_id, CONCAT('{"store_id":', p.store_id, ',"product_id":', p.id, ',"name": "', p.name,'","regular_price":', p.regular_price,',"sale_price":', p.sale_price, ', "weight":', p.weight, ',"image": "', pi.image, '"}') AS products FROM user_wishlist uw
            JOIN products p ON uw.product_id = p.id
            JOIN product_image pi ON uw.product_id = pi.product_id`;
            // get data wishlist by user id
            if (type === 'user-id') {
                query += ` WHERE uw.user_id = ${database.escape(id)}`;
            }
            query += ' GROUP BY uw.user_id, uw.product_id;';
            let result = await asyncQuery(query);

            const finalResult = [];
            result.forEach((item) => {
                let tempArr = '';

                // convert string to object
                tempArr = JSON.parse(item.products);

                // check user_id in finalResult to avoid double user_id
                const checkUserId = finalResult.filter((check) => check.user_id === item.user_id);
                if (checkUserId.length === 0) {
                    finalResult.push({ user_id: item.user_id, products: [] });
                }

                // store all wishlist of each users to array
                finalResult.forEach((val) => {
                    if (item.user_id === val.user_id) {
                        val.products.push(tempArr);
                    }
                });
            });
            // change result from query to finalResult that have manipulated
            result = finalResult;

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Wishlist has been successfully processed',
                data: type === 'user-id' ? result[0] : result,
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
    updateWishlist: async (req, res) => {
        const { productId, userId } = req.body;
        try {
            // check wishlist in database
            const checkWishlist = `SELECT * FROM user_wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
            const wishlist = await asyncQuery(checkWishlist);

            // if product already in the wishlist, delete product from wishlist
            if (wishlist.length !== 0) {
                const deleteWishlist = `DELETE FROM user_wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
                await asyncQuery(deleteWishlist);
            } else {
                const addWishlist = `INSERT INTO user_wishlist (user_id, product_id) VALUES (${userId}, ${productId})`;
                await asyncQuery(addWishlist);
            }

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your wishlist has been updated',
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
    deleteWishlist: async (req, res) => {
        const { productId, userId } = req.params;
        try {
            // check wishlist in database
            const checkWishlist = `SELECT * FROM user_wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
            const wishlist = await asyncQuery(checkWishlist);

            if (wishlist.length === 0) {
                res.status(200).send({
                    status: 'fail',
                    code: 404,
                    message: 'Wishlist id doesn\'t exists',
                });
            }

            // delete wishlist
            const deleteWishlist = `DELETE FROM user_wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
            await asyncQuery(deleteWishlist);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your wishlist has been deleted',
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
