const CryptoJS = require('crypto-js');
const { validationResult } = require('express-validator');
const {
  asyncQuery,
  today,
  getImageUrl,
} = require('../../helpers/queryHelper');
const database = require('../../database');
const { ProfileService } = require('../../services/users');

const profileService = new ProfileService();
const { SECRET_KEY } = process.env;

/**
 * User Profiles Controller - Clean Architecture
 * Manages user profiles, KTP, bank accounts, and balance operations
 */

module.exports = {
  /**
   * Get store by user ID
   */
  getStore: async (req, res) => {
    const { id } = req.params;

    try {
      const store = await profileService.getStore(id);

      res.status(200).send({
        status: 'success',
        data: store,
      });
    } catch (error) {
      console.error('getStore error:', error);
      const statusCode = error.message === 'Store not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Register new store
   * Note: No service method yet, keeping raw query with parameterized statements
   */
  registerStore: async (req, res) => {
    const {
      userId, storeName, mainAddressId, status,
    } = req.body;

    try {
      // Check store name in store tables
      const checkName = 'SELECT * FROM stores WHERE store_name = ?';
      const getCheckName = await asyncQuery(checkName, [storeName]);

      if (getCheckName.length !== 0) {
        return res.status(403).send({
          status: 'fail',
          code: 403,
          message: `Store name = ${storeName} already used. Please change your store name!`,
        });
      }

      const regisStore = 'INSERT INTO stores (user_id, store_name, main_address_id, status) VALUES (?, ?, ?, ?)';
      await asyncQuery(regisStore, [userId, storeName, mainAddressId, status]);

      res.status(200).send({
        status: 'success',
        message: 'Your register store already sucessfully',
      });
    } catch (error) {
      console.error('registerStore error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit store
   */
  editStore: async (req, res) => {
    const { id } = req.params;

    try {
      await profileService.editStore(id, req.body);

      res.status(200).send({
        status: 'success',
        message: `Edit store of user_id: ${id} successfully`,
      });
    } catch (error) {
      console.error('editStore error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Get KTP list with filters
   */
  getKtp: async (req, res) => {
    const { status, search } = req.query;

    try {
      const result = await profileService.getKtp({ status, search });

      // Convert ktp_image to full URLs
      result.forEach((item, index) => {
        if (item.ktp_image) {
          result[index].ktp_image = getImageUrl(item.ktp_image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        data: result,
      });
    } catch (error) {
      console.error('getKtp error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get KTP by user ID
   */
  getKtpById: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await profileService.getKtpById(id);

      // Convert ktp_image to full URL if exists
      if (result.ktp_image) {
        result.ktp_image = getImageUrl(result.ktp_image, req);
      }

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: result,
      });
    } catch (error) {
      console.error('getKtpById error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit KTP
   */
  editKtp: async (req, res) => {
    const { id } = req.params;
    const errorValidator = validationResult(req);

    try {
      // Check input with express validator
      if (!errorValidator.isEmpty()) {
        return res.status(422).send({
          status: 'fail',
          code: 422,
          message: errorValidator.array()[0].msg,
        });
      }

      await profileService.editKtp(id, req.body);

      res.status(200).send({
        status: 'success',
        message: 'KTP updated successfully',
      });
    } catch (error) {
      console.error('editKtp error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit KTP status
   */
  editKtpStatus: async (req, res) => {
    const { id } = req.params;
    const { ktpStatusId } = req.body;

    try {
      await profileService.editKtpStatus(id, ktpStatusId);

      res.status(200).send({
        status: 'success',
        message: 'KTP status updated successfully',
      });
    } catch (error) {
      console.error('editKtpStatus error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Get all bank accounts with filters
   */
  getBankAccount: async (req, res) => {
    const { status, search } = req.query;

    try {
      const result = await profileService.getBankAccounts({ status, search });

      // Convert bank_image to full URLs
      result.forEach((item, index) => {
        if (item.bank_image) {
          result[index].bank_image = getImageUrl(item.bank_image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        data: result,
      });
    } catch (error) {
      console.error('getBankAccount error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get bank accounts by user
   */
  getBankAccountByUser: async (req, res) => {
    const { id } = req.params;
    const { search, status } = req.query;

    try {
      const result = await profileService.getBankAccountsByUser(id, { status, search });

      // Convert bank_image to full URLs
      result.forEach((item, index) => {
        if (item.bank_image) {
          result[index].bank_image = getImageUrl(item.bank_image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        data: result,
      });
    } catch (error) {
      console.error('getBankAccountByUser error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add bank account
   */
  addBankAccount: async (req, res) => {
    const {
      userId, bankName, bankBranch, accountNumber, accountName, bankImage,
    } = req.body;

    try {
      await profileService.addBankAccount({
        user_id: userId,
        bank_name: bankName,
        bank_branch: bankBranch,
        account_number: accountNumber,
        account_name: accountName,
        bank_image: bankImage,
      });

      res.status(200).send({
        status: 'success',
        message: 'Bank account added successfully',
      });
    } catch (error) {
      console.error('addBankAccount error:', error);
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit bank account
   */
  editBankAccount: async (req, res) => {
    const { id } = req.params;

    try {
      await profileService.editBankAccount(id, req.body);

      res.status(200).send({
        status: 'success',
        message: 'Bank account updated successfully',
      });
    } catch (error) {
      console.error('editBankAccount error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete bank account
   */
  deleteBankAccount: async (req, res) => {
    const { id } = req.params;

    try {
      await profileService.deleteBankAccount(id);

      res.status(200).send({
        status: 'success',
        message: 'Bank account deleted successfully',
      });
    } catch (error) {
      console.error('deleteBankAccount error:', error);
      const statusCode = error.message.includes("doesn't exists") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Upload profile image
   */
  uploadImageProfile: async (req, res) => {
    const { id } = req.params;

    if (req.file === undefined) {
      return res.status(400).send({
        status: 'fail',
        code: 400,
        message: 'No image',
      });
    }

    try {
      await profileService.uploadImageProfile(id, req.file.filename);

      res.status(200).send({
        status: 'success',
        message: 'Profile image uploaded successfully',
      });
    } catch (error) {
      console.error('uploadImageProfile error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Upload KTP image
   */
  uploadKtp: async (req, res) => {
    const { id } = req.params;

    if (req.file === undefined) {
      return res.status(400).send({
        status: 'fail',
        code: 400,
        message: 'No image',
      });
    }

    try {
      await profileService.uploadKtp(id, req.file.filename);

      res.status(200).send({
        status: 'success',
        message: 'KTP image uploaded successfully',
      });
    } catch (error) {
      console.error('uploadKtp error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Upload bank account image
   * Note: No service method yet, keeping raw query with parameterized statements
   */
  uploadRekening: async (req, res) => {
    const { id } = req.params;

    if (req.file === undefined) {
      return res.status(400).send({
        status: 'fail',
        code: 400,
        message: 'No image',
      });
    }

    try {
      const query = 'UPDATE user_personal_info SET bank_image = ? WHERE user_id = ?';
      await asyncQuery(query, [`image/profiles/${req.file.filename}`, id]);

      res.status(200).send({
        status: 'success',
        message: 'Your image has been uploaded',
      });
    } catch (error) {
      console.error('uploadRekening error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get updated balance
   * Note: Balance operations not yet in service layer
   */
  getUpdatedBalance: async (req, res) => {
    const { id } = req.params;

    try {
      // Check user
      const checkUser = 'SELECT * FROM user_balance WHERE user_id = ?';
      const getCheckUser = await asyncQuery(checkUser, [id]);

      if (getCheckUser.length === 0) {
        return res.status(422).send({
          status: 'fail',
          code: 422,
          message: 'User not found',
        });
      }

      // Get latest balance
      const updatedBalance = `SELECT id, user_id, MAX(transaction_date) AS transaction_date, SUM(amount) AS balance
                              FROM user_balance
                              WHERE user_id = ? AND status = 1
                              GROUP BY user_id`;
      const getUpdateBalance = await asyncQuery(updatedBalance, [id]);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: getUpdateBalance[0],
      });
    } catch (error) {
      console.error('getUpdatedBalance error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get history balance
   * Note: Balance operations not yet in service layer
   */
  getHistoryBalance: async (req, res) => {
    const { status, startDate, endDate } = req.query;

    try {
      let historyBalance = `SELECT ub.id, ub.user_id, ub.transaction_date, ub.amount, ub.status AS status_id, ubs.status
                            FROM user_balance ub
                            JOIN user_balance_status ubs ON ub.status = ubs.id`;

      const params = [];
      const conditions = [];

      if (startDate && endDate) {
        conditions.push('ub.transaction_date BETWEEN ? AND ?');
        params.push(startDate, endDate);
      }

      if (status) {
        conditions.push('ub.status = ?');
        params.push(status);
      }

      if (conditions.length > 0) {
        historyBalance += ' WHERE ' + conditions.join(' AND ');
      }

      const getHistoryBalance = await asyncQuery(historyBalance, params);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: getHistoryBalance,
      });
    } catch (error) {
      console.error('getHistoryBalance error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get history balance by user
   * Note: Balance operations not yet in service layer
   */
  getHistoryBalanceByUser: async (req, res) => {
    const { id } = req.params;
    const { status, startDate, endDate } = req.query;

    try {
      // Check user
      const checkUser = 'SELECT * FROM user_balance WHERE user_id = ?';
      const getCheckUser = await asyncQuery(checkUser, [id]);

      if (getCheckUser.length === 0) {
        return res.status(422).send({
          status: 'fail',
          code: 422,
          message: 'User not found',
        });
      }

      let historyBalance = `SELECT ub.id, ub.user_id, ub.transaction_date, ub.amount, ub.status AS status_id, ubs.status
                            FROM user_balance ub
                            JOIN user_balance_status ubs ON ub.status = ubs.id
                            WHERE ub.user_id = ?`;

      const params = [id];

      if (startDate && endDate) {
        historyBalance += ' AND ub.transaction_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      if (status) {
        historyBalance += ' AND ub.status = ?';
        params.push(status);
      }

      historyBalance += ' ORDER BY ub.transaction_date DESC';
      const getHistoryBalance = await asyncQuery(historyBalance, params);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: getHistoryBalance,
      });
    } catch (error) {
      console.error('getHistoryBalanceByUser error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Update balance (top up or withdraw)
   * Note: Balance operations not yet in service layer
   */
  updateBalance: async (req, res) => {
    const { amount, password } = req.body;
    const { id } = req.params;

    try {
      // Check password
      const checkPassword = 'SELECT * FROM users WHERE id = ?';
      const getCheckUser = await asyncQuery(checkPassword, [id]);

      if (getCheckUser.length === 0) {
        return res.status(422).send({
          status: 'fail',
          code: 422,
          message: 'User not found',
        });
      }

      const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY);

      if (hashPass.toString() !== getCheckUser[0].password) {
        return res.status(400).send({
          status: 'fail',
          code: 400,
          message: 'Password invalid!',
        });
      }

      // Top up balance
      const topUpBalance = 'INSERT INTO user_balance (user_id, transaction_date, amount, status) VALUES (?, ?, ?, ?)';
      await asyncQuery(topUpBalance, [id, today, amount, 2]);

      res.status(200).send({
        status: 'success',
        message: `${amount > 0 ? 'Top up' : 'Withdraw'} has been successfully`,
      });
    } catch (error) {
      console.error('updateBalance error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit status balance
   * Note: Balance operations not yet in service layer
   */
  editStatusBalance: async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
      const checkBalance = 'SELECT * FROM user_balance WHERE id = ?';
      const getCheckBalance = await asyncQuery(checkBalance, [id]);

      if (getCheckBalance.length === 0) {
        return res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'id not found',
        });
      }

      const editStatus = 'UPDATE user_balance SET status = ? WHERE id = ?';
      await asyncQuery(editStatus, [status, id]);

      res.status(200).send({
        status: 'success',
        message: 'Your status balance has been changed',
      });
    } catch (error) {
      console.error('editStatusBalance error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },
};
