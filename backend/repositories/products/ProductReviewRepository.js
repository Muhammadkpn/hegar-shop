const BaseRepository = require('../BaseRepository');

/**
 * Product Review Repository
 * Handles all database operations for product_review table
 */
class ProductReviewRepository extends BaseRepository {
  constructor() {
    super('product_review', 'review_id');
  }

  /**
   * Get reviews by product with user details
   * @param {number} productId
   * @returns {Promise<Array>}
   */
  async getReviewsByProduct(productId) {
    const query = `
      SELECT pr.*, od.product_id, u.username, u.image as user_image
      FROM product_review pr
      JOIN order_details od ON pr.review_id = od.review_id
      JOIN orders o ON od.order_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE od.product_id = ?
      ORDER BY pr.created_at DESC
    `;
    return this.rawQuery(query, [productId]);
  }

  /**
   * Get review statistics for a product
   * @param {number} productId
   * @returns {Promise<Object|null>}
   */
  async getProductReviewStats(productId) {
    const query = `
      SELECT
        COUNT(*) as total_reviews,
        AVG(pr.rating) as average_rating,
        SUM(CASE WHEN pr.rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN pr.rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN pr.rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN pr.rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN pr.rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM product_review pr
      JOIN order_details od ON pr.review_id = od.review_id
      WHERE od.product_id = ?
    `;
    const results = await this.rawQuery(query, [productId]);
    return results[0] || null;
  }
}

module.exports = ProductReviewRepository;
