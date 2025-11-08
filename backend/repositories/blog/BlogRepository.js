const BaseRepository = require('../BaseRepository');

/**
 * Blog Repository
 * Handles all database operations for blog table
 */
class BlogRepository extends BaseRepository {
  constructor() {
    super('blog', 'id');
  }

  /**
   * Get blogs with complete details (author, categories, tags)
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getBlogsWithDetails(filters = {}) {
    const { search, categories, tags, sortField = 'b.date', sortOrder = 'DESC', status = 1 } = filters;

    let query = `
      SELECT b.*, uk.full_name AS author_name, tb_2.category AS category, tb_1.tags
      FROM blog b
      LEFT JOIN user_ktp uk ON b.author_id = uk.user_id
      LEFT JOIN (
        SELECT bt.blog_id, GROUP_CONCAT(bt.tag_id) AS tag_id, GROUP_CONCAT(t.name) AS tags
        FROM blog_tag bt
        JOIN tag_blog t ON bt.tag_id = t.id
        GROUP BY bt.blog_id
      ) tb_1 ON b.id = tb_1.blog_id
      LEFT JOIN (
        SELECT bc.blog_id, GROUP_CONCAT(bc.category_id) AS category_id, GROUP_CONCAT(cb.name) AS category
        FROM blog_category bc
        JOIN category_blog cb ON bc.category_id = cb.id
        GROUP BY bc.blog_id
      ) tb_2 ON b.id = tb_2.blog_id
      WHERE b.status = ?
    `;

    const params = [status];

    // Add filters
    if (search && categories && tags) {
      query += ' AND b.title LIKE ? AND tb_2.category LIKE ? AND tb_1.tags LIKE ?';
      params.push(`%${search}%`, `%${categories}%`, `%${tags}%`);
    } else if (search && categories) {
      query += ' AND b.title LIKE ? AND tb_2.category LIKE ?';
      params.push(`%${search}%`, `%${categories}%`);
    } else if (search && tags) {
      query += ' AND b.title LIKE ? AND tb_1.tags LIKE ?';
      params.push(`%${search}%`, `%${tags}%`);
    } else if (tags && categories) {
      query += ' AND tb_2.category LIKE ? AND tb_1.tags LIKE ?';
      params.push(`%${categories}%`, `%${tags}%`);
    } else if (search) {
      query += ' AND b.title LIKE ?';
      params.push(`%${search}%`);
    } else if (categories) {
      query += ' AND tb_2.category LIKE ?';
      params.push(`%${categories}%`);
    } else if (tags) {
      query += ' AND tb_1.tags LIKE ?';
      params.push(`%${tags}%`);
    }

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    return this.rawQuery(query, params);
  }

  /**
   * Get blog by ID with details
   * @param {number} blogId
   * @returns {Promise<Object|null>}
   */
  async getBlogWithDetails(blogId) {
    const query = `
      SELECT b.*, uk.full_name AS author_name, tb_2.category AS category, tb_1.tags
      FROM blog b
      LEFT JOIN user_ktp uk ON b.author_id = uk.user_id
      LEFT JOIN (
        SELECT bt.blog_id, GROUP_CONCAT(bt.tag_id) AS tag_id, GROUP_CONCAT(t.name) AS tags
        FROM blog_tag bt
        JOIN tag_blog t ON bt.tag_id = t.id
        GROUP BY bt.blog_id
      ) tb_1 ON b.id = tb_1.blog_id
      LEFT JOIN (
        SELECT bc.blog_id, GROUP_CONCAT(bc.category_id) AS category_id, GROUP_CONCAT(cb.name) AS category
        FROM blog_category bc
        JOIN category_blog cb ON bc.category_id = cb.id
        GROUP BY bc.blog_id
      ) tb_2 ON b.id = tb_2.blog_id
      WHERE b.id = ?
    `;

    const results = await this.rawQuery(query, [blogId]);
    return results[0] || null;
  }

  /**
   * Increment view count
   * @param {number} blogId
   * @returns {Promise<Object>}
   */
  async incrementView(blogId) {
    const query = 'UPDATE blog SET view = view + 1 WHERE id = ?';
    return this.rawQuery(query, [blogId]);
  }

  /**
   * Find blog by slug
   * @param {string} slug
   * @returns {Promise<Object|null>}
   */
  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = BlogRepository;
