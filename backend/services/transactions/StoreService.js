const { OrderRepository, OrderDetailRepository } = require('../../repositories/transactions');

/**
 * Store Service
 * Contains business logic for store sales analytics and reports
 */
class StoreService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderDetailRepository = new OrderDetailRepository();
  }

  /**
   * Get sales summary for all stores or specific store
   * @param {number} storeId - Optional store ID
   * @param {string} type - 'by-store' or undefined
   * @returns {Promise<Object|Array>}
   */
  async getSalesSummary(storeId = null, type = null) {
    let query = `
      SELECT u.user_id AS store_id, u.username, u.image, u.user_reg_date,
             IF(tb1.status = null, "Done", "Done") AS status,
             IF(tb1.sales_per_status > 0, tb1.sales_per_status, 0) AS sales_per_status,
             IF(tb1.qty_per_status > 0, tb1.qty_per_status, 0) AS qty_per_status
      FROM (
        SELECT u.id AS user_id, u.username, s.store_name, u.image, u.reg_date AS user_reg_date
        FROM users u
        JOIN stores s ON u.id = s.user_id
        WHERE role_id != 3
      ) AS u
      LEFT JOIN (
        SELECT p.store_id, os.status, SUM(od.price_each*od.qty) AS sales_per_status, SUM(od.qty) AS qty_per_status
        FROM products p
        JOIN order_details od ON p.id = od.product_id
        JOIN orders o ON od.order_number = o.order_number
        JOIN order_status os ON o.order_status_id = os.id
        WHERE o.order_status_id = 5
        GROUP BY p.store_id, o.order_status_id
      ) tb1 ON u.user_id = tb1.store_id
    `;

    const params = [];

    if (type === 'by-store' && storeId) {
      query += ' WHERE u.user_id = ?';
      params.push(storeId);
    }

    const result = await this.orderRepository.rawQuery(query, params);

    return type === 'by-store' ? (result[0] || null) : result;
  }

  /**
   * Get sales charts data
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getSalesCharts(filters) {
    const { storeId, startDate, endDate, orderStatusId } = filters;

    // Get current date for defaults
    const fullDate = new Date();
    const date = fullDate.getDate();
    const month = fullDate.getMonth() + 1;
    const year = fullDate.getFullYear();

    // Verify store exists if not 'All'
    if (storeId !== 'All') {
      const checkQuery = 'SELECT * FROM user_balance WHERE user_id = ?';
      const userExists = await this.orderRepository.rawQuery(checkQuery, [storeId]);

      if (userExists.length === 0) {
        throw new Error('User not found');
      }
    }

    let query = `
      SELECT p.store_id, o.order_status_id, os.status, o.order_number,
             DATE_FORMAT(o.checkout_date, '%d/%m/%y') AS checkout_date,
             SUM(od.price_each*od.qty) AS total_sales, SUM(od.qty) AS total_qty
      FROM products p
      JOIN order_details od ON p.id = od.product_id
      JOIN orders o ON od.order_number = o.order_number
      JOIN order_status os ON o.order_status_id = os.id
      WHERE
    `;

    const params = [];

    // Store filter
    if (storeId !== 'All') {
      query += 'p.store_id = ? AND ';
      params.push(storeId);
    }

    // Status filter
    if (orderStatusId !== undefined) {
      query += 'o.order_status_id = ? AND ';
      params.push(orderStatusId);
    } else {
      query += 'o.order_status_id != 1 AND ';
    }

    // Date range filter
    const defaultStartDate = '2019-01-01';
    const defaultEndDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    query += 'o.checkout_date BETWEEN ? AND ? ';
    params.push(startDate || defaultStartDate, endDate || defaultEndDate);

    query += 'GROUP BY p.store_id, o.order_number ORDER BY o.checkout_date';

    return this.orderRepository.rawQuery(query, params);
  }

  /**
   * Get earnings for a store
   * @param {number} storeId
   * @param {Object} dateRange
   * @returns {Promise<Object>}
   */
  async getEarnings(storeId, dateRange = {}) {
    const { startDate, endDate, type } = dateRange;

    // Verify store exists
    const checkQuery = 'SELECT * FROM users WHERE id = ?';
    const userExists = await this.orderRepository.rawQuery(checkQuery, [storeId]);

    if (userExists.length === 0) {
      throw new Error('User not found');
    }

    // Get current date for defaults
    const fullDate = new Date();
    const date = fullDate.getDate();
    const month = fullDate.getMonth() + 1;
    const year = fullDate.getFullYear();

    const defaultStartDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const defaultEndDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    let query = `
      SELECT p.store_id, o.order_status_id, os.status, o.order_number, o.done_date,
             SUM(od.price_each*od.qty) AS total_sales, SUM(od.qty) AS total_qty
      FROM products p
      JOIN order_details od ON p.id = od.product_id
      JOIN orders o ON od.order_number = o.order_number
      JOIN order_status os ON o.order_status_id = os.id
      WHERE o.order_status_id = 5 AND p.store_id = ?
    `;

    const params = [storeId];

    // Add date filter if type is 'by-date'
    if (type === 'by-date') {
      query += ' AND done_date BETWEEN ? AND ?';
      params.push(startDate || defaultStartDate, endDate || defaultEndDate);
    }

    query += ' GROUP BY p.store_id';

    const result = await this.orderRepository.rawQuery(query, params);

    return {
      ...(result[0] || {}),
      start_date: startDate || defaultStartDate,
      end_date: endDate || defaultEndDate,
    };
  }
}

module.exports = StoreService;
