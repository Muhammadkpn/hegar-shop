const database = require('../../database');
const { asyncQuery, today } = require('../../helpers');
const { getImageUrl } = require('../../helpers/queryHelper');

module.exports = {
    getHistory: async (req, res) => {
        const { id } = req.params;
        const {
            type, orderStatus, startDate, endDate,
        } = req.query;
        try {
            // get orders
            let mainOrders = `SELECT o.user_id, o.order_number, o.checkout_date, o.receipt_image, o.upload_receipt_date, o.send_date, o.done_date, o.order_status_id,
                                os.status, CONCAT('{"recipient_name":"', so.recipient_name, '","recipient_phone":"', so.recipient_phone, '","origin_subdistrict_id": ', so.origin_subdistrict_id,
                                ',"origin_details": "', so.origin_details, '", "destination_subdistrict_id":', so.destination_subdistrict_id, ',"destination_details":"', so.destination_details,
                                '", "address": "', so.address, '"}') AS recipient_address
                            FROM orders o
                            JOIN order_status os ON o.order_status_id = os.id
                            LEFT JOIN shipping_order so ON o.order_number = so.order_number`;

            // check filter
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'orderStatus');
            const checkDate = Object.prototype.hasOwnProperty.call(req.query, 'startDate' && 'endDate');

            // type of query
            if (type === 'admin') {
                mainOrders += ` WHERE ${
                    checkStatus
                        ? `o.order_status_id = ${database.escape(orderStatus)}`
                        : 'o.order_status_id != 1'
                } ${
                    checkDate
                        ? `AND o.checkout_date BETWEEN ${database.escape(startDate)} AND ${database.escape(endDate)}`
                        : ''
                }`;
            } else if (type === 'users') {
                mainOrders += ` WHERE o.user_id = ${database.escape(id)} AND ${
                    checkStatus
                        ? `o.order_status_id = ${database.escape(orderStatus)}`
                        : 'o.order_status_id != 1'
                } ${
                    checkDate
                        ? `AND o.checkout_date BETWEEN ${database.escape(startDate)} AND ${database.escape(endDate)}`
                        : ''
                }`;
            } else if (type === 'order-number') {
                mainOrders += ` WHERE o.order_number = ${database.escape(id)}`;
            } else if (type === 'status') {
                mainOrders += ` WHERE o.order_status_id = ${database.escape(id)}`;
            }

            mainOrders += ' GROUP BY o.order_number';
            const getMainOrders = await asyncQuery(mainOrders);

            // get total ongkir
            const totalOngkir = 'SELECT order_number, SUM(delivery_fee) AS total_ongkir, SUM(total_weight) AS total_weight FROM shipping_order GROUP BY order_number;';
            const getTotalOngkir = await asyncQuery(totalOngkir);

            // get total price
            const totalPrice = 'SELECT order_number, SUM(qty * price_each) AS total_price, SUM(qty) AS total_qty FROM order_details GROUP BY order_number;';
            const getTotalPrice = await asyncQuery(totalPrice);

            // add total ongkir and total price to getMainOrders
            getMainOrders.forEach((item, index) => {
                const filterTotalOngkir = getTotalOngkir.filter(
                    (value1) => item.order_number === value1.order_number,
                );
                if (filterTotalOngkir.length > 0) {
                    getMainOrders[index].total_ongkir = filterTotalOngkir[0].total_ongkir;
                    getMainOrders[index].total_weight = filterTotalOngkir[0].total_weight;
                } else {
                    getMainOrders[index].total_ongkir = 0;
                    getMainOrders[index].total_weight = 0;
                }

                const filterTotalPrice = getTotalPrice.filter(
                    (value1) => item.order_number === value1.order_number,
                );
                if (filterTotalPrice.length > 0) {
                    getMainOrders[index].total_price = filterTotalPrice[0].total_price;
                    getMainOrders[index].total_qty = filterTotalPrice[0].total_qty;
                }
                // convert string to object recipient address
                if (item.recipient_address) {
                    getMainOrders[index].recipient_address = JSON.parse(item.recipient_address);
                }
                // Convert receipt_image to full URL
                if (item.receipt_image) {
                    getMainOrders[index].receipt_image = getImageUrl(item.receipt_image, req);
                }
            });

            // get total_price and products in every single item products in sub_order_number
            const check1 = `SELECT od.sub_order_number, CONCAT('{"id":', od.id, ',"product_id":', od.product_id,
                        ',"name":"', p.name, '","image":"', pi.image, '", "qty": ', od.qty, ',"stock":', p.stock,
                        ', "price_each": ', od.price_each, ',"weight_each":', od.weight_each, ',"review_id":', COALESCE(od.review_id, 'null'), 
                        ',"rating":', COALESCE(pr.rating, 'null'), '}') AS products FROM orders o
                    JOIN order_details od ON o.order_number = od.order_number
                    JOIN product_review pr ON od.review_id = pr.review_id
                    JOIN products p ON od.product_id = p.id
                    JOIN product_image pi ON od.product_id = pi.product_id
                    GROUP BY od.sub_order_number, od.product_id;`;
            const resCheck1 = await asyncQuery(check1);

            // Group products by sub_order_number
            const groupProducts = resCheck1.reduce((acc, obj) => {
                const key = obj.sub_order_number;
                if (!acc[key]) {
                    acc[key] = [];
                }
                // Add object to list for given key's value
                const product = JSON.parse(obj.products);
                // Convert image path to full URL
                if (product.image) {
                    product.image = getImageUrl(product.image, req);
                }
                acc[key].push(product);
                return acc;
            }, {});

            // Sum total_price_per_store by sub_order_number
            const totalPricePerStore = `SELECT sub_order_number, SUM(qty) AS total_qty, SUM(qty * price_each) AS total_price FROM order_details
                                    GROUP BY sub_order_number;`;
            const getTotalPricePerStore = await asyncQuery(totalPricePerStore);

            // Sum total_price_per_store by sub_order_number
            const totalWeight = `SELECT sub_order_number, SUM(total_weight) AS total_weight, SUM(delivery_fee) AS delivery_fee FROM shipping_order
                                    GROUP BY sub_order_number;`;
            const getTotalWeight = await asyncQuery(totalWeight);

            // Get order detail by sub_order_number
            let subOrderNumber = `SELECT o.order_number, od.sub_order_number, od.store_id, u.username AS store_name, COALESCE(so.delivery_fee, 0) AS ongkir FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN order_status os ON o.order_status_id = os.id
                                JOIN products p ON od.product_id = p.id
                                JOIN product_image pi ON od.product_id = pi.product_id
                                JOIN users u ON od.store_id = u.id
                                LEFT JOIN shipping_order so ON od.sub_order_number = so.sub_order_number`;

            // filter history order by store
            if (type === 'store') {
                subOrderNumber += ` WHERE od.store_id = ${database.escape(id)} AND ${
                    checkStatus
                        ? `o.order_status_id = ${database.escape(orderStatus)}`
                        : 'o.order_status_id != 1'
                } ${
                    checkDate
                        ? `AND o.checkout_date BETWEEN ${database.escape(startDate)} AND ${database.escape(endDate)}`
                        : ''
                }`;
            }
            subOrderNumber += ' GROUP BY od.sub_order_number;';
            const getSubOrderNumber = await asyncQuery(subOrderNumber);

            // add total_price_per_store and products
            getSubOrderNumber.forEach((item, index) => {
                getTotalPricePerStore.forEach((value2) => {
                    if (item.sub_order_number === value2.sub_order_number) {
                        getSubOrderNumber[index].total_price_per_store = value2.total_price;
                        getSubOrderNumber[index].total_qty_per_store = value2.total_qty;
                    }
                });
                getTotalWeight.forEach((value2) => {
                    if (item.sub_order_number === value2.sub_order_number) {
                        getSubOrderNumber[index].total_weight_per_store = value2.total_weight;
                        getSubOrderNumber[index].total_ongkir_per_store = value2.delivery_fee;
                    }
                });
                Object.keys(groupProducts).forEach((value2) => {
                    if (item.sub_order_number === value2) {
                        getSubOrderNumber[index].products = groupProducts[value2];
                    }
                });
            });

            // Group order detail by order number
            const groupOrderDetail = getSubOrderNumber.reduce((acc, obj) => {
                const key = obj.order_number;
                if (!acc[key]) {
                    acc[key] = [];
                }
                // Add object to list for given key's value
                acc[key].push(obj);
                return acc;
            }, {});

            // delete order number in order detail
            Object.keys(groupOrderDetail).forEach((item) => {
                groupOrderDetail[item].forEach((value, index) => {
                    delete groupOrderDetail[item][index].order_number;
                });
            });

            getMainOrders.forEach((item, index) => {
                Object.keys(groupOrderDetail).forEach((value) => {
                    if (item.order_number === value) {
                        getMainOrders[index].order_detail = groupOrderDetail[value];
                    }
                });
            });

            // delete order number haven't order detail
            const result = [];
            getMainOrders.forEach((item) => {
                if (Object.prototype.hasOwnProperty.call(item, 'order_detail')) {
                    result.push(item);
                }
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
    checkoutConfirmation: async (req, res) => {
        const { order } = req.params;
        const { shippingOrder } = req.body;
        try {
            // get product from cart and product stock
            const check = `SELECT od.order_number, od.product_id, p.name, p.stock, od.qty FROM products p
                        JOIN order_details od ON p.id = od.product_id
                        JOIN orders o ON od.order_number = o.order_number
                        WHERE od.order_number = ${database.escape(order)} AND o.order_status_id = 1`;
            const stock = await asyncQuery(check);

            // check stock before checkout
            stock.forEach(async (item) => {
                if (item.stock < item.qty) {
                    // checkout failed.
                    res.status(400).send({
                        status: 'fail',
                        code: 400,
                        message: `Your input quantity order in ${item.name} less than stock in our database. Please change your quantity order.`,
                    });
                    return null;
                }
                // checkout success. reduce stock in database
                const updateStock = `UPDATE products SET stock = ${item.stock - item.qty} WHERE id = ${item.product_id}`;
                await asyncQuery(updateStock);
                return null;
            });

            // update status order
            const query = `UPDATE orders SET order_status_id = 2, checkout_date = '${today}' WHERE order_number = ${database.escape(order)};`;
            await asyncQuery(query);

            // input total ongkir
            let insertOngkir = '';
            shippingOrder.forEach((item) => {
                if (
                    !item.order_number
                    && !item.sub_order_number
                    && !item.recipient_name
                    && !item.recipient_phone
                    && !item.origin_subdistrict_id
                    && !item.origin_details
                    && !item.destination_subdistrict_id
                    && !item.destination_details
                    && !item.address
                    && !item.courier_id
                    && !item.courier_service
                    && !item.courier_description
                    && !item.total_weight
                    && !item.delivery_fee
                ) {
                    res.status(422).send({
                        status: 'fail',
                        code: 422,
                        message: 'Your data of shipping order is not completed. Please try again!',
                    });
                    return;
                }
                insertOngkir += `(${database.escape(item.order_number)}, ${database.escape(item.sub_order_number)}, ${database.escape(item.origin_subdistrict_id)}, ${database.escape(item.origin_details)}, ${database.escape(item.recipient_name)}, ${database.escape(item.recipient_phone)}, ${database.escape(item.destination_subdistrict_id)}, ${database.escape(item.destination_details)}, ${database.escape(item.address)}, ${database.escape(item.courier_id)}, ${database.escape(item.courier_service)}, ${database.escape(item.courier_description)}, ${database.escape(item.total_weight)}, ${database.escape(item.delivery_fee)}),`;
            });
            const addOngkir = `INSERT INTO shipping_order (order_number, sub_order_number, origin_subdistrict_id, origin_details, recipient_name, recipient_phone, destination_subdistrict_id, destination_details, address, courier_id, courier_service, courier_description, total_weight, delivery_fee) VALUES ${insertOngkir.slice(0, -1)}`;
            await asyncQuery(addOngkir);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Checkout has been successfully',
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
    paymentUpload: async (req, res) => {
        const { order } = req.params;

        if (req.file === undefined) {
            res.status(400).send('No image');
            return;
        }
        try {
            // user upload foto bukti pembayaran
            const query = `UPDATE orders SET receipt_image = 'receipt/${
                req.file.filename
            }', upload_receipt_date='${today}' WHERE order_number = ${database.escape(order)};`;
            const result = await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your upload payment has been successfully',
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
    paymentConfirmation: async (req, res) => {
        const { order } = req.params;
        try {
            // check order in checkout database
            const checkout = 'SELECT * FROM orders WHERE order_status_id = 2';
            const getCheckout = await asyncQuery(checkout);

            if (getCheckout.length === 0) {
                res.status(500).send({
                    status: 'fail',
                    code: 404,
                    message: 'You have processed the wrong order. Please try again!',
                });
                return;
            }

            // confirmation from admin
            const query = `UPDATE orders SET order_status_id = 3 WHERE order_number = ${database.escape(order)};`;
            await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'You has been successfully to confirm this order',
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
    // admin send order to user
    sendConfirmation: async (req, res) => {
        const { order } = req.params;
        try {
            // check order number
            const checkOrder = `SELECT * FROM orders WHERE order_number = ${database.escape(order)} AND order_status_id = 3;`;
            const getCheckOrder = await asyncQuery(checkOrder);

            if (getCheckOrder.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Your order number invalid',
                });
                return;
            }

            // update status order from payment success to send
            const query = `UPDATE orders SET order_status_id = 4, send_date = '${today}' WHERE order_number = ${database.escape(order)};`;
            await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message:
                    'You has been successfully to confirm this order that already sent to user',
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
    // user received package, and order is done
    doneConfirmation: async (req, res) => {
        const { order } = req.params;
        const { userId } = req.body;
        try {
            // select orders that you want to confirm
            const checkOrder = `SELECT * FROM orders WHERE order_number = ${database.escape(order)} AND order_status_id = 4;`;
            const getCheckOrder = await asyncQuery(checkOrder);

            if (getCheckOrder.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Your order number invalid',
                });
                return;
            }

            // get order details
            const orderDetails = `SELECT * FROM order_details WHERE order_number = ${database.escape(getCheckOrder[0].order_number)}`;
            const getOrderDetails = await asyncQuery(orderDetails);

            // add blank review sebanyak jumlah produk dlm order number
            // get current value of product_review sequence
            const autoIncrement = 'SELECT MAX(id) AS id FROM product_review;';
            const getAutoIncrement = await asyncQuery(autoIncrement);
            getOrderDetails.forEach(async (item, index) => {
                // initialize data in table product review
                const addReview = `INSERT INTO product_review (review_id, user_id, status) VALUES (${
                    parseInt(getAutoIncrement[0].id, 10) + index + 1
                }, ${userId}, 2);`;
                await asyncQuery(addReview);

                // update review id in order details
                const editOrderDetails = `UPDATE order_details SET review_id = ${
                    parseInt(getAutoIncrement[0].id, 10) + index + 1
                } WHERE order_number = ${database.escape(item.order_number)} and product_id = ${
                    item.product_id
                }`;
                await asyncQuery(editOrderDetails);
            });
            // update status order from send order to done order
            const query = `UPDATE orders SET order_status_id = 5, done_date = '${today}' WHERE order_number = ${database.escape(order)};`;
            await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your order is done. Thank you for your order',
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
    // user cancel order
    transactionFailed: async (req, res) => {
        const { order } = req.params;
        const { type } = req.query;
        try {
            // check status order
            const status = `SELECT * FROM orders WHERE order_number = ${database.escape(order)}`;
            const checkStatus = await asyncQuery(status);

            const { orderStatusId } = checkStatus[0];
            if ((orderStatusId >= 4 && orderStatusId <= 7) || orderStatusId === 1) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: "Your order can't be canceled",
                });
                return;
            }

            // get data order number want to be canceled
            const data = `SELECT * FROM order_details WHERE order_number = ${database.escape(order)};`;
            const getData = await asyncQuery(data);

            getData.map(async (item) => {
                // get stock in database
                const getStock = `SELECT * FROM products WHERE id = ${item.product_id};`;
                const stock = await asyncQuery(getStock);

                // update stock in database with addition of canceled orders
                const updateStock = `UPDATE products SET stock = ${
                    stock[0].stock + item.qty
                } WHERE id = ${item.product_id};`;
                await asyncQuery(updateStock);
            });

            // update order status
            const query = `UPDATE orders SET order_status_id = ${
                type === 'cancel' ? 6 : 7
            } WHERE order_number = ${database.escape(order)};`;
            await asyncQuery(query);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your order has been failed',
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
