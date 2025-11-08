const { asyncQuery, executeTransaction } = require('../helpers/queryHelper');

/**
 * Base Repository Class
 * Provides common CRUD operations for all repositories
 */
class BaseRepository {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Find all records with optional conditions
   * @param {Object} options - Query options { where, orderBy, limit, offset }
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    const { where = {}, orderBy, limit, offset } = options;

    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];

    // Build WHERE clause
    if (Object.keys(where).length > 0) {
      const conditions = Object.entries(where).map(([key, value]) => {
        params.push(value);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ORDER BY
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    // Add LIMIT and OFFSET
    if (limit) {
      query += ` LIMIT ?`;
      params.push(limit);
    }
    if (offset) {
      query += ` OFFSET ?`;
      params.push(offset);
    }

    return asyncQuery(query, params);
  }

  /**
   * Find a single record by ID
   * @param {number|string} id - Record ID
   * @returns {Promise<Object|null>} Record or null
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    const results = await asyncQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Find a single record by conditions
   * @param {Object} where - Where conditions
   * @returns {Promise<Object|null>} Record or null
   */
  async findOne(where = {}) {
    const results = await this.findAll({ where, limit: 1 });
    return results[0] || null;
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record with ID
   */
  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
    `;

    const result = await asyncQuery(query, values);
    return {
      [this.primaryKey]: result.insertId,
      ...data,
    };
  }

  /**
   * Create multiple records
   * @param {Array<Object>} dataArray - Array of record data
   * @returns {Promise<Object>} Insert result
   */
  async createMany(dataArray) {
    if (!dataArray || dataArray.length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const columns = Object.keys(dataArray[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const valuesSets = dataArray.map(() => `(${placeholders})`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES ${valuesSets}
    `;

    const values = dataArray.flatMap((data) => Object.values(data));
    return asyncQuery(query, values);
  }

  /**
   * Update a record by ID
   * @param {number|string} id - Record ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Update result
   */
  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col) => `${col} = ?`).join(', ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${this.primaryKey} = ?
    `;

    values.push(id);
    const result = await asyncQuery(query, values);
    return result;
  }

  /**
   * Update records by conditions
   * @param {Object} where - Where conditions
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Update result
   */
  async updateWhere(where, data) {
    const setColumns = Object.keys(data);
    const setValues = Object.values(data);
    const setClause = setColumns.map((col) => `${col} = ?`).join(', ');

    const whereColumns = Object.keys(where);
    const whereValues = Object.values(where);
    const whereClause = whereColumns.map((col) => `${col} = ?`).join(' AND ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${whereClause}
    `;

    const values = [...setValues, ...whereValues];
    return asyncQuery(query, values);
  }

  /**
   * Delete a record by ID
   * @param {number|string} id - Record ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    return asyncQuery(query, [id]);
  }

  /**
   * Delete records by conditions
   * @param {Object} where - Where conditions
   * @returns {Promise<Object>} Delete result
   */
  async deleteWhere(where) {
    const columns = Object.keys(where);
    const values = Object.values(where);
    const whereClause = columns.map((col) => `${col} = ?`).join(' AND ');

    const query = `DELETE FROM ${this.tableName} WHERE ${whereClause}`;
    return asyncQuery(query, values);
  }

  /**
   * Count records with optional conditions
   * @param {Object} where - Where conditions
   * @returns {Promise<number>} Count of records
   */
  async count(where = {}) {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(where).length > 0) {
      const conditions = Object.entries(where).map(([key, value]) => {
        params.push(value);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const results = await asyncQuery(query, params);
    return results[0].total;
  }

  /**
   * Check if record exists
   * @param {Object} where - Where conditions
   * @returns {Promise<boolean>} True if exists
   */
  async exists(where) {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Execute a custom query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   */
  async rawQuery(query, params = []) {
    return asyncQuery(query, params);
  }

  /**
   * Execute transaction
   * @param {Function} callback - Transaction callback
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    return executeTransaction(callback);
  }
}

module.exports = BaseRepository;
