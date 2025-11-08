const {
  UserAddressRepository,
  StoreAddressRepository,
  UserRepository,
  StoreRepository,
} = require('../../repositories/users');

/**
 * Address Service
 * Contains business logic for address operations
 */
class AddressService {
  constructor() {
    this.userAddressRepository = new UserAddressRepository();
    this.storeAddressRepository = new StoreAddressRepository();
    this.userRepository = new UserRepository();
    this.storeRepository = new StoreRepository();
  }

  /**
   * Get main address
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getMainAddress(userId) {
    const address = await this.userAddressRepository.getMainAddressWithUser(userId);
    return address || {};
  }

  /**
   * Get address
   * @param {number} id
   * @param {string} type
   * @param {string} filter
   * @returns {Promise<Object|Array>}
   */
  async getAddress(id, type, filter) {
    let result;

    if (type === 'user-id') {
      result = await this.userAddressRepository.findByUserId(id);
    } else if (type === 'shipping-address') {
      result = await this.userAddressRepository.getShippingAddress(id);
    } else if (type === 'filter-address') {
      result = await this.userAddressRepository.searchByUserId(id, filter);
    }

    return type === 'user-id' || type === 'filter-address' ? result : result;
  }

  /**
   * Add address
   * @param {Object} addressData
   * @returns {Promise<void>}
   */
  async addAddress(addressData) {
    const { userId } = addressData;

    // Add address
    const newAddress = await this.userAddressRepository.create({
      user_id: userId,
      recipient_name: addressData.recipientName,
      recipient_phone: addressData.recipientPhone,
      province: addressData.province,
      province_id: addressData.provinceId,
      city: addressData.city,
      city_id: addressData.cityId,
      subdistrict: addressData.subdistrict,
      subdistrict_id: addressData.subdistrictId,
      postcode: addressData.postcode,
      address: addressData.address,
    });

    // Set new address as main address
    await this.userRepository.updateMainAddress(userId, newAddress.id);
  }

  /**
   * Edit address
   * @param {number} addressId
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async editAddress(addressId, data) {
    const address = await this.userAddressRepository.findById(addressId);

    if (!address) {
      throw new Error(`Address with id : ${addressId} doesn't exists`);
    }

    await this.userAddressRepository.update(addressId, data);
  }

  /**
   * Delete address
   * @param {number} addressId
   * @returns {Promise<void>}
   */
  async deleteAddress(addressId) {
    const address = await this.userAddressRepository.findById(addressId);

    if (!address) {
      throw new Error(`Address with id : ${addressId} doesn't exists`);
    }

    // Check if the address is main address
    const user = await this.userRepository.findById(address.user_id);

    if (user && user.main_address_id === addressId) {
      await this.userRepository.clearMainAddress(address.user_id);
    }

    // Delete address
    await this.userAddressRepository.delete(addressId);
  }

  /**
   * Get store address
   * @param {number} userId
   * @param {string} search
   * @returns {Promise<Array>}
   */
  async getStoreAddress(userId, search) {
    return this.storeAddressRepository.searchByUserId(userId, search);
  }

  /**
   * Add store address
   * @param {Object} addressData
   * @returns {Promise<void>}
   */
  async addStoreAddress(addressData) {
    const { userId } = addressData;

    // Add address
    const newAddress = await this.storeAddressRepository.create({
      user_id: userId,
      recipient_name: addressData.recipientName,
      recipient_phone: addressData.recipientPhone,
      province: addressData.province,
      province_id: addressData.provinceId,
      city: addressData.city,
      city_id: addressData.cityId,
      subdistrict: addressData.subdistrict,
      subdistrict_id: addressData.subdistrictId,
      postcode: addressData.postcode,
      address: addressData.address,
    });

    // Set new address as main address for store
    await this.storeRepository.updateMainAddress(userId, newAddress.id);
  }

  /**
   * Edit store address
   * @param {number} addressId
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async editStoreAddress(addressId, data) {
    const address = await this.storeAddressRepository.findById(addressId);

    if (!address) {
      throw new Error(`Store address with id : ${addressId} doesn't exists`);
    }

    await this.storeAddressRepository.update(addressId, data);
  }

  /**
   * Delete store address
   * @param {number} addressId
   * @returns {Promise<void>}
   */
  async deleteStoreAddress(addressId) {
    const address = await this.storeAddressRepository.findById(addressId);

    if (!address) {
      throw new Error(`Store address with id : ${addressId} doesn't exists`);
    }

    // Check if the address is main address for store
    const store = await this.storeRepository.findByUserId(address.user_id);

    if (store && store.main_address_id === addressId) {
      await this.storeRepository.clearMainAddress(address.user_id);
    }

    // Delete address
    await this.storeAddressRepository.delete(addressId);
  }
}

module.exports = AddressService;
