/* eslint-disable no-await-in-loop */
const axios = require('axios');
const database = require('../../database');
const { asyncQuery } = require('../../helpers');

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = 'https://pro.rajaongkir.com/api';
axios.defaults.headers.common.key = '50525fc0a4bb8951f084f494acc9ba88';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = {
    getProvince: async (req, res) => {
        const { id } = req.query;
        try {
            const getProvince = await axios.get(`/province?${id ? `id=${id}` : ''}`);
            const { results } = getProvince.data.rajaongkir;

            if (id && results.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Province not found',
                });
                return;
            }
            res.status(200).send({
                status: 'success',
                message: '',
                data: results,
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
    getCity: async (req, res) => {
        const { cityId, provinceId } = req.query;
        try {
            let query = '';
            if (cityId && provinceId) {
                query += `id=${cityId}&province=${provinceId}`;
            } else if (cityId) {
                query += `id=${cityId}`;
            } else if (provinceId) {
                query += `province=${provinceId}`;
            }
            const getCity = await axios.get(`/city?${query}`);
            const { results } = getCity.data.rajaongkir;

            if ((cityId || provinceId) && results.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your request to get Province or City not found',
                });
                return;
            }
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
                data: results,
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
    getSubdistrict: async (req, res) => {
        const { cityId, subdistrictId } = req.query;
        try {
            let query = '';
            if (cityId && subdistrictId) {
                query += `city=${cityId}&id=${subdistrictId}`;
            } else if (cityId) {
                query += `city=${cityId}`;
            } else if (subdistrictId) {
                query += `id=${subdistrictId}`;
            }
            const getCity = await axios.get(`/subdistrict?${query}`);

            const { results } = getCity.data.rajaongkir;

            if ((!cityId || !subdistrictId) && results.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your request to get Subdistrict not found',
                });
                return;
            }
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
                data: results,
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
    checkDeliveryFee: async (req, res) => {
        const {
            storeOriginType, destination, destinationType, store,
        } = req.body;
        try {
            if (!Array.isArray(store)) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Store data format must array',
                });
                return;
            }

            // check input for check delivery fee
            if (!storeOriginType && !destination && !destinationType) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'storeOriginType, destination, and destinationType is required',
                });
                return;
            }

            for (let i = 0; i < store.length; i += 1) {
                const checkOriginId = Object.prototype.hasOwnProperty.call(store[i], 'originId');
                const checkStoreId = Object.prototype.hasOwnProperty.call(store[i], 'storeId');
                if (!checkOriginId || !checkStoreId) {
                    res.status(422).send({
                        status: 'fail',
                        code: 422,
                        message: 'Variable store must be an array of object formats that contain property storeId and originId.',
                    });
                    return;
                }
            }

            const finalResult = [];
            for (let i = 0; i < store.length; i += 1) {
                // check store in database
                const checkStore = `SELECT * FROM stores WHERE user_id = ${database.escape(store[i].storeId)}`;
                const getCheckStore = await asyncQuery(checkStore);

                if (getCheckStore.length === 0) {
                    res.status(404).send({
                        status: 'fail',
                        code: 404,
                        message: 'Store not found',
                    });
                    return;
                }

                // check courier in spesific store
                const checkCourier = `SELECT sc.store_id, sc.courier_id, ac.code AS courier_code, ac.name AS courier_name FROM store_courier sc
                                JOIN admin_courier ac ON sc.courier_id = ac.id
                                WHERE store_id = ${database.escape(store[i].storeId)}`;
                const getCheckCourier = await asyncQuery(checkCourier);

                if (getCheckCourier.length === 0) {
                    res.status(404).send({
                        status: 'fail',
                        code: 404,
                        message: "This store hasn't chosen a courier",
                    });
                    return;
                }

                let kurir = '';
                getCheckCourier.forEach((value) => {
                    kurir += `${value.courier_code}:`;
                });

                // body for input to check ongkir via raja ongkir
                const body = {
                    origin: store[i].originId,
                    originType: storeOriginType,
                    weight: store[i].weight,
                    destination,
                    destinationType,
                    courier: kurir.slice(0, -1),
                };

                const getCost = await axios.post('/cost', body);
                // eslint-disable-next-line camelcase
                const { results, origin_details } = getCost.data.rajaongkir;

                results.forEach((value, idx) => {
                    const filterCourier = getCheckCourier.filter(
                        (val) => val.courier_code === value.code || val.courier_code === 'jnt',
                    );
                    if (filterCourier.length > 0) {
                        results[idx].courier_id = filterCourier[0].courier_id;
                    }
                });

                // get postcode from database
                const postcode = `SELECT * FROM store_address WHERE id = ${database.escape(getCheckStore[0].main_address_id)}`;
                const getPostcode = await asyncQuery(postcode);
                origin_details.postcode = getPostcode[0].postcode;
                finalResult.push({
                    store_id: store[i].storeId,
                    store_name: getCheckStore[0].store_name,
                    sub_order_number: store[i].sub_order_number,
                    origin_details,
                    courier: results,
                });
            }

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
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
    getAdminCourier: async (req, res) => {
        const { search } = req.query;
        try {
            let courier = 'SELECT * FROM admin_courier';

            if (Object.prototype.hasOwnProperty.call(req.query, 'search')) {
                courier += ` WHERE code LIKE '%${search}%' OR name LIKE '%${search}%'`;
            }

            const getCourier = await asyncQuery(courier);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
                data: getCourier,
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
    getAdminCourierById: async (req, res) => {
        const { id } = req.params;
        try {
            const courier = `SELECT * FROM admin_courier WHERE id = ${database.escape(id)}`;
            const getCourierById = await asyncQuery(courier);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
                data: getCourierById,
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
    addAdminCourier: async (req, res) => {
        const { name, code } = req.body;
        try {
            // check courier in database
            const checkCourier = `SELECT * FROM admin_courier WHERE name = ${database.escape(name)} OR code = ${database.escape(code)}`;
            const getCheckCourier = await asyncQuery(checkCourier);

            if (getCheckCourier.length > 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: `Courier with name = ${name} already exists in our database`,
                });
                return;
            }

            // add courier
            const addCourier = `INSERT INTO admin_courier (name, code) VALUES (${database.escape(name)}, ${database.escape(code)})`;
            await asyncQuery(addCourier);

            res.status(200).send({
                status: 'success',
                message: "You've successful add a new courier to our database",
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
    editAdminCourier: async (req, res) => {
        const { id } = req.params;
        const { name, code } = req.body;
        try {
            const checkCourier = `SELECT * FROM admin_courier WHERE id = ${database.escape(id)}`;
            const getCheckCourier = await asyncQuery(checkCourier);

            if (getCheckCourier.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Courier not found',
                });
                return;
            }

            // edit courier
            const editCourier = `UPDATE admin_courier SET name = ${database.escape(name)}, code = ${database.escape(code)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(editCourier);

            res.status(200).send({
                status: 'success',
                message: 'Edit courier has been successful',
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
    deleteAdminCourier: async (req, res) => {
        const { id } = req.params;
        try {
            const checkCourier = `SELECT * FROM admin_courier WHERE id = ${database.escape(id)}`;
            const getCheckCourier = await asyncQuery(checkCourier);

            if (getCheckCourier.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Courier not found',
                });
                return;
            }

            // edit courier
            const deleteCourier = `DELETE FROM admin_courier WHERE id = ${database.escape(id)}`;
            await asyncQuery(deleteCourier);

            res.status(200).send({
                status: 'success',
                message: 'Edit courier has been successful',
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
    getStoreCourier: async (req, res) => {
        const { id } = req.params;
        const { search } = req.query;
        try {
            let storeCourier = `SELECT * FROM store_courier sc
                            JOIN admin_courier ac ON sc.courier_id = ac.id
                            WHERE store_id = ${database.escape(id)}`;
            if (Object.prototype.hasOwnProperty.call(req.query, 'search')) {
                storeCourier += ` AND (ac.code LIKE '%${search}%' OR ac.name LIKE '%${search}%')`;
            }
            const getStoreCourier = await asyncQuery(storeCourier);

            getStoreCourier.forEach((item, index) => {
                delete getStoreCourier[index].id;
            });

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successful',
                data: getStoreCourier,
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
    editStoreCourier: async (req, res) => {
        const { id } = req.params;
        const { courierId } = req.body;
        try {
            // check length of courierId
            if (!Array.isArray(courierId) && courierId.length === 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Your input not found',
                });
                return;
            }
            // check duplicate in CategoryId
            const checkDuplicate = [...new Set(courierId)];
            if (checkDuplicate.length !== courierId.length) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Your input has duplicate',
                });
                return;
            }

            // delete courier in store
            const deleteCourier = `DELETE FROM store_courier WHERE store_id = ${database.escape(id)}`;
            await asyncQuery(deleteCourier);

            // add new courier in store
            let insertCourier = '';
            courierId.forEach((item) => {
                insertCourier += `(${database.escape(id)}, ${database.escape(item)}),`;
            });
            const addNewCourier = `INSERT INTO store_courier (store_id, courier_id) VALUES ${insertCourier.slice(0, -1)}`;
            await asyncQuery(addNewCourier);

            res.status(200).send({
                status: 'success',
                message: 'You have been successful to add a new courier',
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
