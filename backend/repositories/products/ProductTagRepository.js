const BaseRepository = require('../BaseRepository');

/**
 * Product Tag Repository
 * Handles all database operations for product_tag table (junction table)
 */
class ProductTagRepository extends BaseRepository {
  constructor() {
    super('product_tag', 'id');
  }

  /**
   * Get tags by product ID
   * @param {number} productId
   * @returns {Promise<Array>}
   */
  async getTagsByProduct(productId) {
    const query = `
      SELECT t.*
      FROM product_tag pt
      JOIN tag_product t ON pt.tag_id = t.id
      WHERE pt.product_id = ?
    `;
    return this.rawQuery(query, [productId]);
  }

  /**
   * Get products by tag ID
   * @param {number} tagId
   * @returns {Promise<Array>}
   */
  async getProductsByTag(tagId) {
    return this.findAll({ where: { tag_id: tagId } });
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
   * Bulk create product tags
   * @param {number} productId
   * @param {Array<number>} tagIds
   * @returns {Promise<Object>}
   */
  async addTagsToProduct(productId, tagIds) {
    const data = tagIds.map((tagId) => ({
      product_id: productId,
      tag_id: tagId,
    }));
    return this.createMany(data);
  }
}

module.exports = ProductTagRepository;
