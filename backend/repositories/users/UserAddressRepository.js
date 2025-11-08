const BaseRepository = require('../BaseRepository');

/**
 * User Address Repository
 * Handles all database operations for user_address table
 */
class UserAddressRepository extends BaseRepository {
  constructor() {
    super('user_address', 'id');
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
   * Get main address with user details
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async getMainAddressWithUser(userId) {
    const query = `
      SELECT ua.*, u.email, u.user_status_id
      FROM users u
      JOIN user_address ua ON u.main_address_id = ua.id
      WHERE ua.user_id = ?
    `;
    const results = await this.rawQuery(query, [userId]);
    return results[0] || null;
  }

  /**
   * Get shipping address by ID
   * @param {number} addressId
   * @returns {Promise<Object|null>}
   */
  async getShippingAddress(addressId) {
    const query = `
      SELECT id AS shipping_id, user_id, recipient_name, recipient_phone,
             province, city, postcode, address
      FROM user_address
      WHERE id = ?
    `;
    const results = await this.rawQuery(query, [addressId]);
    return results[0] || null;
  }

  /**
   * Search addresses by user ID
   * @param {number} userId
   * @param {string} filter
   * @returns {Promise<Array>}
   */
  async searchByUserId(userId, filter) {
    const query = `
      SELECT * FROM user_ktp uk
      JOIN user_address ua ON uk.user_id = ua.user_id
      WHERE uk.user_id = ? AND (ua.recipient_name LIKE ? OR ua.recipient_phone LIKE ?)
    `;
    return this.rawQuery(query, [userId, `%${filter}%`, `%${filter}%`]);
  }
}

module.exports = UserAddressRepository;
