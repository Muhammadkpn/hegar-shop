/**
 * Users Module Repositories
 * Centralized export for all user-related repositories
 */

const UserRepository = require('./UserRepository');
const UserKtpRepository = require('./UserKtpRepository');
const UserAddressRepository = require('./UserAddressRepository');
const StoreRepository = require('./StoreRepository');
const StoreAddressRepository = require('./StoreAddressRepository');
const UserBankAccountRepository = require('./UserBankAccountRepository');
const WishlistRepository = require('./WishlistRepository');
const SubscribeRepository = require('./SubscribeRepository');

module.exports = {
  UserRepository,
  UserKtpRepository,
  UserAddressRepository,
  StoreRepository,
  StoreAddressRepository,
  UserBankAccountRepository,
  WishlistRepository,
  SubscribeRepository,
};
