const { ShippingOrderRepository } = require('../../repositories/transactions');

/**
 * Shipping Service
 * Contains business logic for shipping operations
 */
class ShippingService {
  constructor() {
    this.shippingOrderRepository = new ShippingOrderRepository();
  }

  /**
   * Add shipping information to order
   * @param {Object} shippingData
   * @returns {Promise<Object>}
   */
  async addShipping(shippingData) {
    const {
      orderNumber,
      subOrderNumber,
      recipientName,
      recipientPhone,
      originSubdistrictId,
      originDetails,
      destinationSubdistrictId,
      destinationDetails,
      address,
      courier,
      deliveryService,
      deliveryFee,
      totalWeight,
    } = shippingData;

    return this.shippingOrderRepository.create({
      order_number: orderNumber,
      sub_order_number: subOrderNumber,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      origin_subdistrict_id: originSubdistrictId,
      origin_details: originDetails,
      destination_subdistrict_id: destinationSubdistrictId,
      destination_details: destinationDetails,
      address,
      courier,
      delivery_service: deliveryService,
      delivery_fee: deliveryFee,
      total_weight: totalWeight,
    });
  }

  /**
   * Update shipping information
   * @param {number} shippingId
   * @param {Object} shippingData
   * @returns {Promise<void>}
   */
  async updateShipping(shippingId, shippingData) {
    const shipping = await this.shippingOrderRepository.findById(shippingId);

    if (!shipping) {
      throw new Error('Shipping information not found');
    }

    await this.shippingOrderRepository.update(shippingId, shippingData);
  }

  /**
   * Get shipping by sub-order number
   * @param {string} subOrderNumber
   * @returns {Promise<Object>}
   */
  async getShippingBySubOrder(subOrderNumber) {
    const shipping = await this.shippingOrderRepository.getShippingBySubOrder(subOrderNumber);

    if (!shipping) {
      throw new Error('Shipping information not found');
    }

    return shipping;
  }

  /**
   * Delete shipping information
   * @param {number} shippingId
   * @returns {Promise<void>}
   */
  async deleteShipping(shippingId) {
    const shipping = await this.shippingOrderRepository.findById(shippingId);

    if (!shipping) {
      throw new Error('Shipping information not found');
    }

    await this.shippingOrderRepository.delete(shippingId);
  }

  /**
   * Calculate shipping cost (placeholder - integrate with Raja Ongkir API)
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async calculateShippingCost(params) {
    const { origin, destination, weight, courier } = params;

    // TODO: Integrate with Raja Ongkir API or other shipping provider
    // For now, return mock data
    return {
      origin,
      destination,
      weight,
      courier,
      costs: [],
    };
  }
}

module.exports = ShippingService;
