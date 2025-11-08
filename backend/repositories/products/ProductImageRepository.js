const BaseRepository = require('../BaseRepository');

/**
 * Product Image Repository
 * Handles all database operations for product_image table
 */
class ProductImageRepository extends BaseRepository {
  constructor() {
    super('product_image', 'id');
  }

  /**
   * Get images by product ID
   * @param {number} productId
   * @returns {Promise<Array>}
   */
  async getImagesByProduct(productId) {
    return this.findAll({ where: { product_id: productId } });
  }

  /**
   * Delete images by product ID
   * @param {number} productId
   * @returns {Promise<Object>}
   */
  async deleteByProduct(productId) {
    return this.deleteWhere({ product_id: productId });
  }
}

module.exports = ProductImageRepository;
