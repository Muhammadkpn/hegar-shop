const BaseRepository = require('../BaseRepository');

/**
 * Shipping Order Repository
 * Handles all database operations for shipping_order table
 */
class ShippingOrderRepository extends BaseRepository {
  constructor() {
    super('shipping_order', 'id');
  }

  /**
   * Get shipping by order number
   * @param {string} orderNumber
   * @returns {Promise<Array>}
   */
  async getShippingByOrderNumber(orderNumber) {
    return this.findAll({ where: { order_number: orderNumber } });
  }

  /**
   * Get shipping by sub-order number
   * @param {string} subOrderNumber
   * @returns {Promise<Object|null>}
   */
  async getShippingBySubOrder(subOrderNumber) {
    return this.findOne({ sub_order_number: subOrderNumber });
  }

  /**
   * Delete by order number
   * @param {string} orderNumber
   * @returns {Promise<Object>}
   */
  async deleteByOrderNumber(orderNumber) {
    return this.deleteWhere({ order_number: orderNumber });
  }

  /**
   * Delete by sub-order number
   * @param {string} subOrderNumber
   * @returns {Promise<Object>}
   */
  async deleteBySubOrder(subOrderNumber) {
    return this.deleteWhere({ sub_order_number: subOrderNumber });
  }
}

module.exports = ShippingOrderRepository;
