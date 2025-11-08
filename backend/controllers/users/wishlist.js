const { WishlistService } = require('../../services/users');
const { getImageUrl } = require('../../helpers/queryHelper');

const wishlistService = new WishlistService();

/**
 * Wishlist Controller - Clean Architecture
 * Manages user wishlist operations
 */

module.exports = {
  /**
   * Get user wishlist
   */
  getWishlist: async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
      // Only support user-id type for now
      if (type !== 'user-id') {
        return res.status(400).send({
          status: 'fail',
          code: 400,
          message: 'Invalid type parameter',
        });
      }

      const result = await wishlistService.getUserWishlist(id);

      // Convert image paths to full URLs
      result.forEach((item, index) => {
        if (item.image) {
          result[index].image = getImageUrl(item.image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: result,
      });
    } catch (error) {
      console.error('getWishlist error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add to wishlist
   */
  addWishlist: async (req, res) => {
    const { userId, productId } = req.body;

    try {
      await wishlistService.addToWishlist(userId, productId);

      res.status(200).send({
        status: 'success',
        message: 'Product added to wishlist successfully',
      });
    } catch (error) {
      console.error('addWishlist error:', error);
      const statusCode = error.message === 'Product already in wishlist' ? 409 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete from wishlist
   */
  deleteWishlist: async (req, res) => {
    const { userId, productId } = req.body;

    try {
      await wishlistService.removeFromWishlist(userId, productId);

      res.status(200).send({
        status: 'success',
        message: 'Product removed from wishlist successfully',
      });
    } catch (error) {
      console.error('deleteWishlist error:', error);
      const statusCode = error.message === 'Wishlist item not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },
};
