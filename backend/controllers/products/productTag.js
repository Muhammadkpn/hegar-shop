const database = require('../../database');
const { asyncQuery } = require('../../helpers');

module.exports = {
    getProductTag: async (req, res) => {
        try {
            // get all data of product tag
            const productTag = `SELECT pt.product_id, p.name AS product_name, pt.tag_id, tp.name AS tags FROM product_tag pt
            JOIN products p ON pt.product_id = p.id
            JOIN tag_product tp ON pt.tag_id = tp.id`;
            const result = await asyncQuery(productTag);

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
    countTag: async (req, res) => {
        try {
            // count tag in table
            const countTag = `SELECT pt.tag_id, tp.name AS tags, COUNT(pt.tag_id) AS count FROM product_tag pt
                        JOIN tag_product tp ON pt.tag_id = tp.id GROUP BY pt.tag_id, tp.name ORDER BY count DESC`;
            const result = await asyncQuery(countTag);

            // response
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
    countTagByStore: async (req, res) => {
        const { id } = req.params;
        try {
            // count tag in table
            const countTag = `SELECT pt.tag_id, tp.name AS tags, COUNT(pt.tag_id) AS count FROM product_tag pt
                        JOIN tag_product tp ON pt.tag_id = tp.id
                        JOIN products p ON pt.product_id = p.id
                        WHERE p.store_id = ${database.escape(id)}
                        GROUP BY pt.tag_id, tp.name ORDER BY count DESC`;
            const result = await asyncQuery(countTag);
            const finalResult = { store_id: id, countTag: result };

            // response
            res.status(200).send({
                status: 'success',
                data: finalResult,
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
    addProductTag: async (req, res) => {
        const { tagId } = req.body;
        try {
            // get product id
            const productId = 'SELECT MAX(id) AS AUTO_INCREMENT FROM products;';
            const getProductId = await asyncQuery(productId);

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
            const checkTagId = `SELECT * FROM tag_product WHERE id IN (${[...tagId]})`;
            const getCheckTagId = await asyncQuery(checkTagId);

            if (getCheckTagId.length !== tagId.length) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'One of the tag id doesn\'t exists in our database',
                });
                return;
            }

            // insert new product tag
            let value = '';
            tagId.map((item) => {
                value += `(${getProductId[0].AUTO_INCREMENT}, ${item}),`;
                return value;
            });

            const addProductTag = `INSERT INTO product_tag (product_id, tag_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(addProductTag);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Product tag has been added to the article',
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
    editProductTag: async (req, res) => {
        const { tagId } = req.body;
        const { id } = req.params;
        try {
            // check product tag in table
            const check = `SELECT * FROM product_tag WHERE id = ${id}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product tag with id = ${id} doesn't exists`,
                });
                return;
            }

            // edit product tag
            const editProductTag = `UPDATE product_tag SET tag_id = ${database.escape(tagId)} WHERE id = ${id}`;
            await asyncQuery(editProductTag);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product Tag with tag_id: ${id} has been edited`,
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
    editProductTagByStore: async (req, res) => {
        const { tagId } = req.body;
        const { id } = req.params;

        try {
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
            const checkTagId = `SELECT * FROM tag_product WHERE id IN (${[...tagId]})`;
            const getCheckTagId = await asyncQuery(checkTagId);

            if (getCheckTagId.length !== tagId.length) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'One of the tag id doesn\'t exists in our database',
                });
                return;
            }

            // delete latest product tag
            const deleteProductTag = `DELETE FROM product_tag WHERE product_id = ${database.escape(id)}`;
            await asyncQuery(deleteProductTag);

            // insert new product tag
            let value = '';
            tagId.map((item) => {
                value += `(${database.escape(id)}, ${item}),`;
                return value;
            });

            const addProductTag = `INSERT INTO product_tag (product_id, tag_id) VALUES ${value.slice(0, -1)}`;
            await asyncQuery(addProductTag);

            res.status(200).send({
                status: 'success',
                message: 'Your input has been successfully',
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
    deleteProductTag: async (req, res) => {
        const { id } = req.params;
        try {
            // check product tag in table
            const check = `SELECT * FROM product_tag WHERE id = ${database.escape(id)}`;
            const getCheck = await asyncQuery(check);

            if (getCheck.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Product tag with id = ${id} doesn't exists`,
                });
                return;
            }

            // delete product tag
            const delProductTag = `DELETE FROM product_tag WHERE id = ${database.escape(id)}`;
            await asyncQuery(delProductTag);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product Tag with tag_id: ${id} has been deleted`,
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
