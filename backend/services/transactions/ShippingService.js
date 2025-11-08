const axios = require('axios');
const { ShippingOrderRepository } = require('../../repositories/transactions');

// Configure axios for RajaOngkir API
const rajaOngkirApi = axios.create({
  baseURL: 'https://pro.rajaongkir.com/api',
  headers: {
    key: '50525fc0a4bb8951f084f494acc9ba88',
  },
});

/**
 * Shipping Service
 * Contains business logic for shipping operations, RajaOngkir API, and courier management
 */
class ShippingService {
  constructor() {
    this.shippingOrderRepository = new ShippingOrderRepository();
  }

  /**
   * Get provinces from RajaOngkir API
   * @param {number} provinceId - Optional province ID
   * @returns {Promise<Object|Array>}
   */
  async getProvince(provinceId = null) {
    const response = await rajaOngkirApi.get(`/province${provinceId ? `?id=${provinceId}` : ''}`);
    const { results } = response.data.rajaongkir;

    if (provinceId && results.length === 0) {
      throw new Error('Province not found');
    }

    return results;
  }

  /**
   * Get cities from RajaOngkir API
   * @param {number} provinceId - Optional province ID to filter cities
   * @param {number} cityId - Optional city ID
   * @returns {Promise<Object|Array>}
   */
  async getCity(provinceId = null, cityId = null) {
    let url = '/city';
    const params = [];

    if (cityId) {
      params.push(`id=${cityId}`);
    }
    if (provinceId) {
      params.push(`province=${provinceId}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const response = await rajaOngkirApi.get(url);
    const { results } = response.data.rajaongkir;

    if (cityId && results.length === 0) {
      throw new Error('City not found');
    }

    return results;
  }

  /**
   * Get subdistricts from RajaOngkir API
   * @param {number} cityId - Optional city ID to filter subdistricts
   * @param {number} subdistrictId - Optional subdistrict ID
   * @returns {Promise<Object|Array>}
   */
  async getSubdistrict(cityId = null, subdistrictId = null) {
    let url = '/subdistrict';
    const params = [];

    if (subdistrictId) {
      params.push(`id=${subdistrictId}`);
    }
    if (cityId) {
      params.push(`city=${cityId}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const response = await rajaOngkirApi.get(url);
    const { results } = response.data.rajaongkir;

    if (subdistrictId && results.length === 0) {
      throw new Error('Subdistrict not found');
    }

    return results;
  }

  /**
   * Check delivery fee from RajaOngkir API
   * @param {Object} costParams
   * @returns {Promise<Array>}
   */
  async checkDeliveryFee(costParams) {
    const { origin, destination, weight, courier } = costParams;

    const response = await rajaOngkirApi.post('/cost', new URLSearchParams({
      origin,
      originType: 'subdistrict',
      destination,
      destinationType: 'subdistrict',
      weight,
      courier,
    }));

    return response.data.rajaongkir.results;
  }

  /**
   * Get all admin couriers
   * @returns {Promise<Array>}
   */
  async getAdminCouriers() {
    const query = 'SELECT * FROM admin_courier';
    return this.shippingOrderRepository.rawQuery(query);
  }

  /**
   * Get admin courier by ID
   * @param {number} courierId
   * @returns {Promise<Object>}
   */
  async getAdminCourierById(courierId) {
    const query = 'SELECT * FROM admin_courier WHERE id = ?';
    const result = await this.shippingOrderRepository.rawQuery(query, [courierId]);

    if (result.length === 0) {
      throw new Error('Courier not found');
    }

    return result[0];
  }

  /**
   * Add admin courier
   * @param {string} courierName
   * @returns {Promise<void>}
   */
  async addAdminCourier(courierName) {
    // Check if courier already exists
    const checkQuery = 'SELECT * FROM admin_courier WHERE courier = ?';
    const existing = await this.shippingOrderRepository.rawQuery(checkQuery, [courierName]);

    if (existing.length > 0) {
      throw new Error('Courier already exists');
    }

    const insertQuery = 'INSERT INTO admin_courier (courier) VALUES (?)';
    await this.shippingOrderRepository.rawQuery(insertQuery, [courierName]);
  }

  /**
   * Edit admin courier
   * @param {number} courierId
   * @param {string} courierName
   * @returns {Promise<void>}
   */
  async editAdminCourier(courierId, courierName) {
    // Check if courier exists
    await this.getAdminCourierById(courierId);

    const updateQuery = 'UPDATE admin_courier SET courier = ? WHERE id = ?';
    await this.shippingOrderRepository.rawQuery(updateQuery, [courierName, courierId]);
  }

  /**
   * Delete admin courier
   * @param {number} courierId
   * @returns {Promise<void>}
   */
  async deleteAdminCourier(courierId) {
    // Check if courier exists
    await this.getAdminCourierById(courierId);

    const deleteQuery = 'DELETE FROM admin_courier WHERE id = ?';
    await this.shippingOrderRepository.rawQuery(deleteQuery, [courierId]);
  }

  /**
   * Get store courier settings
   * @param {number} storeId
   * @returns {Promise<Array>}
   */
  async getStoreCourier(storeId) {
    const query = `
      SELECT sc.*, ac.courier
      FROM store_courier sc
      JOIN admin_courier ac ON sc.courier_id = ac.id
      WHERE sc.store_id = ?
    `;
    return this.shippingOrderRepository.rawQuery(query, [storeId]);
  }

  /**
   * Edit store courier settings
   * @param {number} storeId
   * @param {Array<number>} courierIds
   * @returns {Promise<void>}
   */
  async editStoreCourier(storeId, courierIds) {
    // Delete existing courier settings
    const deleteQuery = 'DELETE FROM store_courier WHERE store_id = ?';
    await this.shippingOrderRepository.rawQuery(deleteQuery, [storeId]);

    // Insert new courier settings
    if (courierIds && courierIds.length > 0) {
      const values = courierIds.map((courierId) => [storeId, courierId]);
      const insertQuery = 'INSERT INTO store_courier (store_id, courier_id) VALUES ?';
      await this.shippingOrderRepository.rawQuery(insertQuery, [values]);
    }
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
