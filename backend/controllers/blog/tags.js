const database = require('../../database');
const { asyncQuery, generateQuery } = require('../../helpers/queryHelper');

module.exports = {
    getTag: async (req, res) => {
        const { name } = req.query;
        try {
            let tags = 'SELECT * FROM tag_blog';

            // check query
            if (Object.prototype.hasOwnProperty.call(req.query, 'name')) {
                tags += ` WHERE name LIKE '%${name}%'`;
            }
            const result = await asyncQuery(tags);

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
    addTags: async (req, res) => {
        const { name } = req.body;
        try {
            // check tag
            const tag = `SELECT * FROM tag_blog WHERE name = ${database.escape(name)}`;
            const result = await asyncQuery(tag);

            if (result.length !== 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: `Tag with title = ${name} already exists`,
                });
                return;
            }

            // insert new article
            const addTags = `INSERT INTO tag_blog (name) VALUES (${database.escape(name)})`;
            await asyncQuery(addTags);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Tag has been added to database',
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
    editTags: async (req, res) => {
        const { id } = req.params;

        try {
            // check tag
            const tag = `SELECT * FROM tag_blog WHERE id = ${database.escape(id)}`;
            const result = await asyncQuery(tag);

            if (result.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Tag with title = ${id} doesn't exists`,
                });
                return;
            }

            // edit article data
            const editTags = `UPDATE tag_blog SET ${generateQuery(req.body)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(editTags);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Tag with id: ${id} has been edited`,
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
    deleteTags: async (req, res) => {
        const { id } = req.params;
        try {
            // check tag
            const tag = `SELECT * FROM tag_blog WHERE id = ${database.escape(id)}`;
            const result = await asyncQuery(tag);

            if (result.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Tag with title = ${id} doesn't exists`,
                });
                return;
            }

            // delete tags
            const delTags = `DELETE FROM tag_blog WHERE id = ${database.escape(id)}`;
            await asyncQuery(delTags);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Tag with id: ${id} has been deleted`,
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
