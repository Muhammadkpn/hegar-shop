const { CartService } = require('../../services/transactions');
const { getImageUrl } = require('../../helpers/queryHelper');

const cartService = new CartService();

/**
 * Cart Controller - Clean Architecture
 * Manages shopping cart operations
 */

module.exports = {
  /**
   * Get user's cart
   */
  getCart: async (req, res) => {
    const { id } = req.params;

    try {
      const cartData = await cartService.getUserCart(id);

      // Convert image paths to full URLs (view concern)
      if (cartData.order_detail) {
        cartData.order_detail.forEach((store) => {
          if (store.products) {
            store.products.forEach((product) => {
              if (product.image) {
                product.image = getImageUrl(product.image, req);
              }
            });
          }
        });
      }

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: cartData,
      });
    } catch (error) {
      console.error('getCart error:', error);
      const statusCode = error.message === 'Your cart is empty' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Add product to cart
   */
  addToCart: async (req, res) => {
    const {
      userId, storeId, productId, weightEach, qty, priceEach,
    } = req.body;

    // Validate quantity
    if (qty < 1) {
      res.status(422).send({
        status: 'fail',
        code: 422,
        message: 'Total input can\'t less than 1!',
      });
      return;
    }

    try {
      await cartService.addToCart({
        userId,
        storeId,
        productId,
        qty,
        priceEach,
        weightEach,
      });

      res.status(200).send({
        status: 'success',
        message: `Product with id: ${productId} has been added to cart`,
      });
    } catch (error) {
      console.error('addToCart error:', error);
      let statusCode = 500;
      if (error.message === 'Product not found') {
        statusCode = 422;
      } else if (error.message === 'Insufficient stock' || error.message.includes('only available')) {
        statusCode = 400;
      }
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit quantity in cart
   */
  editQtyInCart: async (req, res) => {
    const { productId, qty } = req.body;
    const { id } = req.params;

    // Validate quantity
    if (qty <= 0) {
      res.status(422).send({
        status: 'fail',
        code: 422,
        message: 'Your input quantity can\'t less than 1',
      });
      return;
    }

    try {
      await cartService.updateCartItem(id, qty);

      res.status(200).send({
        status: 'success',
        message: 'Your quantity in the cart already edited',
      });
    } catch (error) {
      console.error('editQtyInCart error:', error);
      let statusCode = 500;
      if (error.message === 'Cart item not found') {
        statusCode = 422;
      } else if (error.message === 'Insufficient stock' || error.message.includes('only available')) {
        statusCode = 400;
      }
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete product from cart
   */
  deleteCart: async (req, res) => {
    const { id } = req.params;

    try {
      await cartService.removeFromCart(id);

      res.status(200).send({
        status: 'success',
        message: 'This product has been deleted',
      });
    } catch (error) {
      console.error('deleteCart error:', error);
      const statusCode = error.message === 'Cart item not found' ? 422 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Cart item not found'
          ? 'There is something wrong. You can\'t delete this product from cart'
          : error.message,
      });
    }
  },
};
