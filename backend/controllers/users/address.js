const { AddressService } = require('../../services/users');

const addressService = new AddressService();

/**
 * Address Controller - Clean Architecture
 * Manages user and store addresses
 */

module.exports = {
  /**
   * Get main address
   */
  getMainAddress: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await addressService.getMainAddress(id);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: result,
      });
    } catch (error) {
      console.error('getMainAddress error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get address
   */
  getAddress: async (req, res) => {
    const { id } = req.params;
    const { type, filter } = req.query;

    try {
      const result = await addressService.getAddress(id, type, filter);

      res.status(200).send({
        status: 'success',
        data: type === 'user-id' || type === 'store-address' || type === 'filter-address' ? result : result,
      });
    } catch (error) {
      console.error('getAddress error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add address
   */
  addAddress: async (req, res) => {
    const {
      userId, recipientName, recipientPhone, province, provinceId, city,
      cityId, subdistrict, subdistrictId, postcode, address,
    } = req.body;

    try {
      await addressService.addAddress({
        userId,
        recipientName,
        recipientPhone,
        province,
        provinceId,
        city,
        cityId,
        subdistrict,
        subdistrictId,
        postcode,
        address,
      });

      res.status(200).send({
        status: 'success',
        message: 'Add address has been successfully',
      });
    } catch (error) {
      console.error('addAddress error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit address
   */
  editAddress: async (req, res) => {
    const { id } = req.params;

    try {
      await addressService.editAddress(id, req.body);

      res.status(200).send({
        status: 'success',
        message: 'Edit address has been successfully',
      });
    } catch (error) {
      console.error('editAddress error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete address
   */
  deleteAddress: async (req, res) => {
    const { id } = req.params;

    try {
      await addressService.deleteAddress(id);

      res.status(200).send({
        status: 'success',
        message: 'Your address has been deleted',
      });
    } catch (error) {
      console.error('deleteAddress error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Get store address
   */
  getStoreAddress: async (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    try {
      const result = await addressService.getStoreAddress(id, search);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: result,
      });
    } catch (error) {
      console.error('getStoreAddress error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add store address
   */
  addStoreAddress: async (req, res) => {
    const {
      userId, recipientName, recipientPhone, province, provinceId, city,
      cityId, subdistrict, subdistrictId, postcode, address,
    } = req.body;

    try {
      await addressService.addStoreAddress({
        userId,
        recipientName,
        recipientPhone,
        province,
        provinceId,
        city,
        cityId,
        subdistrict,
        subdistrictId,
        postcode,
        address,
      });

      res.status(200).send({
        status: 'success',
        message: 'Add address has been successfully',
      });
    } catch (error) {
      console.error('addStoreAddress error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit store address
   */
  editStoreAddress: async (req, res) => {
    const { id } = req.params;

    try {
      await addressService.editStoreAddress(id, req.body);

      res.status(200).send({
        status: 'success',
        message: 'Edit store address has been successfully',
      });
    } catch (error) {
      console.error('editStoreAddress error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete store address
   */
  deleteStoreAddress: async (req, res) => {
    const { id } = req.params;

    try {
      await addressService.deleteStoreAddress(id);

      res.status(200).send({
        status: 'success',
        message: 'Your address has been deleted',
      });
    } catch (error) {
      console.error('deleteStoreAddress error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },
};
