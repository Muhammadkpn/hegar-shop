const { ProductReviewRepository } = require('../../repositories/products');

/**
 * Product Review Service
 * Contains business logic for product review operations
 */
class ProductReviewService {
  constructor() {
    this.productReviewRepository = new ProductReviewRepository();
  }

  /**
   * Get product reviews by different types
   * @param {string} id - ID value (user/order/review/product)
   * @param {string} type - Type of query (user-id, order-number, review-id, product-id, testimony)
   * @returns {Promise<Array|Object>}
   */
  async getProductReviews(id, type) {
    let query = `
      SELECT pr.id, pr.review_id, uk.user_id, uk.full_name, od.order_number, od.product_id, pr.date,
             GROUP_CONCAT(ri.image) AS image, pr.comment, pr.rating, pr.status
      FROM product_review pr
      LEFT JOIN review_image ri ON pr.review_id = ri.review_id
      JOIN order_details od ON pr.id = od.review_id
      LEFT JOIN user_ktp uk ON pr.user_id = uk.user_id
      WHERE pr.rating IS NOT NULL
    `;

    let params = [];

    switch (type) {
      case 'user-id':
        query += ' AND pr.user_id = ? GROUP BY pr.id';
        params = [id];
        break;
      case 'order-number':
        query += ' AND od.order_number = ? GROUP BY pr.id';
        params = [id];
        break;
      case 'review-id':
        query += ' AND pr.review_id = ? GROUP BY pr.id';
        params = [id];
        break;
      case 'product-id':
        query += ' AND od.product_id = ? GROUP BY pr.id';
        params = [id];
        break;
      case 'testimony':
        query += ' GROUP BY pr.id ORDER BY rand() LIMIT ?';
        params = [parseInt(id, 10)];
        break;
      default:
        query += ' GROUP BY pr.id';
    }

    const reviews = await this.productReviewRepository.rawQuery(query, params);

    // Return single object for review-id type, array for others
    return type === 'review-id' && reviews.length > 0 ? reviews[0] : reviews;
  }

  /**
   * Upload review images
   * @param {string} reviewId
   * @param {Array} files - Array of uploaded files
   * @returns {Promise<void>}
   */
  async uploadReviewImages(reviewId, files) {
    const imagePaths = files.map((file) => ({
      review_id: reviewId,
      image: `image/users/review/${file.filename}`,
    }));

    // Insert all images
    const query = `INSERT INTO review_image (review_id, image) VALUES ?`;
    const values = imagePaths.map((img) => [img.review_id, img.image]);

    await this.productReviewRepository.rawQuery(query, [values]);
  }

  /**
   * Add or update review
   * @param {number} reviewId
   * @param {Object} reviewData
   * @returns {Promise<void>}
   */
  async addReview(reviewId, reviewData) {
    const { comment, rating } = reviewData;

    // Check if review exists
    const review = await this.productReviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await this.productReviewRepository.update(reviewId, {
      date,
      comment,
      rating,
      status: 1,
    });
  }

  /**
   * Delete review
   * @param {number} reviewId
   * @returns {Promise<void>}
   */
  async deleteReview(reviewId) {
    const review = await this.productReviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    await this.productReviewRepository.delete(reviewId);
  }
}

module.exports = ProductReviewService;
