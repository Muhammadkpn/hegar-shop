const database = require('../../database');
const { asyncQuery, generateQuery, today } = require('../../helpers');
const { getImageUrls } = require('../../helpers/queryHelper');

module.exports = {
    getProductReview: async (req, res) => {
        const { id } = req.params;
        const { type } = req.query;
        try {
            // get all product review
            let query = `SELECT pr.id, pr.review_id, uk.user_id, uk.full_name, od.order_number, od.product_id, pr.date,
                    GROUP_CONCAT(ri.image) AS image, pr.comment, pr.rating, pr.status FROM product_review pr
                    LEFT JOIN review_image ri ON pr.review_id = ri.review_id
                    JOIN order_details od ON pr.id = od.review_id
                    LEFT JOIN user_ktp uk ON pr.user_id = uk.user_id
                    WHERE pr.rating IS NOT NULL`;

            // type of query
            if (type === 'user-id') {
                query += ` AND pr.user_id = ${database.escape(id)} GROUP BY pr.id;`;
            } else if (type === 'order-number') {
                query += ` AND od.order_number = ${database.escape(id)} GROUP BY pr.id;`;
            } else if (type === 'review-id') {
                query += ` AND pr.review_id = ${database.escape(id)} GROUP BY pr.id;`;
            } else if (type === 'product-id') {
                query += ` AND od.product_id = ${database.escape(id)} GROUP BY pr.id;`;
            } else if (type === 'testimony') {
                query += ` GROUP BY pr.id ORDER BY rand() LIMIT ${database.escape(id)}`;
            }
            const result = await asyncQuery(query);

            // convert data to array and convert to full URLs
            result.forEach((item, index) => {
                if (item.image) {
                    const imagePaths = item.image.split(',');
                    result[index].image = getImageUrls(imagePaths, req);
                }
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully!',
                data: type === 'review-id' ? result[0] : result,
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
    reviewUpload: async (req, res) => {
        const { id } = req.params;

        try {
            // user upload foto bukti pembayaran
            req.files.forEach(async (item) => {
                const query = `INSERT INTO review_image (review_id, image) VALUES (${id}, 'image/users/review/${item.filename}');`;
                await asyncQuery(query);
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your image has been uploaded to database',
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
    addReview: async (req, res) => {
        const { comment, rating } = req.body;
        const { id } = req.params;
        try {
            // check review
            const checkReview = `SELECT * FROM product_review WHERE id = ${database.escape(id)}`;
            const resultCheck = asyncQuery(checkReview);

            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Review not found',
                });
                return;
            }

            // insert new review
            const addReview = `UPDATE product_review SET date='${today}', comment='${comment}', rating=${rating}, status=1 WHERE id=${id}`;
            await asyncQuery(addReview);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your product review has been uploaded to database',
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
    editReview: async (req, res) => {
        const { id } = req.params;
        try {
            // check review
            const checkReview = `SELECT * FROM product_review WHERE id = ${database.escape(id)}`;
            const resultCheck = asyncQuery(checkReview);

            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Review not found',
                });
                return;
            }

            // edit Review product
            const editReview = `UPDATE product_review SET ${generateQuery(req.body)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(editReview);

            // send response
            res.status(200).send({
                status: 'fail',
                message: 'Your product review has been edited',
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
    deleteReview: async (req, res) => {
        const { id } = req.params;

        try {
            // check review
            const checkReview = `SELECT * FROM product_review WHERE id = ${database.escape(id)}`;
            const resultCheck = asyncQuery(checkReview);

            if (resultCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Review not found',
                });
                return;
            }

            // delete review
            const deleteReview = `DELETE FROM product_review WHERE id = ${database.escape(id)}`;
            await asyncQuery(deleteReview);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your review has been deleted',
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
