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

  /**
   * Get comments with replies for public view (status = 1 only)
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getCommentsWithReplies(blogId, includeInactive = false) {
    const statusFilter = includeInactive ? '' : 'AND bc.status = 1';
    const statusFilter2 = includeInactive ? '' : 'WHERE bc.status = 1';

    const query = `
      SELECT tb.id, tb.user_id, tb.full_name, tb.image, tb.date, tb.comment, tb.status,
             GROUP_CONCAT(tb.reply SEPARATOR '//') AS reply
      FROM (
        SELECT bc1.id, bc1.user_id, bc1.full_name, bc1.image, bc1.date, bc1.comment, bc1.status,
          (CASE WHEN bc2.user_id IS NULL THEN NULL
            ELSE CONCAT('{"id": ', bc2.id, ',"user_id": ', bc2.user_id, ',"full_name": "', bc2.full_name,
              '","image":"', bc2.image, '","date":"', bc2.date, '","comment":"', bc2.comment,
              '", "status":', bc2.status, '}')
          END) AS reply
        FROM (
          SELECT bc.*, tb.full_name, tb.image
          FROM blog_comment bc
          LEFT JOIN (
            SELECT u.id, uk.full_name, u.image
            FROM users u
            JOIN user_ktp uk ON u.id = uk.user_id
          ) tb ON bc.user_id = tb.id
          WHERE bc.blog_id = ? AND bc.reply_id IS NULL ${statusFilter}
        ) bc1
        LEFT JOIN (
          SELECT bc.*, tb.full_name, tb.image
          FROM blog_comment bc
          LEFT JOIN (
            SELECT u.id, uk.full_name, u.image
            FROM users u
            JOIN user_ktp uk ON u.id = uk.user_id
          ) tb ON bc.user_id = tb.id
          ${statusFilter2}
        ) bc2 ON bc1.id = bc2.reply_id
        ORDER BY bc2.date
      ) AS tb
      GROUP BY tb.id, tb.user_id, tb.full_name, tb.image, tb.date, tb.comment, tb.status
      ORDER BY tb.date
    `;
    return this.rawQuery(query, [blogId]);
  }
}

module.exports = BlogCommentRepository;
