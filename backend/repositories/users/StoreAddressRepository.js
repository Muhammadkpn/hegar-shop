const BaseRepository = require('../BaseRepository');

/**
 * Store Address Repository
 * Handles all database operations for store_address table
 */
class StoreAddressRepository extends BaseRepository {
  constructor() {
    super('store_address', 'id');
  }

  /**
   * Find all addresses by user ID
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async findByUserId(userId) {
    return this.findAll({ where: { user_id: userId } });
  }

  /**
   * Search store addresses by user ID
   * @param {number} userId
   * @param {string} search
   * @returns {Promise<Array>}
   */
  async searchByUserId(userId, search) {
    let query = 'SELECT * FROM store_address WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (recipient_name LIKE ? OR recipient_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    return this.rawQuery(query, params);
  }
}

module.exports = StoreAddressRepository;
