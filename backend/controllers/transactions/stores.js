const database = require('../../database');
const { asyncQuery } = require('../../helpers');

const fullDate = new Date();
const date = fullDate.getDate();
const month = fullDate.getMonth() + 1;
const year = fullDate.getFullYear();

module.exports = {
    getSalesSummary: async (req, res) => {
        const { id } = req.params;
        const { type } = req.query;

        try {
            let query = `SELECT u.user_id AS store_id, u.username, u.image, u.user_reg_date, IF(tb1.status = null, "Done", "Done") AS status,
                    IF(tb1.sales_per_status > 0 , tb1.sales_per_status, 0) AS sales_per_status, 
                    IF(tb1.qty_per_status > 0 , tb1.qty_per_status, 0) AS qty_per_status 
                FROM (
                    SELECT u.id AS user_id, u.username, s.store_name, u.image, u.reg_date AS user_reg_date FROM users u
                    JOIN stores s ON u.id = s.user_id
                    WHERE role_id != 3
                ) AS u
                LEFT JOIN (SELECT p.store_id, os.status, SUM(od.price_each*od.qty) AS sales_per_status, SUM(od.qty) AS qty_per_status FROM products p
                    JOIN order_details od ON p.id = od.product_id
                    JOIN orders o ON od.order_number = o.order_number
                    JOIN order_status os ON o.order_status_id = os.id
                    WHERE o.order_status_id = 5
                GROUP BY p.store_id, o.order_status_id) tb1 ON u.user_id = tb1.store_id`;

            if (type === 'by-store') {
                query += ` WHERE u.user_id = ${database.escape(id)}`;
            }

            const result = await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: type === 'by-store' ? result[0] : result,
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
    getSalesCharts: async (req, res) => {
        const { id } = req.params;
        const { startDate, endDate, orderStatusId } = req.query;

        try {
            let query = `SELECT p.store_id, o.order_status_id, os.status, o.order_number, DATE_FORMAT(o.checkout_date, '%d/%m/%y') AS checkout_date, SUM(od.price_each*od.qty) AS total_sales, SUM(od.qty) AS total_qty FROM products p
                    JOIN order_details od ON p.id = od.product_id
                    JOIN orders o ON od.order_number = o.order_number
                    JOIN order_status os ON o.order_status_id = os.id
                    WHERE `;
            // check id
            if (id !== 'All') {
                // check user
                const checkUser = `SELECT * FROM user_balance WHERE user_id = ${database.escape(id)}`;
                const getCheckUser = await asyncQuery(checkUser);

                // result of check user
                if (getCheckUser.length === 0) {
                    res.status(442).send({
                        status: 'fail',
                        code: 422,
                        message: 'User not found',
                    });
                    return;
                }
                query += ` p.store_id = ${id} AND `;
            }
            query += ` ${orderStatusId !== undefined ? `o.order_status_id = ${orderStatusId}` : 'o.order_status_id != 1'} AND 
                    o.checkout_date BETWEEN ${startDate !== undefined ? startDate : database.escape('2019-01-01')} AND ${endDate !== undefined ? endDate : database.escape(`${year}-${month}-${date}`)}
                    GROUP BY p.store_id, o.order_number ORDER BY o.checkout_date;`;

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
    getEarnings: async (req, res) => {
        const { id } = req.params;
        const { startDate, endDate, type } = req.query;

        try {
            // check user
            const checkUser = `SELECT * FROM users WHERE id = ${database.escape(id)}`;
            const getCheckUser = await asyncQuery(checkUser);

            // result of check user
            if (getCheckUser.length === 0) {
                res.status(442).send({
                    status: 'success',
                    code: 422,
                    message: 'User not found',
                });
                return;
            }

            // get earning
            const earnings = `SELECT p.store_id, o.order_status_id, os.status, o.order_number, o.done_date, SUM(od.price_each*od.qty) AS total_sales, SUM(od.qty) AS total_qty FROM products p
                    JOIN order_details od ON p.id = od.product_id
                    JOIN orders o ON od.order_number = o.order_number
                    JOIN order_status os ON o.order_status_id = os.id
                    WHERE o.order_status_id = 5 AND p.store_id = ${database.escape(id)} ${type === 'by-date' ? `AND done_date BETWEEN ${startDate !== undefined ? startDate : `${year}-${month}-01`} AND ${endDate !== undefined ? endDate : `${year}-${month}-${date}`}` : ''}
                    GROUP BY p.store_id;`;
            const getEarnings = await asyncQuery(earnings);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: {
                    ...getEarnings[0], start_date: startDate !== undefined ? startDate : `${year}-${month}-01`, end_date: endDate !== undefined ? endDate : `${year}-${month}-${date}`,
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
};
