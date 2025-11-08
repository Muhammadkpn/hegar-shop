const { TagBlogRepository } = require('../../repositories/blog');

/**
 * Tag Blog Service
 * Contains business logic for blog tag operations
 */
class TagBlogService {
  constructor() {
    this.tagBlogRepository = new TagBlogRepository();
  }

  /**
   * Get all tags with blog count
   * @returns {Promise<Array>}
   */
  async getTags() {
    return this.tagBlogRepository.getTagsWithBlogCount();
  }

  /**
   * Create tag
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async createTag(name) {
    const existing = await this.tagBlogRepository.findByName(name);

    if (existing) {
      throw new Error('Tag already exists');
    }

    return this.tagBlogRepository.create({ name });
  }

  /**
   * Update tag
   * @param {number} tagId
   * @param {string} name
   * @returns {Promise<void>}
   */
  async updateTag(tagId, name) {
    const tag = await this.tagBlogRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagBlogRepository.update(tagId, { name });
  }

  /**
   * Delete tag
   * @param {number} tagId
   * @returns {Promise<void>}
   */
  async deleteTag(tagId) {
    const tag = await this.tagBlogRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagBlogRepository.delete(tagId);
  }
}

module.exports = TagBlogService;
