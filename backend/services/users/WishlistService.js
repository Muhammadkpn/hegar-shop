const { WishlistRepository } = require('../../repositories/users');

/**
 * Wishlist Service
 * Contains business logic for wishlist operations
 */
class WishlistService {
  constructor() {
    this.wishlistRepository = new WishlistRepository();
  }

  /**
   * Get user wishlist with product details
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async getUserWishlist(userId) {
    return this.wishlistRepository.getUserWishlistWithProducts(userId);
  }

  /**
   * Add to wishlist
   * @param {number} userId
   * @param {number} productId
   * @returns {Promise<Object>}
   */
  async addToWishlist(userId, productId) {
    // Check if already in wishlist
    const existing = await this.wishlistRepository.findByUserAndProduct(userId, productId);

    if (existing) {
      throw new Error('Product already in wishlist');
    }

    return this.wishlistRepository.create({
      user_id: userId,
      product_id: productId,
      created_at: new Date(),
    });
  }

  /**
   * Remove from wishlist
   * @param {number} userId
   * @param {number} productId
   * @returns {Promise<void>}
   */
  async removeFromWishlist(userId, productId) {
    const wishlistItem = await this.wishlistRepository.findByUserAndProduct(userId, productId);

    if (!wishlistItem) {
      throw new Error('Wishlist item not found');
    }

    await this.wishlistRepository.deleteByUserAndProduct(userId, productId);
  }
}

module.exports = WishlistService;
