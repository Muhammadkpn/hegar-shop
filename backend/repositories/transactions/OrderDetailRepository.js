const BaseRepository = require('../BaseRepository');

/**
 * Order Detail Repository
 * Handles all database operations for order_details table
 */
class OrderDetailRepository extends BaseRepository {
  constructor() {
    super('order_details', 'id');
  }

  /**
   * Get order details by order number
   * @param {string} orderNumber
   * @returns {Promise<Array>}
   */
  async getDetailsByOrderNumber(orderNumber) {
    return this.findAll({ where: { order_number: orderNumber } });
  }

  /**
   * Get order details with product info
   * @param {string} orderNumber
   * @returns {Promise<Array>}
   */
  async getDetailsWithProducts(orderNumber) {
    const query = `
      SELECT od.*, p.name, p.stock, pi.image,
             pr.rating,
             (od.qty * od.price_each) AS total_price,
             (od.qty * od.weight_each) AS total_weight
      FROM order_details od
      JOIN products p ON od.product_id = p.id
      LEFT JOIN product_image pi ON od.product_id = pi.product_id
      LEFT JOIN product_review pr ON od.review_id = pr.review_id
      WHERE od.order_number = ?
      GROUP BY od.id
    `;
    return this.rawQuery(query, [orderNumber]);
  }

  /**
   * Get cart details with product info
   * @param {string} orderNumber
   * @returns {Promise<Array>}
   */
  async getCartDetails(orderNumber) {
    const query = `
      SELECT o.order_number, od.sub_order_number, od.store_id, s.store_name,
             sa.subdistrict_id, CONCAT(sa.subdistrict, ', ', sa.city, ', ', sa.province, ', ', sa.postcode) AS origin_details,
             CONCAT('{"id":', od.id, ',"product_id":', od.product_id,
                    ',"name":"', p.name, '","image":"', pi.image,
                    '","qty":', od.qty, ',"stock":', p.stock,
                    ',"price_each":', od.price_each, ',"sale_price":', p.sale_price,
                    ',"weight_each":', od.weight_each,
                    ',"total_price":', od.qty * od.price_each,
                    ',"total_weight":', od.qty * od.weight_each, '}') AS products,
             price_each * qty AS total_price,
             od.qty,
             (od.qty * od.weight_each) AS total_weight
      FROM orders o
      JOIN order_details od ON o.order_number = od.order_number
      JOIN products p ON od.product_id = p.id
      JOIN product_image pi ON od.product_id = pi.product_id
      JOIN stores s ON od.store_id = s.user_id
      JOIN store_address sa ON s.main_address_id = sa.id
      WHERE o.order_status_id = 1 AND o.order_number = ?
      GROUP BY od.sub_order_number, od.product_id
    `;
    return this.rawQuery(query, [orderNumber]);
  }

  /**
   * Get summary totals for cart
   * @param {string} orderNumber
   * @returns {Promise<Object|null>}
   */
  async getCartSummary(orderNumber) {
    const query = `
      SELECT order_number,
             SUM(qty) AS total_qty,
             SUM(price_each * qty) AS total_price,
             SUM(qty * weight_each) AS total_weight
      FROM order_details
      WHERE order_number = ?
    `;
    const results = await this.rawQuery(query, [orderNumber]);
    return results[0] || null;
  }

  /**
   * Find by sub-order number and product
   * @param {string} subOrderNumber
   * @param {number} productId
   * @returns {Promise<Object|null>}
   */
  async findBySubOrderAndProduct(subOrderNumber, productId) {
    return this.findOne({ sub_order_number: subOrderNumber, product_id: productId });
  }

  /**
   * Delete by order number
   * @param {string} orderNumber
   * @returns {Promise<Object>}
   */
  async deleteByOrderNumber(orderNumber) {
    return this.deleteWhere({ order_number: orderNumber });
  }
}

module.exports = OrderDetailRepository;
