const BaseRepository = require('../BaseRepository');

/**
 * Tag Product Repository
 * Handles all database operations for tag_product table
 */
class TagProductRepository extends BaseRepository {
  constructor() {
    super('tag_product', 'id');
  }

  /**
   * Get tags with product count
   * @returns {Promise<Array>}
   */
  async getTagsWithProductCount() {
    const query = `
      SELECT t.*, COUNT(pt.product_id) AS total_product
      FROM tag_product t
      LEFT JOIN product_tag pt ON t.id = pt.tag_id
      GROUP BY t.id
    `;
    return this.rawQuery(query);
  }

  /**
   * Find tag by name
   * @param {string} name
   * @returns {Promise<Object|null>}
   */
  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = TagProductRepository;
