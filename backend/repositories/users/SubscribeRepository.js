const BaseRepository = require('../BaseRepository');

/**
 * Subscribe Repository
 * Handles all database operations for subscribe table
 */
class SubscribeRepository extends BaseRepository {
  constructor() {
    super('subscribe', 'id');
  }

  /**
   * Find subscription by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Get active subscriptions
   * @returns {Promise<Array>}
   */
  async getActiveSubscriptions() {
    return this.findAll({ where: { status: 1 } });
  }
}

module.exports = SubscribeRepository;
