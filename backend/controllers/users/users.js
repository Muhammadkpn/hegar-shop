const { validationResult } = require('express-validator');
const { getImageUrl } = require('../../helpers/queryHelper');
const { getPaginationParams, createPaginatedResponse } = require('../../helpers/pagination');
const { UserService } = require('../../services/users');

const userService = new UserService();

/**
 * Users Controller - Clean Architecture
 * Request → Router → Validator → Controller → Service → Repository → Database
 *
 * Controller responsibilities:
 * - Handle HTTP request/response
 * - Validate input
 * - Format response
 * - Error handling
 */

module.exports = {
  /**
   * Get users list with pagination
   */
  getUser: async (req, res) => {
    const {
      type, _sort, _order, name, emailStatus, userStatus,
    } = req.query;
    const { page, limit } = getPaginationParams(req);

    try {
      // Validate sort field
      const allowedSortFields = ['username', 'email', 'reg_date'];
      const sortField = allowedSortFields.includes(_sort) ? _sort : 'u.id';
      const sortOrder = _order && _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // Call service
      const result = await userService.getUsers(
        { type, name, emailStatus, userStatus, sortField, sortOrder },
        { page, limit }
      );

      // Convert user images to full URLs
      result.data.forEach((item, index) => {
        if (item.image) {
          result.data[index].image = getImageUrl(item.image, req);
        }
      });

      res.status(200).send(createPaginatedResponse(
        result.data,
        result.total,
        page,
        limit,
        'Users retrieved successfully'
      ));
    } catch (error) {
      console.error('getUser error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await userService.getUserById(id);

      // Convert user image to full URL
      if (user.image) {
        user.image = getImageUrl(user.image, req);
      }

      res.status(200).send({
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      console.error('getUserById error:', error);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Register new user
   */
  register: async (req, res) => {
    const {
      username, password, email, roleId,
    } = req.body;
    const errorValidator = validationResult(req);

    // Validate input
    if (!errorValidator.isEmpty()) {
      return res.status(422).send({
        status: 'fail',
        code: 422,
        message: { errors: errorValidator.array()[0].msg },
      });
    }

    try {
      const result = await userService.registerUser({
        username,
        password,
        email,
        roleId,
      });

      res.status(200).send({
        status: 'success',
        message: 'Registration successful. Please check your email for verification.',
        data: result,
      });
    } catch (error) {
      console.error('register error:', error);
      const statusCode = error.message === 'Username or email already used' ? 422 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: { errors: error.message },
      });
    }
  },

  /**
   * User login
   */
  login: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const user = await userService.login({ username, email, password });

      res.status(200).send({
        status: 'success',
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      console.error('login error:', error);
      let statusCode = 500;
      if (error.message === 'Username or email is required' ||
          error.message === 'Invalid credentials') {
        statusCode = 400;
      } else if (error.message.includes('inactive')) {
        statusCode = 403;
      }

      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Send password reset email
   */
  sendEmailResetPassword: async (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(422).send({
        status: 'fail',
        code: 422,
        message: 'Email is required',
      });
    }

    const regexEmail = /^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/;
    if (!regexEmail.test(email)) {
      return res.status(422).send({
        status: 'fail',
        code: 422,
        message: 'Invalid email format',
      });
    }

    try {
      const result = await userService.sendPasswordResetEmail(email);

      res.status(200).send({
        status: 'success',
        message: 'Password reset email sent. Please check your inbox.',
        data: result,
      });
    } catch (error) {
      console.error('sendEmailResetPassword error:', error);
      const statusCode = error.message === 'Email not found in our database' ? 422 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Reset password
   */
  editResetPassword: async (req, res) => {
    const { email, password } = req.body;
    const errorValidator = validationResult(req);

    // Validate input
    if (!errorValidator.isEmpty()) {
      return res.status(422).send({
        status: 'fail',
        code: 422,
        message: errorValidator.array()[0].msg,
      });
    }

    try {
      await userService.resetPassword(email, password);

      res.status(200).send({
        status: 'success',
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      console.error('editResetPassword error:', error);
      const statusCode = error.message === 'Email not found in our database' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Check reset password token expiration
   */
  checkExpiredResetPassword: async (req, res) => {
    const { iat, exp } = req.data;

    try {
      const user = await userService.getUserById(req.data.id);

      const createdDate = new Date(iat * 1000);
      const expiredDate = new Date(exp * 1000);

      res.status(200).send({
        status: 'success',
        message: 'Token is valid',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          dataToken: { token: req.token, createdDate, expiredDate },
        },
      });
    } catch (error) {
      console.error('checkExpiredResetPassword error:', error);
      const statusCode = error.message === 'Email not found' ? 422 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Email verification
   */
  emailVerification: async (req, res) => {
    try {
      await userService.verifyEmail(req.data.id, req.data.username);

      res.status(200).send({
        status: 'success',
        message: 'Email has been verified successfully',
        data: { ...req.data },
      });
    } catch (error) {
      console.error('emailVerification error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Keep login (verify token)
   */
  keepLogin: async (req, res) => {
    const { iat, exp } = req.data;

    try {
      const user = await userService.keepLogin(req.data.id);

      const createdDate = new Date(iat * 1000);
      const expiredDate = new Date(exp * 1000);

      res.status(200).send({
        status: 'success',
        message: 'Session is valid',
        data: {
          ...user,
          dataToken: { token: req.token, createdDate, expiredDate },
        },
      });
    } catch (error) {
      console.error('keepLogin error:', error);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit user
   */
  editUser: async (req, res) => {
    const { id } = req.params;

    try {
      await userService.updateUser(id, req.body);

      res.status(200).send({
        status: 'success',
        message: 'User updated successfully',
      });
    } catch (error) {
      console.error('editUser error:', error);
      const statusCode = error.message.includes("doesn't exist") ? 400 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Change password
   */
  editPassword: async (req, res) => {
    const { id } = req.params;
    const { password, newPassword } = req.body;
    const errorValidator = validationResult(req);

    // Validate input
    if (!errorValidator.isEmpty()) {
      return res.status(422).send({
        status: 'fail',
        code: 422,
        message: errorValidator.array()[0].msg,
      });
    }

    try {
      await userService.changePassword(id, password, newPassword);

      res.status(200).send({
        status: 'success',
        message: 'Password has been changed successfully',
      });
    } catch (error) {
      console.error('editPassword error:', error);
      let statusCode = 500;
      if (error.message === 'User not found') statusCode = 404;
      if (error.message === 'Current password is incorrect') statusCode = 422;

      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Register as store owner
   */
  registerStore: async (req, res) => {
    const { id } = req.params;
    const { roleId } = req.body;

    try {
      const result = await userService.registerStore(id, roleId);

      res.status(200).send({
        status: 'success',
        message: 'Congratulations! You are now registered as a seller.',
        data: result,
      });
    } catch (error) {
      console.error('registerStore error:', error);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },
};
