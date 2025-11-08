const { TagProductRepository } = require('../../repositories/products');

/**
 * Tag Product Service
 * Contains business logic for product tag operations
 */
class TagProductService {
  constructor() {
    this.tagProductRepository = new TagProductRepository();
  }

  /**
   * Get all tags with optional name filter
   * @param {string} name - Optional name filter
   * @returns {Promise<Array>}
   */
  async getTags(name = null) {
    if (name) {
      const query = `SELECT * FROM tag_product WHERE name LIKE ?`;
      return this.tagProductRepository.rawQuery(query, [`%${name}%`]);
    }
    return this.tagProductRepository.findAll();
  }

  /**
   * Create new tag
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async createTag(name) {
    // Check if tag already exists
    const existing = await this.tagProductRepository.findByName(name);
    if (existing) {
      throw new Error('Tag already exists');
    }

    return this.tagProductRepository.create({ name });
  }

  /**
   * Update tag
   * @param {number} tagId
   * @param {Object} tagData
   * @returns {Promise<void>}
   */
  async updateTag(tagId, tagData) {
    const tag = await this.tagProductRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagProductRepository.update(tagId, tagData);
  }

  /**
   * Delete tag
   * @param {number} tagId
   * @returns {Promise<void>}
   */
  async deleteTag(tagId) {
    const tag = await this.tagProductRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagProductRepository.delete(tagId);
  }
}

module.exports = TagProductService;
