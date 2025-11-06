const database = require('../../database');
const { asyncQuery, today } = require('../../helpers/queryHelper');

module.exports = {
    getCommentByArticle: async (req, res) => {
        const { id } = req.params;

        try {
            // get all comment with user profile, blog details, and comment data
            const query = `SELECT tb.id, tb.user_id, tb.full_name, tb.image, tb.date, tb.comment, tb.status, GROUP_CONCAT(tb.reply SEPARATOR '//') AS reply
                        FROM (SELECT bc1.id, bc1.user_id, bc1.full_name, bc1.image, bc1.date, bc1.comment, bc1.status,
                            (CASE WHEN bc2.user_id IS NULL THEN NULL
                                ELSE CONCAT('{"id": ', bc2.id, ',"user_id": ', bc2.user_id, ',"full_name": "', bc2.full_name, '","image":"', bc2.image, '","date":"', bc2.date, 
                                '","comment":"', bc2.comment, '", "status":', bc2.status, '}')
                            END) AS reply
                            FROM (SELECT bc.*, tb.full_name, tb.image FROM blog_comment bc
                                LEFT JOIN (SELECT u.id, uk.full_name, u.image FROM users u 
                                    JOIN user_ktp uk ON u.id = uk.user_id) tb ON bc.user_id = tb.id
                                WHERE bc.blog_id = ${database.escape(id)} AND bc.reply_id IS NULL AND bc.status = 1) bc1
                            LEFT JOIN (SELECT bc.*, tb.full_name, tb.image FROM blog_comment bc
                                LEFT JOIN (SELECT u.id, uk.full_name, u.image FROM users u 
                                    JOIN user_ktp uk ON u.id = uk.user_id) tb ON bc.user_id = tb.id
                                WHERE bc.status = 1
                            ) bc2 ON bc1.id = bc2.reply_id
                            ORDER BY bc2.date) AS tb
                        GROUP BY tb.id, tb.user_id, tb.full_name, tb.image, tb.date, tb.comment
                        ORDER BY tb.date;`;
            const result = await asyncQuery(query);

            let str = '';
            result.forEach((item, index) => {
                const tempReply = [];
                let tempArr = [];
                // convert data from string to array
                tempArr = (item.reply ? item.reply.split('//') : []);
                tempArr.forEach((value) => {
                    // convert data from string to object
                    str = value.toString();
                    tempReply.push(JSON.parse(str));
                });
                result[index].reply = tempReply;
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
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
    getCommentsAdmin: async (req, res) => {
        const { id } = req.params;

        try {
            // get all comment with user profile, blog details, and comment data
            const query = `SELECT tb.id, tb.user_id, tb.full_name, tb.image, tb.date, tb.comment, tb.status, GROUP_CONCAT(tb.reply SEPARATOR '//') AS reply
                        FROM (SELECT bc1.id, bc1.user_id, bc1.full_name, bc1.image, bc1.date, bc1.comment, bc1.status,
                            (CASE WHEN bc2.user_id IS NULL THEN NULL
                            ELSE CONCAT('{"id": ', bc2.id, ',"user_id": ', bc2.user_id, ',"full_name": "', bc2.full_name, '","image":"', bc2.image, '","date":"', bc2.date, 
                            '","comment":"', bc2.comment, '", "status":', bc2.status, '}')
                            END) AS reply
                            FROM (SELECT bc.*, tb.full_name, tb.image FROM blog_comment bc
                                LEFT JOIN (SELECT u.id, uk.full_name, u.image FROM users u 
                                    JOIN user_ktp uk ON u.id = uk.user_id) tb ON bc.user_id = tb.id
                                WHERE bc.blog_id = ${database.escape(id)} AND bc.reply_id IS NULL) bc1
                            LEFT JOIN (SELECT bc.*, tb.full_name, tb.image FROM blog_comment bc
                                LEFT JOIN (SELECT u.id, uk.full_name, u.image FROM users u 
                                    JOIN user_ktp uk ON u.id = uk.user_id) tb ON bc.user_id = tb.id
                            ) bc2 ON bc1.id = bc2.reply_id
                            ORDER BY bc2.date) AS tb
                        GROUP BY tb.id, tb.user_id, tb.full_name, tb.image, tb.date, tb.comment
                        ORDER BY tb.date;`;
            const result = await asyncQuery(query);

            let str = '';
            result.forEach((item, index) => {
                const tempReply = [];
                let tempArr = [];
                // convert data from string to array
                tempArr = (item.reply ? item.reply.split('//') : []);
                tempArr.forEach((value) => {
                    // convert data from string to object
                    str = value.toString();
                    tempReply.push(JSON.parse(str));
                });
                result[index].reply = tempReply;
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
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
    addComment: async (req, res) => {
        const {
            userId, comment, replyId, blogId, status,
        } = req.body;

        try {
            // add comment
            const query = `INSERT INTO blog_comment (user_id, date, comment, reply_id, blog_id, status)
                    VALUES (${database.escape(userId)}, ${database.escape(today)}, ${database.escape(comment)}, ${database.escape(replyId)}, ${database.escape(blogId)}, ${status !== 1 ? database.escape(status) : 1})`;
            await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your comment has been sent',
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
    editComment: async (req, res) => {
        const { id } = req.params;
        const { comment, status } = req.body;
        const { type } = req.query;
        try {
            // check blog comment in table
            const check = `SELECT * FROM blog_comment WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Comment with id = ${id} doesn't exists`,
                });
                return;
            }

            // edit blog comment
            let query = '';
            if (type === 'admin') {
                query = `UPDATE blog_comment SET status = ${database.escape(status)} WHERE id = ${database.escape(id)}`;
            } else {
                query = `UPDATE blog_comment SET date = ${database.escape(today)}, comment = ${database.escape(comment)} WHERE id = ${database.escape(id)}`;
            }
            await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Comment with id: ${id} has been edited`,
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
    deleteComment: async (req, res) => {
        const { id } = req.params;
        try {
            // check blog comment in table
            const check = `SELECT * FROM blog_comment WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 404,
                    code: 404,
                    message: `Comment with id = ${id} doesn't exists`,
                });
                return;
            }

            // delete blog comment
            const query = `DELETE FROM blog_comment WHERE id = ${database.escape(id)}`;
            await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your comment has been deleted',
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
