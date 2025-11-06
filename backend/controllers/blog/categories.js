const database = require('../../database');
const { generateQuery, asyncQuery } = require('../../helpers/queryHelper');

module.exports = {
    getCategory: async (req, res) => {
        const { name } = req.query;
        try {
            let category = 'SELECT * FROM category_blog';

            // check query
            if (Object.prototype.hasOwnProperty.call(req.query, 'name')) {
                category += ` WHERE name LIKE '%${name}%'`;
            }

            const result = await asyncQuery(category);

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
    addCategory: async (req, res) => {
        const { name } = req.body;
        try {
            // check category in table
            const category = `SELECT * FROM category_blog WHERE name = ${database.escape(name)}`;
            const result = await asyncQuery(category);

            if (result.length !== 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: `Category with title = ${name} already exists`,
                });
                return;
            }

            // insert new category
            const addCategory = `INSERT INTO category_blog (name) VALUES (${database.escape(name)})`;
            await asyncQuery(addCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Category has been added to the database',
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
        const { id } = req.params;

        try {
            // check category in table
            const category = `SELECT * FROM category_blog WHERE id = ${database.escape(id)}`;
            const result = await asyncQuery(category);

            if (result.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Category with id = ${id} doesn't exists`,
                });
                return;
            }

            // edit article data
            const editCategory = `UPDATE category_blog SET ${generateQuery(req.body)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(editCategory);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Category has been edited',
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
            // check category
            const category = `SELECT * FROM category_blog WHERE id = ${database.escape(id)}`;
            const result = await asyncQuery(category);

            if (result.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Category with id = ${id} doesn't exists`,
                });
                return;
            }

            // delete category
            const delCategory = `DELETE FROM category_blog WHERE id = ${database.escape(id)}`;
            await asyncQuery(delCategory);

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
