const BaseRepository = require('../BaseRepository');

/**
 * User Bank Account Repository
 * Handles all database operations for user_bank_account table
 */
class UserBankAccountRepository extends BaseRepository {
  constructor() {
    super('user_bank_account', 'id');
  }

  /**
   * Find all bank accounts by user ID
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async findByUserId(userId) {
    return this.findAll({ where: { user_id: userId } });
  }

  /**
   * Find bank account by account number
   * @param {string} accountNumber
   * @returns {Promise<Object|null>}
   */
  async findByAccountNumber(accountNumber) {
    return this.findOne({ account_number: accountNumber });
  }

  /**
   * Get bank accounts with filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getBankAccountsWithFilters(filters = {}) {
    const { status, search } = filters;

    let query = 'SELECT * FROM user_bank_account';
    const params = [];
    const whereClauses = [];

    if (status) {
      whereClauses.push('bank_status_id = ?');
      params.push(status);
    }

    if (search) {
      whereClauses.push('(bank_name LIKE ? OR account_name LIKE ? OR account_number LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    return this.rawQuery(query, params);
  }

  /**
   * Get bank accounts by user with filters
   * @param {number} userId
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getBankAccountsByUserWithFilters(userId, filters = {}) {
    const { status, search } = filters;

    let query = 'SELECT * FROM user_bank_account WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND bank_status_id = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (bank_name LIKE ? OR account_name LIKE ? OR account_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    return this.rawQuery(query, params);
  }
}

module.exports = UserBankAccountRepository;
