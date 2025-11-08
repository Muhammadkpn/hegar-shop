const bcrypt = require('bcrypt');
const { createToken } = require('../../helpers/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../../helpers/emailHelper');
const { today } = require('../../helpers/queryHelper');
const {
  UserRepository,
  UserKtpRepository,
  StoreRepository,
} = require('../../repositories/users');

const SALT_ROUNDS = 10;

/**
 * User Service
 * Contains business logic for user operations
 */
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.userKtpRepository = new UserKtpRepository();
    this.storeRepository = new StoreRepository();
  }

  /**
   * Get users with pagination and filters
   * @param {Object} filters
   * @param {Object} pagination
   * @returns {Promise<Object>}
   */
  async getUsers(filters, pagination) {
    return this.userRepository.getUsersWithDetails(filters, pagination);
  }

  /**
   * Get user by ID
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Remove password from response
    delete user.password;

    return user;
  }

  /**
   * Register new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async registerUser(userData) {
    const { username, password, email, roleId } = userData;

    // Check if user exists
    const existingUser = await this.userRepository.findByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new Error('Username or email already used');
    }

    // Hash password
    const hashPass = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const newUser = await this.userRepository.create({
      username,
      password: hashPass,
      email,
      role_id: roleId,
      user_status_id: 1,
      email_status_id: 2,
      reg_date: today,
    });

    // Create user profile
    await this.userKtpRepository.createForUser(newUser.id);

    // Create verification token
    const token = createToken({ id: newUser.id, username });

    // Send verification email (non-blocking)
    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    return {
      id: newUser.id,
      username,
      email,
      roleId,
      token,
    };
  }

  /**
   * User login
   * @param {Object} credentials
   * @returns {Promise<Object>}
   */
  async login(credentials) {
    const { username, email, password } = credentials;

    // Validate input
    if (!username && !email) {
      throw new Error('Username or email is required');
    }

    // Find user
    let user;
    if (username) {
      user = await this.userRepository.findByUsername(username);
    } else {
      user = await this.userRepository.findByEmail(email);
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is active
    if (user.user_status_id !== 1) {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Create token
    const token = createToken({
      id: user.id,
      username: user.username,
      role_id: user.role_id,
    });

    // Remove password from response
    delete user.password;
    user.token = token;

    return user;
  }

  /**
   * Send password reset email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async sendPasswordResetEmail(email) {
    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email not found in our database');
    }

    // Create reset token
    const token = createToken({ email }, '8h');

    // Send email
    await sendPasswordResetEmail(email, token);

    return { email, token };
  }

  /**
   * Reset password
   * @param {string} email
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  async resetPassword(email, newPassword) {
    // Check if email exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email not found in our database');
    }

    // Hash new password
    const hashPass = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await this.userRepository.updatePasswordByEmail(email, hashPass);
  }

  /**
   * Verify email
   * @param {number} userId
   * @param {string} username
   * @returns {Promise<void>}
   */
  async verifyEmail(userId, username) {
    await this.userRepository.updateEmailStatus(userId, 1);
  }

  /**
   * Keep login (verify token)
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async keepLogin(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Remove password
    delete user.password;

    return user;
  }

  /**
   * Update user
   * @param {number} userId
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async updateUser(userId, data) {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with id: ${userId} doesn't exist`);
    }

    // Update user
    await this.userRepository.update(userId, data);
  }

  /**
   * Change password
   * @param {number} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Get current user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashNewPass = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await this.userRepository.updatePassword(userId, hashNewPass);
  }

  /**
   * Register as store owner
   * @param {number} userId
   * @param {number} roleId
   * @returns {Promise<Object>}
   */
  async registerStore(userId, roleId) {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update role
    await this.userRepository.updateRole(userId, roleId);

    // Add to stores table
    await this.storeRepository.create({ user_id: userId });

    return { role_id: 2 };
  }
}

module.exports = UserService;
