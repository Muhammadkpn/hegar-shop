const BaseRepository = require('../BaseRepository');

/**
 * Category Product Repository
 * Handles all database operations for category_product table
 */
class CategoryProductRepository extends BaseRepository {
  constructor() {
    super('category_product', 'id');
  }

  /**
   * Get categories with product count
   * @returns {Promise<Array>}
   */
  async getCategoriesWithProductCount() {
    const query = `
      SELECT c.*, COUNT(pc.product_id) AS total_product
      FROM category_product c
      LEFT JOIN product_category pc ON c.id = pc.category_id
      GROUP BY c.id
    `;
    return this.rawQuery(query);
  }

  /**
   * Find category by name
   * @param {string} name
   * @returns {Promise<Object|null>}
   */
  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = CategoryProductRepository;
