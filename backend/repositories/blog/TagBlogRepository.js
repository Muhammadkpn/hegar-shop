const BaseRepository = require('../BaseRepository');

/**
 * Tag Blog Repository
 * Handles all database operations for tag_blog table
 */
class TagBlogRepository extends BaseRepository {
  constructor() {
    super('tag_blog', 'id');
  }

  /**
   * Get tags with blog count
   * @returns {Promise<Array>}
   */
  async getTagsWithBlogCount() {
    const query = `
      SELECT t.*, COUNT(bt.blog_id) AS total_blog
      FROM tag_blog t
      LEFT JOIN blog_tag bt ON t.id = bt.tag_id
      GROUP BY t.id
    `;
    return this.rawQuery(query);
  }

  /**
   * Find tag by name
   * @param {string} name
   * @returns {Promise<Object|null>}
   */
  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = TagBlogRepository;
