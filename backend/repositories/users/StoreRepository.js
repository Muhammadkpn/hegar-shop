const BaseRepository = require('../BaseRepository');

/**
 * Store Repository
 * Handles all database operations for stores table
 */
class StoreRepository extends BaseRepository {
  constructor() {
    super('stores', 'id');
  }

  /**
   * Find store by user ID
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async findByUserId(userId) {
    return this.findOne({ user_id: userId });
  }

  /**
   * Get store with bank details
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async getStoreWithBankDetails(userId) {
    const query = `
      SELECT s.user_id, s.store_name, s.main_address_id, u.main_bank_id, s.status
      FROM stores s
      JOIN users u ON s.user_id = u.id
      WHERE user_id = ?
    `;
    const results = await this.rawQuery(query, [userId]);
    return results[0] || null;
  }

  /**
   * Find store by name
   * @param {string} storeName
   * @returns {Promise<Object|null>}
   */
  async findByStoreName(storeName) {
    return this.findOne({ store_name: storeName });
  }

  /**
   * Update store by user ID
   * @param {number} userId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateByUserId(userId, data) {
    return this.updateWhere({ user_id: userId }, data);
  }

  /**
   * Update main address for store
   * @param {number} userId
   * @param {number} addressId
   * @returns {Promise<Object>}
   */
  async updateMainAddress(userId, addressId) {
    return this.updateWhere({ user_id: userId }, { main_address_id: addressId });
  }

  /**
   * Clear main address for store
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async clearMainAddress(userId) {
    return this.updateWhere({ user_id: userId }, { main_address_id: null });
  }
}

module.exports = StoreRepository;
