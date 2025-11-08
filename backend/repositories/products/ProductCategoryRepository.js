const BaseRepository = require('../BaseRepository');

/**
 * Product Category Repository
 * Handles all database operations for product_category table (junction table)
 */
class ProductCategoryRepository extends BaseRepository {
  constructor() {
    super('product_category', 'id');
  }

  /**
   * Get categories by product ID
   * @param {number} productId
   * @returns {Promise<Array>}
   */
  async getCategoriesByProduct(productId) {
    const query = `
      SELECT c.*
      FROM product_category pc
      JOIN category_product c ON pc.category_id = c.id
      WHERE pc.product_id = ?
    `;
    return this.rawQuery(query, [productId]);
  }

  /**
   * Get products by category ID
   * @param {number} categoryId
   * @returns {Promise<Array>}
   */
  async getProductsByCategory(categoryId) {
    return this.findAll({ where: { category_id: categoryId } });
  }

  /**
   * Delete by product ID
   * @param {number} productId
   * @returns {Promise<Object>}
   */
  async deleteByProduct(productId) {
    return this.deleteWhere({ product_id: productId });
  }

  /**
   * Bulk create product categories
   * @param {number} productId
   * @param {Array<number>} categoryIds
   * @returns {Promise<Object>}
   */
  async addCategoriesToProduct(productId, categoryIds) {
    const data = categoryIds.map((categoryId) => ({
      product_id: productId,
      category_id: categoryId,
    }));
    return this.createMany(data);
  }
}

module.exports = ProductCategoryRepository;
