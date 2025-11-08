const database = require('../../database');
const { asyncQuery } = require('../../helpers/queryHelper');

module.exports = {
    getBlogTag: async (req, res) => {
        try {
            // get all data of blog tag
            const blogTag = `SELECT bt.blog_id, b.title AS title_blog, bt.tag_id, t.name AS tags FROM blog_tag bt
                        JOIN blog b ON bt.blog_id = b.id
                        JOIN tag_blog t ON bt.tag_id = t.id`;
            const result = await asyncQuery(blogTag);

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
                code: 505,
                message: error.message,
            });
        }
    },
    countTag: async (req, res) => {
        try {
            // count tag in table
            const countTag = `SELECT bt.tag_id, tb.name AS tags, COUNT(bt.tag_id) AS count FROM blog_tag bt
            JOIN tag_blog tb ON bt.tag_id = tb.id GROUP BY bt.tag_id, tb.name ORDER BY count DESC`;
            const result = await asyncQuery(countTag);

            // response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 505,
                message: error.message,
            });
        }
    },
    addBlogTag: async (req, res) => {
        const { tagId } = req.body;
        try {
            // Get blog id
            const blogId = 'SELECT MAX(id) AS AUTO_INCREMENT FROM blog;';
            const getBlogId = await asyncQuery(blogId);

            // check duplicate in CategoryId
            const checkDuplicate = [...new Set(tagId)];
            if (checkDuplicate.length !== tagId.length) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Your input has duplicate',
                });
                return;
            }

            let value = '';
            tagId.forEach((item) => {
                value += `(${getBlogId[0].AUTO_INCREMENT}, ${database.escape(item)}),`;
            });

            // insert new blog tag
            const addBlogTag = `INSERT INTO blog_tag (blog_id, tag_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(addBlogTag);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Blog tag has been added to the article',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 505,
                message: error.message,
            });
        }
    },
    editBlogTag: async (req, res) => {
        const { tagId } = req.body;
        const { id } = req.params;
        try {
            // check blog tag in table
            const check = `SELECT * FROM blog_tag WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Blog tag with id = ${id} doesn't exists`,
                });
                return;
            }

            // check duplicate tagId
            const checkDuplicate = [...new Set(tagId)];
            if (checkDuplicate.length !== tagId.length) {
                res.status(403).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your input has duplicate value',
                });
                return;
            }

            // check tagId in tags
            const checkTagId = `SELECT * FROM tag_blog WHERE id IN (${[...tagId]})`;
            const getCheckTagId = await asyncQuery(checkTagId);

            if (getCheckTagId.length !== tagId.length) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'One of the tag id doesn\'t exists in our database',
                });
                return;
            }

            // delete blog tag
            const deleteBlogTag = `DELETE FROM blog_tag WHERE blog_id = ${database.escape(id)}`;
            await asyncQuery(deleteBlogTag);

            // add blog tag
            let value = '';
            tagId.map((item) => {
                value += `(${database.escape(id)}, ${database.escape(item)}),`;
                return value;
            });
            const editBlogCategory = `INSERT blog_tag (blog_id, tag_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(editBlogCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Blog Tag with tag_id: ${id} has been edited`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 505,
                message: error.message,
            });
        }
    },
    deleteBlogTag: async (req, res) => {
        const { id } = req.params;
        try {
            // check blog tag in table
            const check = `SELECT * FROM blog_tag WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Blog tag with id = ${id} doesn't exists`,
                });
                return;
            }

            // delete blog tag
            const delBlogTag = `DELETE FROM blog_tag WHERE id = ${database.escape(id)}`;
            await asyncQuery(delBlogTag);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Blog Tag with tag_id: ${id} has been deleted`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 505,
                message: error.message,
            });
        }
    },
};
