const orderid = require('order-id')('mysecret');
const {
  OrderRepository,
  OrderDetailRepository,
  ShippingOrderRepository,
} = require('../../repositories/transactions');
const { ProductRepository } = require('../../repositories/products');

/**
 * Cart Service
 * Contains business logic for shopping cart operations
 */
class CartService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderDetailRepository = new OrderDetailRepository();
    this.shippingOrderRepository = new ShippingOrderRepository();
    this.productRepository = new ProductRepository();
  }

  /**
   * Get user cart
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getUserCart(userId) {
    // Get or create active cart
    let cart = await this.orderRepository.getActiveCartByUser(userId);

    if (!cart) {
      throw new Error('Your cart is empty');
    }

    // Get cart details
    const cartDetails = await this.orderDetailRepository.getCartDetails(cart.order_number);

    // Group by sub_order_number (store)
    const groupedCart = this._groupCartByStore(cartDetails);

    // Get cart summary
    const summary = await this.orderDetailRepository.getCartSummary(cart.order_number);

    return {
      ...summary,
      order_detail: groupedCart,
    };
  }

  /**
   * Add item to cart
   * @param {Object} itemData
   * @returns {Promise<Object>}
   */
  async addToCart(itemData) {
    const { userId, productId, qty, storeId } = itemData;

    // Check if product exists and has sufficient stock
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < qty) {
      throw new Error('Insufficient stock');
    }

    // Get or create active cart
    let cart = await this.orderRepository.getActiveCartByUser(userId);

    if (!cart) {
      const orderNumber = orderid.generate();
      cart = await this.orderRepository.create({
        user_id: userId,
        order_number: orderNumber,
        order_status_id: 1,
      });
    }

    // Generate sub_order_number for store
    const subOrderNumber = `${cart.order_number}-${storeId}`;

    // Check if item already in cart
    const existingItem = await this.orderDetailRepository.findBySubOrderAndProduct(
      subOrderNumber,
      productId
    );

    if (existingItem) {
      // Update quantity
      const newQty = existingItem.qty + qty;
      if (product.stock < newQty) {
        throw new Error('Insufficient stock');
      }

      await this.orderDetailRepository.update(existingItem.id, { qty: newQty });
    } else {
      // Add new item
      await this.orderDetailRepository.create({
        order_number: cart.order_number,
        sub_order_number: subOrderNumber,
        product_id: productId,
        store_id: storeId,
        qty,
        price_each: product.sale_price || product.regular_price,
        weight_each: product.weight,
      });
    }

    return { message: 'Item added to cart successfully' };
  }

  /**
   * Update cart item quantity
   * @param {number} itemId
   * @param {number} qty
   * @returns {Promise<void>}
   */
  async updateCartItem(itemId, qty) {
    const item = await this.orderDetailRepository.findById(itemId);

    if (!item) {
      throw new Error('Cart item not found');
    }

    // Check stock
    const product = await this.productRepository.findById(item.product_id);
    if (product.stock < qty) {
      throw new Error('Insufficient stock');
    }

    await this.orderDetailRepository.update(itemId, { qty });
  }

  /**
   * Remove item from cart
   * @param {number} itemId
   * @returns {Promise<void>}
   */
  async removeFromCart(itemId) {
    const item = await this.orderDetailRepository.findById(itemId);

    if (!item) {
      throw new Error('Cart item not found');
    }

    await this.orderDetailRepository.delete(itemId);
  }

  /**
   * Clear entire cart
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async clearCart(userId) {
    const cart = await this.orderRepository.getActiveCartByUser(userId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    await this.orderDetailRepository.deleteByOrderNumber(cart.order_number);
    await this.shippingOrderRepository.deleteByOrderNumber(cart.order_number);
    await this.orderRepository.delete(cart.id);
  }

  /**
   * Group cart items by store
   * @private
   */
  _groupCartByStore(cartDetails) {
    const grouped = cartDetails.reduce((acc, item) => {
      const key = item.sub_order_number;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const result = [];
    Object.keys(grouped).forEach((subOrderNumber) => {
      const items = grouped[subOrderNumber];
      const products = [];
      let totalPrice = 0;
      let totalQty = 0;
      let totalWeight = 0;

      items.forEach((item) => {
        const product = JSON.parse(item.products);
        products.push(product);
        totalPrice += item.total_price;
        totalQty += item.qty;
        totalWeight += item.total_weight;
      });

      result.push({
        sub_order_number: items[0].sub_order_number,
        store_id: items[0].store_id,
        store_name: items[0].store_name,
        origin_subdistrict_id: items[0].subdistrict_id,
        origin_details: items[0].origin_details,
        products,
        total_price_per_store: totalPrice,
        total_qty_per_store: totalQty,
        total_weight_per_store: totalWeight,
      });
    });

    return result;
  }
}

module.exports = CartService;
