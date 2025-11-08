const {
  UserKtpRepository,
  UserBankAccountRepository,
  StoreRepository,
} = require('../../repositories/users');

/**
 * Profile Service
 * Contains business logic for user profile operations
 */
class ProfileService {
  constructor() {
    this.userKtpRepository = new UserKtpRepository();
    this.userBankAccountRepository = new UserBankAccountRepository();
    this.storeRepository = new StoreRepository();
  }

  /**
   * Get store by user ID
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getStore(userId) {
    const store = await this.storeRepository.getStoreWithBankDetails(userId);

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  }

  /**
   * Edit store
   * @param {number} userId
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async editStore(userId, data) {
    const store = await this.storeRepository.findByUserId(userId);

    if (!store) {
      throw new Error(`Stores with id: ${userId} doesn't exists`);
    }

    await this.storeRepository.updateByUserId(userId, data);
  }

  /**
   * Get all KTP with filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getKtp(filters = {}) {
    return this.userKtpRepository.getKtpWithFilters(filters);
  }

  /**
   * Get KTP by user ID
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async getKtpById(userId) {
    const ktp = await this.userKtpRepository.findByUserId(userId);
    return ktp || {};
  }

  /**
   * Edit KTP
   * @param {number} userId
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async editKtp(userId, data) {
    const ktp = await this.userKtpRepository.findByUserId(userId);

    if (!ktp) {
      throw new Error(`Ktp with user_id : ${userId} doesn't exists`);
    }

    await this.userKtpRepository.updateByUserId(userId, data);
  }

  /**
   * Edit KTP status
   * @param {number} userId
   * @param {number} statusId
   * @returns {Promise<void>}
   */
  async editKtpStatus(userId, statusId) {
    const ktp = await this.userKtpRepository.findByUserId(userId);

    if (!ktp) {
      throw new Error(`Ktp with user_id : ${userId} doesn't exists`);
    }

    await this.userKtpRepository.updateStatus(userId, statusId);
  }

  /**
   * Get all bank accounts with filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getBankAccounts(filters = {}) {
    return this.userBankAccountRepository.getBankAccountsWithFilters(filters);
  }

  /**
   * Get bank accounts by user
   * @param {number} userId
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getBankAccountsByUser(userId, filters = {}) {
    return this.userBankAccountRepository.getBankAccountsByUserWithFilters(userId, filters);
  }

  /**
   * Add bank account
   * @param {Object} bankData
   * @returns {Promise<Object>}
   */
  async addBankAccount(bankData) {
    const { accountNumber } = bankData;

    // Check if account exists
    const existingAccount = await this.userBankAccountRepository.findByAccountNumber(accountNumber);

    if (existingAccount) {
      throw new Error(`Bank Account with account number : ${accountNumber} already exists`);
    }

    const result = await this.userBankAccountRepository.create({
      ...bankData,
      bank_status_id: 2,
    });

    return result;
  }

  /**
   * Edit bank account
   * @param {number} accountId
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async editBankAccount(accountId, data) {
    const account = await this.userBankAccountRepository.findById(accountId);

    if (!account) {
      throw new Error(`Bank Account with id : ${accountId} doesn't exists`);
    }

    await this.userBankAccountRepository.update(accountId, data);
  }

  /**
   * Delete bank account
   * @param {number} accountId
   * @returns {Promise<void>}
   */
  async deleteBankAccount(accountId) {
    const account = await this.userBankAccountRepository.findById(accountId);

    if (!account) {
      throw new Error(`Bank Account with id : ${accountId} doesn't exists`);
    }

    await this.userBankAccountRepository.delete(accountId);
  }

  /**
   * Upload profile image
   * @param {number} userId
   * @param {string} filename
   * @returns {Promise<void>}
   */
  async uploadImageProfile(userId, filename) {
    const { UserRepository } = require('../../repositories/users');
    const userRepository = new UserRepository();
    await userRepository.update(userId, { image: `image/users/${filename}` });
  }

  /**
   * Upload KTP image
   * @param {number} userId
   * @param {string} filename
   * @returns {Promise<void>}
   */
  async uploadKtp(userId, filename) {
    await this.userKtpRepository.updateByUserId(userId, {
      ktp_image: `image/users/ktp/${filename}`,
    });
  }
}

module.exports = ProfileService;
