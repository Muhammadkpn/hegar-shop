const BaseRepository = require('../BaseRepository');

/**
 * User Repository
 * Handles all database operations for users table
 */
class UserRepository extends BaseRepository {
  constructor() {
    super('users', 'id');
  }

  /**
   * Find user by username
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  async findByUsername(username) {
    return this.findOne({ username });
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Find user by username or email
   * @param {string} username
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByUsernameOrEmail(username, email) {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    const results = await this.rawQuery(query, [username, email]);
    return results[0] || null;
  }

  /**
   * Get users with profile and address (for admin list)
   * @param {Object} filters
   * @param {Object} pagination
   * @returns {Promise<Object>}
   */
  async getUsersWithDetails(filters = {}, pagination = {}) {
    const {
      type, name, emailStatus, userStatus, sortField = 'u.id', sortOrder = 'DESC',
    } = filters;
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT u.id, u.username, u.user_status_id, u.email, u.email_status_id,
             uk.full_name, u.phone, uk.gender, u.image, ua.city, ua.province,
             ua.postcode, ua.address, u.role_id
      FROM users u
      LEFT JOIN user_address ua ON u.main_address_id = ua.id
      LEFT JOIN user_ktp uk ON u.id = uk.user_id
    `;

    const params = [];
    const whereClauses = [];

    // Filter by type
    if (type === 'store') {
      whereClauses.push('u.role_id = ?');
      params.push(2);

      if (name) {
        whereClauses.push('uk.full_name LIKE ?');
        params.push(`%${name}%`);
      }
    } else if (type === 'admin') {
      whereClauses.push('u.role_id IN (?, ?)');
      params.push(2, 3);

      if (name) {
        whereClauses.push('(u.username LIKE ? OR u.email LIKE ?)');
        params.push(`%${name}%`, `%${name}%`);
      }

      if (emailStatus) {
        whereClauses.push('u.email_status_id = ?');
        params.push(emailStatus);
      }

      if (userStatus) {
        whereClauses.push('u.user_status_id = ?');
        params.push(userStatus);
      }
    }

    if (whereClauses.length > 0) {
      baseQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

    // Count query
    let countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN user_ktp uk ON u.id = uk.user_id
    `;
    if (whereClauses.length > 0) {
      countQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Execute queries
    const [data, countResult] = await Promise.all([
      this.rawQuery(baseQuery + ' LIMIT ? OFFSET ?', [...params, limit, offset]),
      this.rawQuery(countQuery, params),
    ]);

    return {
      data,
      total: countResult[0].total,
      page,
      limit,
    };
  }

  /**
   * Update user email status
   * @param {number} userId
   * @param {number} statusId
   * @returns {Promise<Object>}
   */
  async updateEmailStatus(userId, statusId) {
    return this.update(userId, { email_status_id: statusId });
  }

  /**
   * Update user password
   * @param {number} userId
   * @param {string} hashedPassword
   * @returns {Promise<Object>}
   */
  async updatePassword(userId, hashedPassword) {
    return this.update(userId, { password: hashedPassword });
  }

  /**
   * Update user password by email
   * @param {string} email
   * @param {string} hashedPassword
   * @returns {Promise<Object>}
   */
  async updatePasswordByEmail(email, hashedPassword) {
    return this.updateWhere({ email }, { password: hashedPassword });
  }

  /**
   * Update user role
   * @param {number} userId
   * @param {number} roleId
   * @returns {Promise<Object>}
   */
  async updateRole(userId, roleId) {
    return this.update(userId, { role_id: roleId });
  }

  /**
   * Update main address
   * @param {number} userId
   * @param {number} addressId
   * @returns {Promise<Object>}
   */
  async updateMainAddress(userId, addressId) {
    return this.update(userId, { main_address_id: addressId });
  }

  /**
   * Clear main address
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async clearMainAddress(userId) {
    return this.update(userId, { main_address_id: null });
  }
}

module.exports = UserRepository;
