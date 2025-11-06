const database = require('../../database');
const { asyncQuery } = require('../../helpers/queryHelper');

module.exports = {
    getBlogCategory: async (req, res) => {
        try {
            // get all blog category
            const blogCategory = `SELECT bc.blog_id, b.title AS title_blog, bc.category_id, cb.name AS category FROM blog_category bc
            JOIN blog b ON bc.blog_id = b.id
            JOIN category_blog cb ON bc.category_id = cb.id`;
            const result = await asyncQuery(blogCategory);

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
    countCategory: async (req, res) => {
        try {
            // count category
            const countCategory = `SELECT bc.category_id, cb.name AS category, COUNT(bc.category_id) AS count FROM blog_category bc
                            JOIN category_blog cb ON bc.category_id = cb.id GROUP BY bc.category_id ORDER BY count DESC;`;
            const result = await asyncQuery(countCategory);

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
    addBlogCategory: async (req, res) => {
        const { categoryId } = req.body;

        try {
            // Get blog id
            const blogId = 'SELECT MAX(id) AS AUTO_INCREMENT FROM blog;';
            const getBlogId = await asyncQuery(blogId);

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

            let value = '';
            categoryId.forEach((item) => {
                value += `(${database.escape(getBlogId[0].AUTO_INCREMENT)}, ${database.escape(item)}),`;
            });
            // insert new article
            const addBlogCategory = `INSERT INTO blog_category (blog_id, category_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(addBlogCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Blog category has been added to the database',
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
    editBlogCategory: async (req, res) => {
        const { categoryId } = req.body;
        const { id } = req.params;

        try {
            // check availability of blog category
            const check = `SELECT * FROM blog_category WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Blog category with id ${id} doesn't exists`,
                });
                return;
            }

            // check duplicate categoryId
            const checkDuplicate = [...new Set(categoryId)];
            if (checkDuplicate.length !== categoryId.length) {
                res.status(403).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your input has duplicate value',
                });
                return;
            }

            // check categoryId in tags
            const checkCategoryId = `SELECT * FROM category_blog WHERE id IN (${[...categoryId]})`;
            const getCheckCategoryId = await asyncQuery(checkCategoryId);

            if (getCheckCategoryId.length !== categoryId.length) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'One of the tag id doesn\'t exists in our database',
                });
                return;
            }

            // delete blog category
            const deleteBlogTag = `DELETE FROM blog_category WHERE blog_id = ${database.escape(id)}`;
            await asyncQuery(deleteBlogTag);

            // add blog category
            let value = '';
            categoryId.map((item) => {
                value += `(${database.escape(id)}, ${database.escape(item)}),`;
                return value;
            });
            const editBlogCategory = `INSERT blog_category (blog_id, category_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(editBlogCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Blog category with ${id} has been edited`,
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
    deletBlogCategory: async (req, res) => {
        const { id } = req.params;

        try {
            // check availability of blog category
            const check = `SELECT * FROM blog_category WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Blog category with id ${id} doesn't exists`,
                });
                return;
            }

            // delete article category
            const delArticleCategory = `DELETE FROM blog_category WHERE id = ${database.escape(id)}`;
            await asyncQuery(delArticleCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Blog Category with id: ${id} has been deleted`,
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
