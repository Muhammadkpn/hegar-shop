const BaseRepository = require('../BaseRepository');

/**
 * Order Repository
 * Handles all database operations for orders table
 */
class OrderRepository extends BaseRepository {
  constructor() {
    super('orders', 'id');
  }

  /**
   * Find order by order number
   * @param {string} orderNumber
   * @returns {Promise<Object|null>}
   */
  async findByOrderNumber(orderNumber) {
    return this.findOne({ order_number: orderNumber });
  }

  /**
   * Get orders with complete details
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getOrdersWithDetails(filters = {}) {
    const { userId, type, orderStatus, startDate, endDate, orderNumber } = filters;

    let query = `
      SELECT o.user_id, o.order_number, o.checkout_date, o.receipt_image,
             o.upload_receipt_date, o.send_date, o.done_date, o.order_status_id,
             os.status,
             CONCAT('{"recipient_name":"', so.recipient_name,
                    '","recipient_phone":"', so.recipient_phone,
                    '","origin_subdistrict_id":', so.origin_subdistrict_id,
                    ',"origin_details":"', so.origin_details,
                    '","destination_subdistrict_id":', so.destination_subdistrict_id,
                    ',"destination_details":"', so.destination_details,
                    '","address":"', so.address, '"}') AS recipient_address
      FROM orders o
      JOIN order_status os ON o.order_status_id = os.id
      LEFT JOIN shipping_order so ON o.order_number = so.order_number
    `;

    const params = [];
    const whereClauses = [];

    if (type === 'admin') {
      if (orderStatus) {
        whereClauses.push('o.order_status_id = ?');
        params.push(orderStatus);
      } else {
        whereClauses.push('o.order_status_id != 1');
      }

      if (startDate && endDate) {
        whereClauses.push('o.checkout_date BETWEEN ? AND ?');
        params.push(startDate, endDate);
      }
    } else if (type === 'users') {
      whereClauses.push('o.user_id = ?');
      params.push(userId);

      if (orderStatus) {
        whereClauses.push('o.order_status_id = ?');
        params.push(orderStatus);
      } else {
        whereClauses.push('o.order_status_id != 1');
      }

      if (startDate && endDate) {
        whereClauses.push('o.checkout_date BETWEEN ? AND ?');
        params.push(startDate, endDate);
      }
    } else if (type === 'order-number') {
      whereClauses.push('o.order_number = ?');
      params.push(orderNumber);
    } else if (type === 'status') {
      whereClauses.push('o.order_status_id = ?');
      params.push(orderStatus);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' GROUP BY o.order_number';

    return this.rawQuery(query, params);
  }

  /**
   * Get active cart by user ID
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async getActiveCartByUser(userId) {
    return this.findOne({ user_id: userId, order_status_id: 1 });
  }

  /**
   * Update order status
   * @param {string} orderNumber
   * @param {number} statusId
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(orderNumber, statusId) {
    return this.updateWhere({ order_number: orderNumber }, { order_status_id: statusId });
  }

  /**
   * Get order totals (ongkir and price)
   * @returns {Promise<Object>}
   */
  async getOrderTotals() {
    const ongkirQuery = `
      SELECT order_number, SUM(delivery_fee) AS total_ongkir, SUM(total_weight) AS total_weight
      FROM shipping_order
      GROUP BY order_number
    `;

    const priceQuery = `
      SELECT order_number, SUM(qty * price_each) AS total_price, SUM(qty) AS total_qty
      FROM order_details
      GROUP BY order_number
    `;

    const [ongkir, price] = await Promise.all([
      this.rawQuery(ongkirQuery),
      this.rawQuery(priceQuery),
    ]);

    return { ongkir, price };
  }
}

module.exports = OrderRepository;
