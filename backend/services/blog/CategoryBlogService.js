const { CategoryBlogRepository } = require('../../repositories/blog');

/**
 * Category Blog Service
 * Contains business logic for blog category operations
 */
class CategoryBlogService {
  constructor() {
    this.categoryBlogRepository = new CategoryBlogRepository();
  }

  /**
   * Get all categories with blog count
   * @returns {Promise<Array>}
   */
  async getCategories() {
    return this.categoryBlogRepository.getCategoriesWithBlogCount();
  }

  /**
   * Create category
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async createCategory(name) {
    const existing = await this.categoryBlogRepository.findByName(name);

    if (existing) {
      throw new Error('Category already exists');
    }

    return this.categoryBlogRepository.create({ name });
  }

  /**
   * Update category
   * @param {number} categoryId
   * @param {string} name
   * @returns {Promise<void>}
   */
  async updateCategory(categoryId, name) {
    const category = await this.categoryBlogRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    await this.categoryBlogRepository.update(categoryId, { name });
  }

  /**
   * Delete category
   * @param {number} categoryId
   * @returns {Promise<void>}
   */
  async deleteCategory(categoryId) {
    const category = await this.categoryBlogRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    await this.categoryBlogRepository.delete(categoryId);
  }
}

module.exports = CategoryBlogService;
