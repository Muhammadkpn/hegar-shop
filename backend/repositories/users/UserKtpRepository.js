const BaseRepository = require('../BaseRepository');

/**
 * User KTP Repository
 * Handles all database operations for user_ktp table
 */
class UserKtpRepository extends BaseRepository {
  constructor() {
    super('user_ktp', 'id');
  }

  /**
   * Find KTP by user ID
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async findByUserId(userId) {
    return this.findOne({ user_id: userId });
  }

  /**
   * Get all KTP with filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getKtpWithFilters(filters = {}) {
    const { status, search } = filters;

    let query = 'SELECT * FROM user_ktp';
    const params = [];
    const whereClauses = [];

    if (status) {
      whereClauses.push('ktp_status_id = ?');
      params.push(status);
    }

    if (search) {
      whereClauses.push('(full_name LIKE ? OR ktp_number LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    return this.rawQuery(query, params);
  }

  /**
   * Update KTP by user ID
   * @param {number} userId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateByUserId(userId, data) {
    return this.updateWhere({ user_id: userId }, data);
  }

  /**
   * Update KTP status
   * @param {number} userId
   * @param {number} statusId
   * @returns {Promise<Object>}
   */
  async updateStatus(userId, statusId) {
    return this.updateWhere({ user_id: userId }, { ktp_status_id: statusId });
  }

  /**
   * Create KTP for user
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async createForUser(userId) {
    return this.create({ user_id: userId });
  }
}

module.exports = UserKtpRepository;
