const database = require('../../database');
const { asyncQuery, generateQuery } = require('../../helpers/queryHelper');

module.exports = {
    getMainAddress: async (req, res) => {
        const { id } = req.params;
        try {
            // get main address
            const mainAddress = `SELECT ua.*, u.email, u.user_status_id FROM users u
            JOIN user_address ua ON u.main_address_id = ua.id
            WHERE ua.user_id = ${database.escape(id)};`;
            const result = await asyncQuery(mainAddress);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
                data: result[0],
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
    getAddress: async (req, res) => {
        const { id } = req.params;
        const { type, filter } = req.query;

        try {
            // get address by type
            let getAddress = '';
            if (type === 'user-id') {
                getAddress = `SELECT * FROM user_address
                        WHERE user_id = ${database.escape(id)};`;
            } else if (type === 'shipping-address') {
                getAddress = `SELECT id AS shipping_id, user_id, recipient_name, recipient_phone, province, city, postcode, address  FROM user_address
                        WHERE id = ${database.escape(id)};`;
            } else if (type === 'filter-address') {
                getAddress = `SELECT * FROM user_ktp uk
                        JOIN user_address ua ON uk.user_id = ua.user_id
                        WHERE uk.user_id = ${database.escape(id)} AND (ua.recipient_name LIKE '%${filter}%' OR ua.recipient_phone LIKE '%${filter}%')`;
            }
            const result = await asyncQuery(getAddress);

            // send response
            res.status(200).send({
                status: 'success',
                data: type === 'user-id' || type === 'store-address' || type === 'filter-address' ? result : result[0],
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
    addAddress: async (req, res) => {
        const {
            userId, recipientName, recipientPhone, province, provinceId, city,
            cityId, subdistrict, subdistrictId, postcode, address,
        } = req.body;

        try {
            // add address
            const addAddress = `INSERT INTO user_address (user_id, recipient_name, recipient_phone, province, province_id, city, city_id, subdistrict, subdistrict_id, postcode, address) 
                        VALUES (${database.escape(userId)}, ${database.escape(recipientName)}, ${database.escape(recipientPhone)}, ${database.escape(province)}, ${database.escape(provinceId)}, ${database.escape(city)}, ${database.escape(cityId)}, ${database.escape(subdistrict)}, ${database.escape(subdistrictId)}, ${database.escape(postcode)}, ${database.escape(address)})`;
            const getAddress = await asyncQuery(addAddress);

            // set new address to main address
            const mainAddress = `UPDATE users SET main_address_id = ${getAddress.insertId} WHERE id = ${userId}`;
            await asyncQuery(mainAddress);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Add address has been successfully',
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
    editAddress: async (req, res) => {
        const { id } = req.params;

        try {
            // check user address id
            const checkId = `SELECT * FROM user_address WHERE id = ${database.escape(id)}`;
            const resultId = await asyncQuery(checkId);

            if (resultId.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Address with id : ${id} doesn't exists`,
                });
                return;
            }

            //  edit address
            const edit = `UPDATE user_address SET ${generateQuery(req.body)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(edit);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Edit address has been successfully',
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
    deleteAddress: async (req, res) => {
        const { id } = req.params;
        try {
            // check user address id
            const checkId = `SELECT * FROM user_address WHERE id = ${database.escape(id)}`;
            const resultId = await asyncQuery(checkId);

            if (resultId.length === 0) {
                res.status(400).send(`Address with id : ${database.escape(id)} doesn't exists`);
                return;
            }

            // check if the address is main address in users table
            const mainAddress = `SELECT * FROM users WHERE id = ${resultId[0].user_id}`;
            const getMainAddress = await asyncQuery(mainAddress);

            if (getMainAddress.length !== 0) {
                const updateMainAddress = `UPDATE users SET main_address_id = null WHERE id = ${resultId[0].user_id}`;
                await asyncQuery(updateMainAddress);
            }
            // delete user address
            const del = `DELETE FROM user_address WHERE id = ${database.escape(id)}`;
            await asyncQuery(del);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your address has been deleted',
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
    getStoreAddress: async (req, res) => {
        const { id } = req.params;
        const { search } = req.query;
        try {
            let query = `SELECT * FROM store_address WHERE user_id = ${database.escape(id)}`;
            if (Object.prototype.hasOwnProperty.call(req.query, 'search')) {
                query += ` AND (recipient_name LIKE '%${search}%' OR recipient_phone LIKE '%${search}%')`;
            }

            const result = await asyncQuery(query);

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
    addStoreAddress: async (req, res) => {
        const {
            userId, recipientName, recipientPhone, province, provinceId, city,
            cityId, subdistrict, subdistrictId, postcode, address,
        } = req.body;

        try {
            // add address
            const addAddress = `INSERT INTO store_address (user_id, recipient_name, recipient_phone, province, province_id, city, city_id, subdistrict, subdistrict_id, postcode, address) 
                        VALUES (${database.escape(userId)}, ${database.escape(recipientName)}, ${database.escape(recipientPhone)}, ${database.escape(province)}, ${database.escape(provinceId)}, ${database.escape(city)}, ${database.escape(cityId)}, ${database.escape(subdistrict)}, ${database.escape(subdistrictId)}, ${database.escape(postcode)}, ${database.escape(address)})`;
            const getAddress = await asyncQuery(addAddress);

            // set new address to main address
            const mainAddress = `UPDATE stores SET main_address_id = ${getAddress.insertId} WHERE id = ${userId}`;
            await asyncQuery(mainAddress);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Add address has been successfully',
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
    editStoreAddress: async (req, res) => {
        const { id } = req.params;

        try {
            // check user address id
            const checkId = `SELECT * FROM store_address WHERE id = ${database.escape(id)}`;
            const resultId = await asyncQuery(checkId);

            if (resultId.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Store address with id : ${id} doesn't exists`,
                });
                return;
            }

            //  edit address
            const edit = `UPDATE store_address SET ${generateQuery(req.body)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(edit);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Edit store address has been successfully',
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
    deleteStoreAddress: async (req, res) => {
        const { id } = req.params;
        try {
            // check user address id
            const checkId = `SELECT * FROM store_address WHERE id = ${database.escape(id)}`;
            const resultId = await asyncQuery(checkId);

            if (resultId.length === 0) {
                res.status(400).send(`Store address with id : ${database.escape(id)} doesn't exists`);
                return;
            }

            // check if the address is main address in users table
            const mainAddress = `SELECT * FROM stores WHERE id = ${resultId[0].user_id}`;
            const getMainAddress = await asyncQuery(mainAddress);

            if (getMainAddress.length !== 0) {
                const updateMainAddress = `UPDATE stores SET main_address_id = null WHERE id = ${resultId[0].user_id}`;
                await asyncQuery(updateMainAddress);
            }
            // delete user address
            const del = `DELETE FROM store_address WHERE id = ${database.escape(id)}`;
            await asyncQuery(del);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your address has been deleted',
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
