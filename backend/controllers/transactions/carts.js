/* eslint-disable no-param-reassign */
const orderid = require('order-id')('mysecret');
const database = require('../../database');
const { asyncQuery } = require('../../helpers/queryHelper');

module.exports = {
    getCart: async (req, res) => {
        const { id } = req.params;
        try {
            // get order_number from orders table
            const orderNumber = `SELECT * FROM orders WHERE user_id = ${database.escape(id)} AND order_status_id = 1`;
            const checkOrderNumber = await asyncQuery(orderNumber);

            // check item in cart
            if (checkOrderNumber.length === 0) {
                res.status(200).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your cart is empty',
                });
                return;
            }

            // get cart data from order_details
            const cart1 = `SELECT o.order_number, od.sub_order_number, od.store_id, s.store_name, sa.subdistrict_id, CONCAT(sa.subdistrict, ', ', sa.city, ', ', sa.province, ', ', sa.postcode) AS origin_details, CONCAT('{"id":', od.id, ',"product_id":', od.product_id, ',"name":"', p.name, '","image":"', pi.image, '", "qty": ', 
                        od.qty, ',"stock":', p.stock, ', "price_each": ', od.price_each, ', "sale_price":', p.sale_price, ',"weight_each": ', od.weight_each, ',"total_price":', od.qty * od.price_each, ',"total_weight":',
                        od.qty * od.weight_each, '}') AS products, price_each * qty AS total_price, od.qty, (od.qty * od.weight_each) AS total_weight FROM orders o
                    JOIN order_details od ON o.order_number = od.order_number
                    JOIN products p ON od.product_id = p.id
                    JOIN product_image pi ON od.product_id = pi.product_id
                    JOIN stores s ON od.store_id = s.user_id
                    JOIN store_address sa ON s.main_address_id = sa.id
                    WHERE o.order_status_id = 1 AND o.user_id = ${database.escape(id)}
                    GROUP BY od.sub_order_number, od.product_id;`;
            const getCart1 = await asyncQuery(cart1);

            const getCart = [];
            const groupCart = getCart1.reduce((acc, obj) => {
                const key = obj.sub_order_number;
                if (!acc[key]) {
                    acc[key] = [];
                }
                // Add object to list for given key's value
                acc[key].push(obj);
                return acc;
            }, {});

            Object.keys(groupCart).forEach((item) => {
                const obj = {}; // store a new group cart by sub_order_number
                const tempProducts = []; // store several products in a specific store
                let priceStore = 0; // store total of price in a specific store
                let qtyStore = 0; // store total of qty in a specific store
                let weightStore = 0; // store total of weight in a specific store
                groupCart[item].forEach((value) => {
                    tempProducts.push(JSON.parse(value.products));
                    priceStore += value.total_price;
                    qtyStore += value.qty;
                    weightStore += value.total_weight;
                });
                obj.sub_order_number = groupCart[item][0].sub_order_number;
                obj.store_id = groupCart[item][0].store_id;
                obj.store_name = groupCart[item][0].store_name;
                obj.origin_subdistrict_id = groupCart[item][0].subdistrict_id;
                obj.origin_details = groupCart[item][0].origin_details;
                obj.products = tempProducts;
                obj.total_price_per_store = priceStore;
                obj.total_qty_per_store = qtyStore;
                obj.total_weight_per_store = weightStore;
                getCart.push(obj);
            });

            // parse product in getCart into array
            getCart.forEach((item) => {
                if (item.products.length > 0) {
                    item.products.forEach(async (value) => {
                        if (value.price_each !== value.sale_price) {
                            const updatePrice = `UPDATE order_details SET price_each = ${value.sale_price} WHERE id = ${value.id}`;
                            await asyncQuery(updatePrice);
                            value.price_each = value.sale_price;
                        }
                        delete value.sale_price;
                    });
                }
            });

            // get total price of cart
            const summaryCart = `SELECT order_number, SUM(qty) AS total_qty, SUM(price_each * qty) AS total_price, SUM(qty * weight_each) AS total_weight FROM order_details WHERE order_number = ${database.escape(checkOrderNumber[0].order_number)}`;
            const getSummaryCart = await asyncQuery(summaryCart);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: {
                    ...getSummaryCart[0],
                    order_detail: getCart,
                },
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
    addToCart: async (req, res) => {
        const {
            userId, storeId, productId, weightEach, qty, priceEach,
        } = req.body;

        // check qty input
        if (qty < 1) {
            res.status(422).send({
                status: 'fail',
                code: 422,
                message: 'Total input can\'t less than 1!',
            });
            return;
        }

        try {
            // check product in our database
            const check = `SELECT * FROM products WHERE id = ${database.escape(productId)}`;
            const resultCheck = await asyncQuery(check);

            // send response if product doesn't exists
            if (resultCheck.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Your input can\'t process in our database. Check your input product.',
                });
                return;
            }

            // check quantity vs stock
            if (qty > resultCheck[0].stock) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Stock for product ${resultCheck[0].name} only available ${resultCheck[0].stock} item`,
                });
                return;
            }

            // check orderNumber in our database
            const orderNumberCart = `SELECT order_number FROM orders WHERE user_id = ${database.escape(userId)} AND order_status_id = 1`;
            const resOrderNumberCart = await asyncQuery(orderNumberCart);

            // create order number
            let orderNum;
            let subOrderNum;
            if (resOrderNumberCart.length === 0) {
                orderNum = orderid.generate();
                subOrderNum = orderNum;

                // input order data in orders
                const orders = `INSERT INTO orders (user_id, order_number, order_status_id) VALUES (${database.escape(userId)}, '${orderNum}', 1)`;
                await asyncQuery(orders);
            } else {
                orderNum = resOrderNumberCart[0].order_number;
                const checkStore = `SELECT * FROM order_details WHERE order_number = ${database.escape(orderNum)} AND store_id = ${database.escape(storeId)}`;
                const getCheckStore = await asyncQuery(checkStore);

                if (getCheckStore.length === 0) {
                    subOrderNum = orderid.generate();
                } else {
                    subOrderNum = getCheckStore[0].sub_order_number;
                }
            }

            // check product in order_details
            const checkProductID = `SELECT * FROM order_details WHERE sub_order_number = ${database.escape(subOrderNum)} AND product_id = ${database.escape(productId)}`;
            const resultCheckProd = await asyncQuery(checkProductID);

            if (resultCheckProd.length === 0) {
                // input product in order_details
                const addToCart = `INSERT INTO order_details (order_number, sub_order_number, store_id, product_id, qty, price_each, weight_each) VALUES (${database.escape(orderNum)}, ${database.escape(subOrderNum)}, ${database.escape(storeId)}, ${database.escape(productId)}, ${database.escape(qty)}, ${database.escape(priceEach)}, ${database.escape(weightEach)})`;
                await asyncQuery(addToCart);
            } else {
                // check quantity vs stock
                if ((resultCheckProd[0].qty + qty) > resultCheck[0].stock) {
                    res.status(400).send({
                        status: 'fail',
                        code: 400,
                        message: `Stock for product ${resultCheck[0].name} only available ${resultCheck[0].stock}. You already have ${resultCheckProd[0].qty} in the cart`,
                    });
                    return;
                }
                // + qty product_id on order_details
                const addToCart = `UPDATE order_details SET qty = ${resultCheckProd[0].qty + qty}, price_each = ${database.escape(priceEach)} WHERE order_number = ${database.escape(orderNum)} AND product_id = ${database.escape(productId)}`;
                await asyncQuery(addToCart);
            }

            // send response
            res.status(200).send({
                status: 'success',
                message: `Product with id: ${productId} has been added to cart`,
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
    editQtyInCart: async (req, res) => {
        const { productId, qty } = req.body;
        const { id } = req.params;
        try {
            const checkOrder = `SELECT order_number FROM order_details WHERE id = ${database.escape(id)}`;
            const resCheckOrder = await asyncQuery(checkOrder);

            // check orderNumber in table orders
            if (resCheckOrder.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Your order can\'t found in our database',
                });
                return;
            }

            //  check qty === 0
            if (qty <= 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Your input quantity can\'t less than 1',
                });
                return;
            }

            // check product in our database
            const check = `SELECT * FROM products WHERE id = ${database.escape(productId)}`;
            const resultCheck = await asyncQuery(check);

            // send response if product doesn't exists
            if (resultCheck.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Your input can\'t process in our database. Check your input product.',
                });
                return;
            }

            // check quantity vs stock
            if (qty > resultCheck[0].stock) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Stock for product ${resultCheck[0].name} only available ${resultCheck[0].stock}`,
                });
                return;
            }

            // update product from order_details
            const editProduct = `UPDATE order_details SET qty = ${qty} WHERE id = ${id}`;
            await asyncQuery(editProduct);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your quantity in the cart already edited',
            });
        } catch (error) {
            // send error
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    deleteCart: async (req, res) => {
        const { id } = req.params;

        try {
            // check orderNumber di tabel orders
            const checkOrder = `SELECT * FROM order_details WHERE id = ${id}`;
            const resCheckOrder = await asyncQuery(checkOrder);

            //  send response if cart doesnt exists
            if (resCheckOrder.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'There is something wrong. You can\'t delete this product from cart',
                });
                return;
            }

            // delete product from order_details
            const deleteCart = `DELETE FROM order_details WHERE id = ${id}`;
            await asyncQuery(deleteCart);

            //  send response
            res.status(200).send({
                status: 'success',
                message: 'This product has been deleted',
            });
        } catch (error) {
            //  send error
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
