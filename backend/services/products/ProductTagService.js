const {
  ProductTagRepository,
  ProductRepository,
  TagProductRepository,
} = require('../../repositories/products');

/**
 * Product Tag Service
 * Contains business logic for product-tag relationship operations
 */
class ProductTagService {
  constructor() {
    this.productTagRepository = new ProductTagRepository();
    this.productRepository = new ProductRepository();
    this.tagProductRepository = new TagProductRepository();
  }

  /**
   * Get all product-tag relationships
   * @returns {Promise<Array>}
   */
  async getProductTags() {
    const query = `
      SELECT pt.product_id, p.name AS product_name, pt.tag_id, tp.name AS tags
      FROM product_tag pt
      JOIN products p ON pt.product_id = p.id
      JOIN tag_product tp ON pt.tag_id = tp.id
    `;
    return this.productTagRepository.rawQuery(query);
  }

  /**
   * Get tag counts
   * @returns {Promise<Array>}
   */
  async getTagCount() {
    const query = `
      SELECT pt.tag_id, tp.name AS tags, COUNT(pt.tag_id) AS count
      FROM product_tag pt
      JOIN tag_product tp ON pt.tag_id = tp.id
      GROUP BY pt.tag_id, tp.name
      ORDER BY count DESC
    `;
    return this.productTagRepository.rawQuery(query);
  }

  /**
   * Get tag counts by store
   * @param {number} storeId
   * @returns {Promise<Object>}
   */
  async getTagCountByStore(storeId) {
    const query = `
      SELECT pt.tag_id, tp.name AS tags, COUNT(pt.tag_id) AS count
      FROM product_tag pt
      JOIN tag_product tp ON pt.tag_id = tp.id
      JOIN products p ON pt.product_id = p.id
      WHERE p.store_id = ?
      GROUP BY pt.tag_id, tp.name
      ORDER BY count DESC
    `;

    const countTag = await this.productTagRepository.rawQuery(query, [storeId]);

    return {
      store_id: storeId,
      countTag,
    };
  }

  /**
   * Add tags to latest product
   * @param {Array<number>} tagIds
   * @returns {Promise<void>}
   */
  async addProductTags(tagIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(tagIds)];
    if (uniqueIds.length !== tagIds.length) {
      throw new Error('Your input has duplicate value');
    }

    // Verify all tag IDs exist
    const tags = await this.tagProductRepository.findAll();
    const validTagIds = tags.map((t) => t.id);
    const allValid = tagIds.every((id) => validTagIds.includes(id));

    if (!allValid) {
      throw new Error('One of the tag id doesn\'t exists in our database');
    }

    // Get latest product ID
    const latestProducts = await this.productRepository.findAll({
      orderBy: 'id',
      order: 'DESC',
      limit: 1,
    });

    if (latestProducts.length === 0) {
      throw new Error('No products found');
    }

    const productId = latestProducts[0].id;

    // Add tags to product
    await this.productTagRepository.addTagsToProduct(productId, tagIds);
  }

  /**
   * Update product tag (single tag update)
   * @param {number} id - Product-tag relationship ID
   * @param {number} tagId - New tag ID
   * @returns {Promise<void>}
   */
  async updateProductTag(id, tagId) {
    const productTag = await this.productTagRepository.findById(id);

    if (!productTag) {
      throw new Error('Product tag not found');
    }

    await this.productTagRepository.update(id, { tag_id: tagId });
  }

  /**
   * Update all tags for a product
   * @param {number} productId
   * @param {Array<number>} tagIds
   * @returns {Promise<void>}
   */
  async updateProductTags(productId, tagIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(tagIds)];
    if (uniqueIds.length !== tagIds.length) {
      throw new Error('Your input has duplicate value');
    }

    // Verify all tag IDs exist
    const tags = await this.tagProductRepository.findAll();
    const validTagIds = tags.map((t) => t.id);
    const allValid = tagIds.every((id) => validTagIds.includes(id));

    if (!allValid) {
      throw new Error('One of the tag id doesn\'t exists in our database');
    }

    // Delete existing tags
    await this.productTagRepository.deleteByProduct(productId);

    // Add new tags
    await this.productTagRepository.addTagsToProduct(productId, tagIds);
  }

  /**
   * Delete product-tag relationship
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteProductTag(id) {
    const productTag = await this.productTagRepository.findById(id);

    if (!productTag) {
      throw new Error('Product tag not found');
    }

    await this.productTagRepository.delete(id);
  }
}

module.exports = ProductTagService;
