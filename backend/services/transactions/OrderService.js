const { today } = require('../../helpers/queryHelper');
const {
  OrderRepository,
  OrderDetailRepository,
  ShippingOrderRepository,
  OrderStatusRepository,
} = require('../../repositories/transactions');

/**
 * Order Service
 * Contains business logic for order operations
 */
class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderDetailRepository = new OrderDetailRepository();
    this.shippingOrderRepository = new ShippingOrderRepository();
    this.orderStatusRepository = new OrderStatusRepository();
  }

  /**
   * Get order history with filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getOrderHistory(filters) {
    const orders = await this.orderRepository.getOrdersWithDetails(filters);

    // Get totals
    const { ongkir, price } = await this.orderRepository.getOrderTotals();

    // Process and merge data
    orders.forEach((order, index) => {
      // Add ongkir totals
      const orderOngkir = ongkir.find((o) => o.order_number === order.order_number);
      if (orderOngkir) {
        orders[index].total_ongkir = orderOngkir.total_ongkir;
        orders[index].total_weight = orderOngkir.total_weight;
      } else {
        orders[index].total_ongkir = 0;
        orders[index].total_weight = 0;
      }

      // Add price totals
      const orderPrice = price.find((p) => p.order_number === order.order_number);
      if (orderPrice) {
        orders[index].total_price = orderPrice.total_price;
        orders[index].total_qty = orderPrice.total_qty;
      }

      // Parse recipient address
      if (order.recipient_address) {
        try {
          orders[index].recipient_address = JSON.parse(order.recipient_address);
        } catch (error) {
          orders[index].recipient_address = null;
        }
      }
    });

    return orders;
  }

  /**
   * Get order details by order number
   * @param {string} orderNumber
   * @returns {Promise<Object>}
   */
  async getOrderDetails(orderNumber) {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new Error('Order not found');
    }

    const details = await this.orderDetailRepository.getDetailsWithProducts(orderNumber);
    const shipping = await this.shippingOrderRepository.getShippingByOrderNumber(orderNumber);

    return {
      order,
      details,
      shipping,
    };
  }

  /**
   * Create new order
   * @param {Object} orderData
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    const { userId, orderNumber, orderStatusId = 1 } = orderData;

    return this.orderRepository.create({
      user_id: userId,
      order_number: orderNumber,
      order_status_id: orderStatusId,
      checkout_date: today,
    });
  }

  /**
   * Update order status
   * @param {string} orderNumber
   * @param {number} statusId
   * @param {Object} additionalData
   * @returns {Promise<void>}
   */
  async updateOrderStatus(orderNumber, statusId, additionalData = {}) {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new Error('Order not found');
    }

    const updateData = { order_status_id: statusId };

    // Add timestamp based on status
    if (statusId === 2) {
      updateData.checkout_date = today;
    } else if (statusId === 3) {
      updateData.upload_receipt_date = today;
    } else if (statusId === 4) {
      updateData.send_date = today;
    } else if (statusId === 5) {
      updateData.done_date = today;
    }

    // Add additional data (e.g., receipt_image)
    Object.assign(updateData, additionalData);

    await this.orderRepository.updateWhere({ order_number: orderNumber }, updateData);
  }

  /**
   * Cancel order
   * @param {string} orderNumber
   * @returns {Promise<void>}
   */
  async cancelOrder(orderNumber) {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new Error('Order not found');
    }

    // Delete order details and shipping
    await this.orderDetailRepository.deleteByOrderNumber(orderNumber);
    await this.shippingOrderRepository.deleteByOrderNumber(orderNumber);

    // Delete order
    await this.orderRepository.deleteWhere({ order_number: orderNumber });
  }

  /**
   * Get all order statuses
   * @returns {Promise<Array>}
   */
  async getOrderStatuses() {
    return this.orderStatusRepository.getAllStatuses();
  }
}

module.exports = OrderService;
