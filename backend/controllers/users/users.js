const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const {
    asyncQuery,
    generateUpdateQuery,
    paginatedQuery,
    today,
    getImageUrl,
} = require('../../helpers/queryHelper');
const { getPaginationParams, createPaginatedResponse } = require('../../helpers/pagination');
const { createToken } = require('../../helpers/jwt');
const {
    sendVerificationEmail,
    sendPasswordResetEmail,
} = require('../../helpers/emailHelper');

const SALT_ROUNDS = 10;

/**
 * Users Controller - Optimized & Secured
 * Phase 1: Database Optimization
 * - FIXED: 15+ SQL injection vulnerabilities
 * - Added: Pagination for user lists
 * - Improved: Security for authentication
 * - Enhanced: Error handling
 */

module.exports = {
    /**
     * Get users list with pagination
     * FIXED: SQL injection, Added: Pagination
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

            // Base query
            let baseQuery = `
                SELECT u.id, u.username, u.user_status_id, u.email, u.email_status_id,
                       uk.full_name, u.phone, uk.gender, u.image, ua.city, ua.province,
                       ua.postcode, ua.address, u.role_id
                FROM users u
                LEFT JOIN user_address ua ON u.main_address_id = ua.id
                LEFT JOIN user_ktp uk ON u.id = uk.user_id
            `;

            const params = [];
            const whereClauses = [];

            // Filter by type
            if (type === 'store') {
                whereClauses.push('u.role_id = ?');
                params.push(2);

                if (name) {
                    whereClauses.push('uk.full_name LIKE ?');
                    params.push(`%${name}%`);
                }
            } else if (type === 'admin') {
                whereClauses.push('u.role_id IN (?, ?)');
                params.push(2, 3);

                if (name) {
                    whereClauses.push('(u.username LIKE ? OR u.email LIKE ?)');
                    params.push(`%${name}%`, `%${name}%`);
                }

                if (emailStatus) {
                    whereClauses.push('u.email_status_id = ?');
                    params.push(emailStatus);
                }

                if (userStatus) {
                    whereClauses.push('u.user_status_id = ?');
                    params.push(userStatus);
                }
            }

            if (whereClauses.length > 0) {
                baseQuery += ' WHERE ' + whereClauses.join(' AND ');
            }

            baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

            // Count query
            let countQuery = `
                SELECT COUNT(*) as total
                FROM users u
                LEFT JOIN user_ktp uk ON u.id = uk.user_id
            `;
            if (whereClauses.length > 0) {
                countQuery += ' WHERE ' + whereClauses.join(' AND ');
            }

            // Execute paginated query
            const result = await paginatedQuery(baseQuery, countQuery, params, page, limit);

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
     * FIXED: SQL injection vulnerability
     */
    getUserById: async (req, res) => {
        const { id } = req.params;

        try {
            const query = 'SELECT * FROM users WHERE id = ?';
            const result = await asyncQuery(query, [id]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            // Remove password from response
            delete result[0].password;

            // Convert user image to full URL
            if (result[0].image) {
                result[0].image = getImageUrl(result[0].image, req);
            }

            res.status(200).send({
                status: 'success',
                message: 'User retrieved successfully',
                data: result[0],
            });
        } catch (error) {
            console.error('getUserById error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Register new user
     * FIXED: SQL injection vulnerabilities
     * IMPROVED: Security and validation
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
            // Check if user exists
            const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
            const existingUser = await asyncQuery(checkQuery, [username, email]);

            if (existingUser.length > 0) {
                return res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: { errors: 'Username or email already used' },
                });
            }

            // Hash password with bcrypt
            const hashPass = await bcrypt.hash(password, SALT_ROUNDS);

            // Insert user
            const insertQuery = `
                INSERT INTO users (username, password, email, role_id, user_status_id, email_status_id, reg_date)
                VALUES (?, ?, ?, ?, 1, 2, ?)
            `;
            await asyncQuery(insertQuery, [username, hashPass, email, roleId, today]);

            // Get new user ID
            const getIdQuery = 'SELECT id FROM users WHERE username = ? AND email = ?';
            const newUserResult = await asyncQuery(getIdQuery, [username, email]);
            const newUserId = newUserResult[0].id;

            // Create user profile
            const addProfileQuery = 'INSERT INTO user_ktp (user_id) VALUES (?)';
            await asyncQuery(addProfileQuery, [newUserId]);

            // Create verification token
            const token = createToken({ id: newUserId, username });

            // Send verification email
            try {
                await sendVerificationEmail(email, token);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail registration if email fails
            }

            // Send response
            res.status(200).send({
                status: 'success',
                message: 'Registration successful. Please check your email for verification.',
                data: {
                    id: newUserId,
                    username,
                    email,
                    roleId,
                    token,
                },
            });
        } catch (error) {
            console.error('register error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * User login
     * FIXED: CRITICAL SQL injection vulnerabilities
     * IMPROVED: Security and error messages
     */
    login: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            // Build query based on input (username or email)
            let query = 'SELECT * FROM users WHERE ';
            let params = [];

            if (username && !email) {
                query += 'username = ?';
                params = [username];
            } else if (email && !username) {
                query += 'email = ?';
                params = [email];
            } else if (username && email) {
                query += 'username = ?';
                params = [username];
            } else {
                return res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Username or email is required',
                });
            }

            const result = await asyncQuery(query, params);

            // Check if user exists
            if (result.length === 0) {
                return res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Invalid credentials',
                });
            }

            const user = result[0];

            // Check if account is active
            if (user.user_status_id !== 1) {
                return res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'Account is inactive. Please contact support.',
                });
            }

            // Verify password with bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Invalid credentials',
                });
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

            res.status(200).send({
                status: 'success',
                message: 'Login successful',
                data: user,
            });
        } catch (error) {
            console.error('login error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Send password reset email
     * FIXED: SQL injection vulnerability
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
            // Check if user exists
            const checkQuery = 'SELECT * FROM users WHERE email = ?';
            const result = await asyncQuery(checkQuery, [email]);

            if (result.length === 0) {
                return res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Email not found in our database',
                });
            }

            // Create reset token
            const token = createToken({ email }, '8h');

            // Send email
            try {
                await sendPasswordResetEmail(email, token);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                return res.status(500).send({
                    status: 'fail',
                    code: 500,
                    message: 'Failed to send reset email. Please try again.',
                });
            }

            res.status(200).send({
                status: 'success',
                message: 'Password reset email sent. Please check your inbox.',
                data: { email, token },
            });
        } catch (error) {
            console.error('sendEmailResetPassword error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Reset password
     * FIXED: SQL injection vulnerabilities
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
            // Check if email exists
            const checkQuery = 'SELECT * FROM users WHERE email = ?';
            const result = await asyncQuery(checkQuery, [email]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Email not found in our database',
                });
            }

            // Hash new password with bcrypt
            const hashPass = await bcrypt.hash(password, SALT_ROUNDS);

            // Update password
            const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
            await asyncQuery(updateQuery, [hashPass, email]);

            res.status(200).send({
                status: 'success',
                message: 'Password has been reset successfully',
            });
        } catch (error) {
            console.error('editResetPassword error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Check reset password token expiration
     * FIXED: SQL injection vulnerability
     */
    checkExpiredResetPassword: async (req, res) => {
        const { iat, exp } = req.data;

        try {
            const query = 'SELECT * FROM users WHERE email = ?';
            const result = await asyncQuery(query, [req.data.email]);

            if (result.length === 0) {
                return res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Email not found',
                });
            }

            const createdDate = new Date(iat * 1000);
            const expiredDate = new Date(exp * 1000);

            const { id, username, email } = result[0];

            res.status(200).send({
                status: 'success',
                message: 'Token is valid',
                data: {
                    id,
                    username,
                    email,
                    dataToken: { token: req.token, createdDate, expiredDate },
                },
            });
        } catch (error) {
            console.error('checkExpiredResetPassword error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Email verification
     * FIXED: SQL injection vulnerabilities
     */
    emailVerification: async (req, res) => {
        try {
            const query = 'UPDATE users SET email_status_id = 1 WHERE id = ? AND username = ?';
            await asyncQuery(query, [req.data.id, req.data.username]);

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
     * FIXED: SQL injection vulnerability
     */
    keepLogin: async (req, res) => {
        const { iat, exp } = req.data;

        try {
            const query = 'SELECT * FROM users WHERE id = ?';
            const result = await asyncQuery(query, [req.data.id]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            // Remove password
            delete result[0].password;

            const createdDate = new Date(iat * 1000);
            const expiredDate = new Date(exp * 1000);

            res.status(200).send({
                status: 'success',
                message: 'Session is valid',
                data: {
                    ...result[0],
                    dataToken: { token: req.token, createdDate, expiredDate },
                },
            });
        } catch (error) {
            console.error('keepLogin error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Edit user
     * FIXED: SQL injection vulnerabilities
     * IMPROVED: Using secure generateUpdateQuery
     */
    editUser: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if user exists
            const checkQuery = 'SELECT * FROM users WHERE id = ?';
            const result = await asyncQuery(checkQuery, [id]);

            if (result.length === 0) {
                return res.status(400).send({
                    status: 'fail',
                    code: 422,
                    message: `User with id: ${id} doesn't exist`,
                });
            }

            // Update user
            const { setClause, values } = generateUpdateQuery(req.body);
            const updateQuery = `UPDATE users SET ${setClause} WHERE id = ?`;
            await asyncQuery(updateQuery, [...values, id]);

            res.status(200).send({
                status: 'success',
                message: 'User updated successfully',
            });
        } catch (error) {
            console.error('editUser error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Change password
     * FIXED: SQL injection vulnerabilities
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
            // Get current user
            const checkQuery = 'SELECT * FROM users WHERE id = ?';
            const result = await asyncQuery(checkQuery, [id]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            // Verify current password with bcrypt
            const isPasswordValid = await bcrypt.compare(password, result[0].password);
            if (!isPasswordValid) {
                return res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Current password is incorrect',
                });
            }

            // Hash new password with bcrypt
            const hashNewPass = await bcrypt.hash(newPassword, SALT_ROUNDS);

            // Update password
            const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
            await asyncQuery(updateQuery, [hashNewPass, id]);

            res.status(200).send({
                status: 'success',
                message: 'Password has been changed successfully',
            });
        } catch (error) {
            console.error('editPassword error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Register as store owner
     * FIXED: SQL injection vulnerabilities
     */
    registerStore: async (req, res) => {
        const { id } = req.params;
        const { roleId } = req.body;

        try {
            // Check if user exists
            const checkQuery = 'SELECT * FROM users WHERE id = ?';
            const result = await asyncQuery(checkQuery, [id]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            // Update role
            const updateRoleQuery = 'UPDATE users SET role_id = ? WHERE id = ?';
            await asyncQuery(updateRoleQuery, [roleId, id]);

            // Add to stores table
            const addStoreQuery = 'INSERT INTO stores (user_id) VALUES (?)';
            await asyncQuery(addStoreQuery, [id]);

            res.status(200).send({
                status: 'success',
                message: 'Congratulations! You are now registered as a seller.',
                data: {
                    role_id: 2,
                },
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
};
