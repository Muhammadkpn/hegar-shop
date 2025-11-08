const BaseRepository = require('../BaseRepository');

/**
 * Blog Tag Repository
 * Handles all database operations for blog_tag table (junction table)
 */
class BlogTagRepository extends BaseRepository {
  constructor() {
    super('blog_tag', 'id');
  }

  /**
   * Get tags by blog ID
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getTagsByBlog(blogId) {
    const query = `
      SELECT t.*
      FROM blog_tag bt
      JOIN tag_blog t ON bt.tag_id = t.id
      WHERE bt.blog_id = ?
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
   * Bulk create blog tags
   * @param {number} blogId
   * @param {Array<number>} tagIds
   * @returns {Promise<Object>}
   */
  async addTagsToBlog(blogId, tagIds) {
    const data = tagIds.map((tagId) => ({
      blog_id: blogId,
      tag_id: tagId,
    }));
    return this.createMany(data);
  }
}

module.exports = BlogTagRepository;
