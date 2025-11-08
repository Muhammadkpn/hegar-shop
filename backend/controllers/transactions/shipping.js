/* eslint-disable no-await-in-loop */
const { ShippingService } = require('../../services/transactions');
const database = require('../../database');
const { asyncQuery } = require('../../helpers');

const shippingService = new ShippingService();

/**
 * Shipping Controller - Clean Architecture
 * Manages shipping operations, RajaOngkir API integration, and courier management
 */

module.exports = {
  /**
   * Get provinces from RajaOngkir API
   */
  getProvince: async (req, res) => {
    const { id } = req.query;

    try {
      const results = await shippingService.getProvince(id || null);

      res.status(200).send({
        status: 'success',
        message: '',
        data: results,
      });
    } catch (error) {
      console.error('getProvince error:', error);
      const statusCode = error.message === 'Province not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },
  /**
   * Get cities from RajaOngkir API
   */
  getCity: async (req, res) => {
    const { cityId, provinceId } = req.query;

    try {
      const results = await shippingService.getCity(provinceId || null, cityId || null);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: results,
      });
    } catch (error) {
      console.error('getCity error:', error);
      const statusCode = error.message === 'City not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'City not found'
          ? 'Your request to get Province or City not found'
          : error.message,
      });
    }
  },
  /**
   * Get subdistricts from RajaOngkir API
   */
  getSubdistrict: async (req, res) => {
    const { cityId, subdistrictId } = req.query;

    try {
      const results = await shippingService.getSubdistrict(cityId || null, subdistrictId || null);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: results,
      });
    } catch (error) {
      console.error('getSubdistrict error:', error);
      const statusCode = error.message === 'Subdistrict not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Subdistrict not found'
          ? 'Your request to get Subdistrict not found'
          : error.message,
      });
    }
  },
  /**
   * Check delivery fee for multiple stores
   * Complex orchestration endpoint that checks fees for multiple stores at once
   */
  checkDeliveryFee: async (req, res) => {
    const {
      storeOriginType, destination, destinationType, store,
    } = req.body;

    try {
      // Validation
      if (!Array.isArray(store)) {
        res.status(422).send({
          status: 'fail',
          code: 422,
          message: 'Store data format must array',
        });
        return;
      }

      if (!storeOriginType || !destination || !destinationType) {
        res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'storeOriginType, destination, and destinationType is required',
        });
        return;
      }

      for (let i = 0; i < store.length; i += 1) {
        const checkOriginId = Object.prototype.hasOwnProperty.call(store[i], 'originId');
        const checkStoreId = Object.prototype.hasOwnProperty.call(store[i], 'storeId');
        if (!checkOriginId || !checkStoreId) {
          res.status(422).send({
            status: 'fail',
            code: 422,
            message: 'Variable store must be an array of object formats that contain property storeId and originId.',
          });
          return;
        }
      }

      const finalResult = [];
      for (let i = 0; i < store.length; i += 1) {
        // Check store in database
        const checkStore = `SELECT * FROM stores WHERE user_id = ${database.escape(store[i].storeId)}`;
        const getCheckStore = await asyncQuery(checkStore);

        if (getCheckStore.length === 0) {
          res.status(404).send({
            status: 'fail',
            code: 404,
            message: 'Store not found',
          });
          return;
        }

        // Get courier settings for store using service
        const getCheckCourier = await shippingService.getStoreCourier(store[i].storeId);

        if (getCheckCourier.length === 0) {
          res.status(404).send({
            status: 'fail',
            code: 404,
            message: "This store hasn't chosen a courier",
          });
          return;
        }

        let kurir = '';
        getCheckCourier.forEach((value) => {
          kurir += `${value.courier}:`;
        });

        // Check delivery fee using service
        const costResults = await shippingService.checkDeliveryFee({
          origin: store[i].originId,
          destination,
          weight: store[i].weight,
          courier: kurir.slice(0, -1),
        });

        // Add courier_id to results
        costResults.forEach((courierResult) => {
          if (courierResult.costs) {
            const filterCourier = getCheckCourier.filter(
              (val) => val.courier === courierResult.code || val.courier === 'jnt',
            );
            if (filterCourier.length > 0) {
              courierResult.courier_id = filterCourier[0].courier_id;
            }
          }
        });

        // Get postcode from database
        const postcode = `SELECT * FROM store_address WHERE id = ${database.escape(getCheckStore[0].main_address_id)}`;
        const getPostcode = await asyncQuery(postcode);

        finalResult.push({
          store_id: store[i].storeId,
          store_name: getCheckStore[0].store_name,
          sub_order_number: store[i].sub_order_number,
          origin_details: {
            postcode: getPostcode[0].postcode,
          },
          courier: costResults,
        });
      }

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: finalResult,
      });
    } catch (error) {
      console.error('checkDeliveryFee error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },
  /**
   * Get all admin couriers with optional search
   * Note: Search functionality kept in controller until service is updated
   */
  getAdminCourier: async (req, res) => {
    const { search } = req.query;

    try {
      let courier = 'SELECT * FROM admin_courier';

      if (Object.prototype.hasOwnProperty.call(req.query, 'search')) {
        courier += ` WHERE code LIKE '%${search}%' OR name LIKE '%${search}%'`;
      }

      const getCourier = await asyncQuery(courier);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: getCourier,
      });
    } catch (error) {
      console.error('getAdminCourier error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get admin courier by ID
   */
  getAdminCourierById: async (req, res) => {
    const { id } = req.params;

    try {
      const courier = `SELECT * FROM admin_courier WHERE id = ${database.escape(id)}`;
      const getCourierById = await asyncQuery(courier);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: getCourierById,
      });
    } catch (error) {
      console.error('getAdminCourierById error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add new admin courier
   */
  addAdminCourier: async (req, res) => {
    const { name, code } = req.body;

    try {
      // Check courier in database
      const checkCourier = `SELECT * FROM admin_courier WHERE name = ${database.escape(name)} OR code = ${database.escape(code)}`;
      const getCheckCourier = await asyncQuery(checkCourier);

      if (getCheckCourier.length > 0) {
        res.status(422).send({
          status: 'fail',
          code: 422,
          message: `Courier with name = ${name} already exists in our database`,
        });
        return;
      }

      // Add courier
      const addCourier = `INSERT INTO admin_courier (name, code) VALUES (${database.escape(name)}, ${database.escape(code)})`;
      await asyncQuery(addCourier);

      res.status(200).send({
        status: 'success',
        message: "You've successful add a new courier to our database",
      });
    } catch (error) {
      console.error('addAdminCourier error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit admin courier
   */
  editAdminCourier: async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    try {
      const checkCourier = `SELECT * FROM admin_courier WHERE id = ${database.escape(id)}`;
      const getCheckCourier = await asyncQuery(checkCourier);

      if (getCheckCourier.length === 0) {
        res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'Courier not found',
        });
        return;
      }

      // Edit courier
      const editCourier = `UPDATE admin_courier SET name = ${database.escape(name)}, code = ${database.escape(code)} WHERE id = ${database.escape(id)}`;
      await asyncQuery(editCourier);

      res.status(200).send({
        status: 'success',
        message: 'Edit courier has been successful',
      });
    } catch (error) {
      console.error('editAdminCourier error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Delete admin courier
   */
  deleteAdminCourier: async (req, res) => {
    const { id } = req.params;

    try {
      const checkCourier = `SELECT * FROM admin_courier WHERE id = ${database.escape(id)}`;
      const getCheckCourier = await asyncQuery(checkCourier);

      if (getCheckCourier.length === 0) {
        res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'Courier not found',
        });
        return;
      }

      // Delete courier
      const deleteCourier = `DELETE FROM admin_courier WHERE id = ${database.escape(id)}`;
      await asyncQuery(deleteCourier);

      res.status(200).send({
        status: 'success',
        message: 'Delete courier has been successful',
      });
    } catch (error) {
      console.error('deleteAdminCourier error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },
  /**
   * Get store courier settings with optional search
   * Note: Search functionality kept in controller until service is updated
   */
  getStoreCourier: async (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    try {
      let storeCourier = `SELECT * FROM store_courier sc
                          JOIN admin_courier ac ON sc.courier_id = ac.id
                          WHERE store_id = ${database.escape(id)}`;
      if (Object.prototype.hasOwnProperty.call(req.query, 'search')) {
        storeCourier += ` AND (ac.code LIKE '%${search}%' OR ac.name LIKE '%${search}%')`;
      }
      const getStoreCourier = await asyncQuery(storeCourier);

      getStoreCourier.forEach((item, index) => {
        delete getStoreCourier[index].id;
      });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: getStoreCourier,
      });
    } catch (error) {
      console.error('getStoreCourier error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit store courier settings
   */
  editStoreCourier: async (req, res) => {
    const { id } = req.params;
    const { courierId } = req.body;

    try {
      // Validate input
      if (!Array.isArray(courierId) || courierId.length === 0) {
        res.status(403).send({
          status: 'fail',
          code: 403,
          message: 'Your input not found',
        });
        return;
      }

      // Check for duplicates
      const checkDuplicate = [...new Set(courierId)];
      if (checkDuplicate.length !== courierId.length) {
        res.status(403).send({
          status: 'fail',
          code: 403,
          message: 'Your input has duplicate',
        });
        return;
      }

      // Use service to edit store couriers
      await shippingService.editStoreCourier(id, courierId);

      res.status(200).send({
        status: 'success',
        message: 'You have been successful to add a new courier',
      });
    } catch (error) {
      console.error('editStoreCourier error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },
};
