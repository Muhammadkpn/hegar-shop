const CryptoJS = require('crypto-js');
const { validationResult } = require('express-validator');
const {
    asyncQuery,
    generateUpdateQuery,
    paginatedQuery,
    today,
} = require('../../helpers/queryHelper');
const { getPaginationParams, createPaginatedResponse } = require('../../helpers/pagination');

const { SECRET_KEY } = process.env;

/**
 * User Profiles Controller - Optimized
 * Phase 1: Fixed SQL injection vulnerabilities
 */

module.exports = {
    getStore: async (req, res) => {
        const { id } = req.params;
        try {
            const query = `
                SELECT s.user_id, s.store_name, s.main_address_id, u.main_bank_id, s.status
                FROM stores s
                JOIN users u ON s.user_id = u.id
                WHERE user_id = ?
            `;
            const result = await asyncQuery(query, [id]);

            if (result.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Store not found',
                });
            }

            res.status(200).send({
                status: 'success',
                data: result[0],
            });
        } catch (error) {
            console.error('getStore error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    registerStore: async (req, res) => {
        const {
            userId, storeName, mainAddressId, status,
        } = req.body;
        try {
            // check store name in store tables
            const checkName = `SELECT * FROM stores WHERE store_name = ${database.escape(storeName)}`;
            const getCheckName = await asyncQuery(checkName);

            if (getCheckName.length !== 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: `Store name = ${storeName} already used. Please change your store name!`,
                });
            }

            const regisStore = `INSERT INTO stores (user_id, store_name, main_address_id, status)
                            VALUES (${database.escape(userId)}, ${database.escape(storeName)}, ${database.escape(mainAddressId)}, ${database.escape(status)});`;
            await asyncQuery(regisStore);

            res.status(200).send({
                status: 'success',
                message: 'Your register store already sucessfully',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editStore: async (req, res) => {
        const { id } = req.params;
        try {
            // check store in store table
            const checkStore = `SELECT * FROM stores WHERE user_id = ${database.escape(id)}`;
            const getCheckStore = await asyncQuery(checkStore);

            if (getCheckStore.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Stores with id: ${id} doesn't exists`,
                });
                return;
            }

            // edit stores
            const editStore = `UPDATE stores SET ${generateQuery(req.body)} WHERE user_id = ${database.escape(id)}`;
            await asyncQuery(editStore);

            res.status(200).send({
                status: 'success',
                message: `Edit store of user_id: ${id} successfully`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getKtp: async (req, res) => {
        const { status, search } = req.query;
        try {
            // get ktp
            let getKtp = 'SELECT * FROM user_ktp';

            // check filter
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'status');
            const checkSearch = Object.prototype.hasOwnProperty.call(req.query, 'search');
            if (checkStatus && checkSearch) {
                getKtp += ` WHERE ktp_status_id = ${database.escape(status)} AND (full_name LIKE '%${search}%' OR ktp_number LIKE '%${search}%')`;
            } else if (checkStatus) {
                getKtp += ` WHERE ktp_status_id = ${database.escape(status)}`;
            } else if (checkSearch) {
                getKtp += ` WHERE full_name LIKE '%${search}%' OR ktp_number LIKE '%${search}%'`;
            }

            const result = await asyncQuery(getKtp);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getKtpById: async (req, res) => {
        const { id } = req.params;
        try {
            // get ktp by id
            const getKtp = `SELECT * FROM user_ktp WHERE user_id = ${database.escape(id)};`;
            const result = await asyncQuery(getKtp);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result.length === 0 ? result : result[0],
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editKtp: async (req, res) => {
        const { id } = req.params;
        const errorValidator = validationResult(req);

        try {
            // check user_id
            const checkId = `SELECT * FROM user_ktp WHERE user_id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            if (resultCheck.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Ktp with user_id : ${id} doesn't exists`,
                });
                return;
            }

            // check input with express validator
            if (!errorValidator.isEmpty()) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: errorValidator.array()[0].msg,
                });
                return;
            }

            // edit user profiles
            const editQuery = `UPDATE user_ktp SET ${generateQuery(req.body)} WHERE user_id = ${database.escape(id)}`;
            const result = await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editKtpStatus: async (req, res) => {
        const { id } = req.params;
        const { ktpStatusId } = req.body;

        try {
            // check user_id
            const checkId = `SELECT * FROM user_ktp WHERE user_id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            if (resultCheck.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Ktp with user_id : ${id} doesn't exists`,
                });
                return;
            }

            // edit user profiles
            const editQuery = `UPDATE user_ktp SET ktp_status_id = ${database.escape(ktpStatusId)} WHERE user_id = ${database.escape(id)}`;
            const result = await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getBankAccount: async (req, res) => {
        const { status, search } = req.query;

        try {
            // get bank data
            let getBank = 'SELECT * FROM user_bank_account';

            // check filter
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'status');
            const checkSearch = Object.prototype.hasOwnProperty.call(req.query, 'search');
            if (checkStatus && checkSearch) {
                getBank += ` WHERE bank_status_id = ${database.escape(status)} AND (bank_name LIKE '%${search}%' OR account_name LIKE '%${search}%' OR account_number LIKE '%${search}%')`;
            } else if (checkStatus) {
                getBank += ` WHERE bank_status_id = ${database.escape(status)}`;
            } else if (checkSearch) {
                getBank += ` WHERE (bank_name LIKE '%${search}%' OR account_name LIKE '%${search}%' OR account_number LIKE '%${search}%')`;
            }

            const result = await asyncQuery(getBank);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getBankAccountByUser: async (req, res) => {
        const { id } = req.params;
        const { search, status } = req.query;

        try {
            // get profile data
            let getBank = `SELECT * FROM user_bank_account WHERE user_id = ${id}`;

            // check filter
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'status');
            const checkSearch = Object.prototype.hasOwnProperty.call(req.query, 'search');
            if (checkStatus && checkSearch) {
                getBank += ` AND bank_status_id = ${database.escape(status)} AND (bank_name LIKE '%${search}%' OR account_name LIKE '%${search}%' OR account_number LIKE '%${search}%')`;
            } else if (checkStatus) {
                getBank += ` AND bank_status_id = ${database.escape(status)}`;
            } else if (checkSearch) {
                getBank += ` AND (bank_name LIKE '%${search}%' OR account_name LIKE '%${search}%' OR account_number LIKE '%${search}%')`;
            }
            const result = await asyncQuery(getBank);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    addBankAccount: async (req, res) => {
        const {
            userId, bankName, bankBranch, accountNumber, accountName, bankImage,
        } = req.body;
        try {
            // check user_id
            const checkId = `SELECT * FROM user_bank_account WHERE account_number = ${accountNumber}`;
            const resultCheck = await asyncQuery(checkId);

            // result of check
            if (resultCheck.length !== 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Bank Account with account number : ${accountNumber} already exists`,
                });
                return;
            }

            // edit user personal info
            const editQuery = `INSERT INTO user_bank_account (user_id, bank_name, bank_branch, account_number, account_name, bank_image, bank_status_id) 
                        VALUES (${database.escape(userId)}, ${database.escape(bankName)}, ${database.escape(bankBranch)}, ${database.escape(accountNumber)}, ${database.escape(accountName)}, ${database.escape(bankImage)}, 2)`;
            const result = await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editBankAccount: async (req, res) => {
        const { id } = req.params;

        try {
            // check user_id
            const checkId = `SELECT * FROM user_bank_account WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            // result of check
            if (resultCheck.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Bank Account with id : ${id} doesn't exists`,
                });
                return;
            }

            // edit user personal info
            const editQuery = `UPDATE user_bank_account SET ${generateQuery(req.body)} WHERE id = ${id}`;
            const result = await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    deleteBankAccount: async (req, res) => {
        const { id } = req.params;
        try {
            // check user_id
            const checkId = `SELECT * FROM user_bank_account WHERE id = ${database.escape(id)}`;
            const resultCheck = await asyncQuery(checkId);

            // result of check
            if (resultCheck.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: `Bank Account with id : ${id} doesn't exists`,
                });
                return;
            }

            // edit user personal info
            const editQuery = `DELETE FROM user_bank_account WHERE id = ${database.escape(id)}`;
            const result = await asyncQuery(editQuery);

            // send response
            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    // user upload foto profil
    uploadImageProfile: async (req, res) => {
        const { id } = req.params;

        // check file upload
        if (req.file === undefined) {
            res.status(400).send({
                status: 'fail',
                code: 400,
                message: 'No image',
            });
            return;
        }

        try {
            const query = `UPDATE users SET image = 'image/users/${req.file.filename}' WHERE id = ${id};`;
            const result = await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    // user upload foto ktp
    uploadKtp: async (req, res) => {
        const { id } = req.params;

        // check file upload
        console.log(req.file);

        if (req.file === undefined) {
            res.status(400).send({
                status: 'fail',
                code: 400,
                message: 'No image',
            });
            return;
        }

        try {
            const query = `UPDATE user_ktp SET ktp_image = 'image/users/ktp/${req.file.filename}' WHERE user_id = ${database.escape(id)};`;
            const result = await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    // user upload foto rekening
    uploadRekening: async (req, res) => {
        const { id } = req.params;

        if (req.file === undefined) {
            res.status(400).send({
                status: 'fail',
                code: 400,
                message: 'No image',
            });
        }

        try {
            const query = `UPDATE user_personal_info SET bank_image = 'image/profiles/${req.file.filename}' WHERE user_id = ${database.escape(id)};`;
            await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message: 'Your image has been uploaded',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getUpdatedBalance: async (req, res) => {
        const { id } = req.params;

        try {
            // check user
            const checkUser = `SELECT * FROM user_balance WHERE user_id = ${database.escape(id)}`;
            const getCheckUser = await asyncQuery(checkUser);

            // result of check user
            if (getCheckUser.length === 0) {
                res.status(442).send({
                    status: 'fail',
                    code: 422,
                    message: 'User not found',
                });
                return;
            }

            // get latest balance
            const updatedBalance = `SELECT id, user_id, MAX(transaction_date) AS transaction_date, SUM(amount) AS balance FROM user_balance 
                                WHERE user_id = ${id} AND status = 1 GROUP BY user_id`;
            const getUpdateBalance = await asyncQuery(updatedBalance);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: getUpdateBalance[0],
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getHistoryBalance: async (req, res) => {
        const { status, startDate, endDate } = req.query;
        try {
            // get history balance
            let historyBalance = `SELECT ub.id, ub.user_id, ub.transaction_date, ub.amount, ub.status AS status_id, ubs.status FROM user_balance ub
                            JOIN user_balance_status ubs ON ub.status = ubs.id`;

            // check filter
            const checkStartDate = Object.prototype.hasOwnProperty.call(req.query, 'startDate');
            const checkEndDate = Object.prototype.hasOwnProperty.call(req.query, 'endDate');
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'status');
            if (checkStartDate && checkEndDate && checkStatus) {
                historyBalance += ` WHERE ub.transaction_date BETWEEN ${startDate} AND ${endDate} AND ub.status = ${status}`;
            } else if (checkStartDate && checkEndDate) {
                historyBalance += ` WHERE ub.transaction_date BETWEEN ${startDate} AND ${endDate}`;
            } else if (checkStatus) {
                historyBalance += ` WHERE ub.status = ${status}`;
            }
            const getHistoryBalance = await asyncQuery(historyBalance);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: getHistoryBalance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getHistoryBalanceByUser: async (req, res) => {
        const { id } = req.params;
        const { status, startDate, endDate } = req.query;
        try {
            // check user
            const checkUser = `SELECT * FROM user_balance WHERE user_id = ${database.escape(id)}`;
            const getCheckUser = await asyncQuery(checkUser);

            // result of check user
            if (getCheckUser.length === 0) {
                res.status(442).send({
                    status: 'fail',
                    code: 422,
                    message: 'User not found',
                });
                return;
            }

            // get history balance
            let historyBalance = `SELECT ub.id, ub.user_id, ub.transaction_date, ub.amount, ub.status AS status_id, ubs.status FROM user_balance ub
                            JOIN user_balance_status ubs ON ub.status = ubs.id WHERE ub.user_id = ${database.escape(id)}`;

            // check filter
            const checkStartDate = Object.prototype.hasOwnProperty.call(req.query, 'startDate');
            const checkEndDate = Object.prototype.hasOwnProperty.call(req.query, 'endDate');
            const checkStatus = Object.prototype.hasOwnProperty.call(req.query, 'status');
            if (checkStatus && checkStartDate && checkEndDate) {
                historyBalance += ` AND (ub.transaction_date BETWEEN ${startDate} AND ${endDate}) AND ub.status = ${status}`;
            } else if (checkStartDate && checkEndDate) {
                historyBalance += ` AND (ub.transaction_date BETWEEN ${startDate} AND ${endDate})`;
            } else if (checkStatus) {
                historyBalance += ` AND ub.status = ${status}`;
            }
            historyBalance += ' ORDER BY ub.transaction_date DESC';
            const getHistoryBalance = await asyncQuery(historyBalance);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: getHistoryBalance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    updateBalance: async (req, res) => {
        const { amount, password } = req.body;
        const { id } = req.params;

        try {
            // check password
            const checkPassword = `SELECT * FROM users WHERE id = ${id}`;
            const getCheckUser = await asyncQuery(checkPassword);
            const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY);

            if (hashPass.toString() !== getCheckUser[0].password) {
                res.status(400).send({
                    status: 'fail',
                    code: 404,
                    message: 'Password invalid!',
                });
                return;
            }

            // result of check user
            if (getCheckUser.length === 0) {
                res.status(442).send({
                    status: 'fail',
                    code: 422,
                    message: 'User not found',
                });
                return;
            }

            // top up balance
            const topUpBalance = `INSERT INTO user_balance (user_id, transaction_date, amount, status) VALUES (${id}, '${today}', ${amount}, 2)`;
            await asyncQuery(topUpBalance);

            res.status(200).send({
                status: 'success',
                message: `${amount > 0 ? 'Top up' : 'Withdraw'} has been successfully`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editStatusBalance: async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;

        try {
            const checkBalance = `SELECT * FROM user_balance WHERE id = ${database.escape(id)}`;
            const getCheckBalance = await asyncQuery(checkBalance);

            if (getCheckBalance.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'id not found',
                });
                return;
            }

            const editStatus = `UPDATE user_balance SET status = ${database.escape(status)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(editStatus);

            res.status(200).send({
                status: 'success',
                message: 'Your status balance has been changed',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
