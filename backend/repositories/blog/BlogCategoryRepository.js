const BaseRepository = require('../BaseRepository');

/**
 * Blog Category Repository
 * Handles all database operations for blog_category table (junction table)
 */
class BlogCategoryRepository extends BaseRepository {
  constructor() {
    super('blog_category', 'id');
  }

  /**
   * Get categories by blog ID
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getCategoriesByBlog(blogId) {
    const query = `
      SELECT c.*
      FROM blog_category bc
      JOIN category_blog c ON bc.category_id = c.id
      WHERE bc.blog_id = ?
    `;
    return this.rawQuery(query, [blogId]);
  }

  /**
   * Delete by blog ID
   * @param {number} blogId
   * @returns {Promise<Object>}
   */
  async deleteByBlog(blogId) {
    return this.deleteWhere({ blog_id: blogId });
  }

  /**
   * Bulk create blog categories
   * @param {number} blogId
   * @param {Array<number>} categoryIds
   * @returns {Promise<Object>}
   */
  async addCategoriesToBlog(blogId, categoryIds) {
    const data = categoryIds.map((categoryId) => ({
      blog_id: blogId,
      category_id: categoryId,
    }));
    return this.createMany(data);
  }
}

module.exports = BlogCategoryRepository;
