const BaseRepository = require('../BaseRepository');

/**
 * Category Blog Repository
 * Handles all database operations for category_blog table
 */
class CategoryBlogRepository extends BaseRepository {
  constructor() {
    super('category_blog', 'id');
  }

  /**
   * Get categories with blog count
   * @returns {Promise<Array>}
   */
  async getCategoriesWithBlogCount() {
    const query = `
      SELECT c.*, COUNT(bc.blog_id) AS total_blog
      FROM category_blog c
      LEFT JOIN blog_category bc ON c.id = bc.category_id
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

module.exports = CategoryBlogRepository;
