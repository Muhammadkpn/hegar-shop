const BaseRepository = require('../BaseRepository');

/**
 * Blog Comment Repository
 * Handles all database operations for blog_comment table
 */
class BlogCommentRepository extends BaseRepository {
  constructor() {
    super('blog_comment', 'id');
  }

  /**
   * Get comments by blog ID with user details
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getCommentsByBlog(blogId) {
    const query = `
      SELECT bc.*, u.username, u.image as user_image
      FROM blog_comment bc
      JOIN users u ON bc.user_id = u.id
      WHERE bc.blog_id = ?
      ORDER BY bc.created_at DESC
    `;
    return this.rawQuery(query, [blogId]);
  }

  /**
   * Get comment count by blog ID
   * @param {number} blogId
   * @returns {Promise<number>}
   */
  async getCommentCount(blogId) {
    return this.count({ blog_id: blogId });
  }
}

module.exports = BlogCommentRepository;
