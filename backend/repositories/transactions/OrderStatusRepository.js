const BaseRepository = require('../BaseRepository');

/**
 * Order Status Repository
 * Handles all database operations for order_status table
 */
class OrderStatusRepository extends BaseRepository {
  constructor() {
    super('order_status', 'id');
  }

  /**
   * Get all order statuses
   * @returns {Promise<Array>}
   */
  async getAllStatuses() {
    return this.findAll({});
  }

  /**
   * Find status by name
   * @param {string} status
   * @returns {Promise<Object|null>}
   */
  async findByStatus(status) {
    return this.findOne({ status });
  }
}

module.exports = OrderStatusRepository;
