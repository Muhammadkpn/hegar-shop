/**
 * Users Module Services
 * Centralized export for all user-related services
 */

const UserService = require('./UserService');
const ProfileService = require('./ProfileService');
const AddressService = require('./AddressService');
const WishlistService = require('./WishlistService');
const SubscribeService = require('./SubscribeService');

module.exports = {
  UserService,
  ProfileService,
  AddressService,
  WishlistService,
  SubscribeService,
};
