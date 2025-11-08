const BaseRepository = require('../BaseRepository');

/**
 * Wishlist Repository
 * Handles all database operations for wishlist table
 */
class WishlistRepository extends BaseRepository {
  constructor() {
    super('wishlist', 'id');
  }

  /**
   * Find wishlist item by user and product
   * @param {number} userId
   * @param {number} productId
   * @returns {Promise<Object|null>}
   */
  async findByUserAndProduct(userId, productId) {
    return this.findOne({ user_id: userId, product_id: productId });
  }

  /**
   * Get user wishlist with product details
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async getUserWishlistWithProducts(userId) {
    const query = `
      SELECT w.*, p.name, p.price, p.image, p.stock, p.description
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `;
    return this.rawQuery(query, [userId]);
  }

  /**
   * Delete wishlist item by user and product
   * @param {number} userId
   * @param {number} productId
   * @returns {Promise<Object>}
   */
  async deleteByUserAndProduct(userId, productId) {
    return this.deleteWhere({ user_id: userId, product_id: productId });
  }
}

module.exports = WishlistRepository;
