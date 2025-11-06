const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');
const database = require('../../database');
const { asyncQuery, generateQuery, today } = require('../../helpers/queryHelper');
const { createToken } = require('../../helpers/jwt');

const { SECRET_KEY, GMAIL, PASS_GMAIL } = process.env;

module.exports = {
    getUser: async (req, res) => {
        const {
            type, _sort, _order, name, emailStatus, userStatus,
        } = req.query;
        try {
            // check sort query
            let sort = '';
            if (_sort) {
                sort += ` ORDER BY ${_sort} ${_order ? _order.toUpperCase() : 'ASC'}`;
            }

            // get data users
            let query = `SELECT u.id, u.username, u.user_status_id, u.email, u.email_status_id, uk.full_name, u.phone, uk.gender, u.image,
            ua.city, ua.province, ua.postcode, ua.address, u.role_id FROM users u
            JOIN user_address ua ON u.main_address_id = ua.id
            JOIN user_ktp uk ON u.id = uk.user_id`;

            // users by type
            if (type === 'store') {
                const searchName = Object.prototype.hasOwnProperty.call(req.query, 'name');
                query += ` WHERE u.role_id = 2 ${searchName ? `AND uk.full_name LIKE '%${name}%'` : ''}`;
            } else if (type === 'admin') {
                const searchName = Object.prototype.hasOwnProperty.call(req.query, 'name');
                const checkEmailStatus = Object.prototype.hasOwnProperty.call(req.query, 'emailStatus');
                const checkUserStatus = Object.prototype.hasOwnProperty.call(req.query, 'userStatus');
                query += ` WHERE u.role_id IN (2, 3) ${searchName ? `AND (u.username LIKE '%${name}%' OR u.email LIKE '%${name}%')` : ''} ${checkEmailStatus ? `AND u.email_status_id = ${database.escape(emailStatus)}` : ''} ${checkUserStatus ? `AND u.user_status_id = ${database.escape(userStatus)}` : ''}`;
            }
            query += ` ${sort || ''}`;

            const result = await asyncQuery(query);

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
    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const userId = `SELECT * FROM users WHERE id = ${database.escape(id)}`;
            const getUserId = await asyncQuery(userId);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: getUserId[0],
            });
        } catch (error) {
            console.log(error);
            res.status.send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    register: async (req, res) => {
        const {
            username, password, email, roleId,
        } = req.body;
        const errorValidator = validationResult(req);

        // check input with express validator
        if (!errorValidator.isEmpty()) {
            res.status(422).send({
                status: 'fail',
                code: 422,
                message: { errors: errorValidator.array()[0].msg },
            });
            return;
        }

        try {
            // check user already registered?
            const checkUser = `SELECT * FROM users WHERE username = ${database.escape(username)} OR email = ${database.escape(email)}`;
            const resultCheck = await asyncQuery(checkUser);

            if (resultCheck.length > 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: { errors: 'Username or email already used' },
                });
                return;
            }
            const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY);

            // add to users table
            const addUSer = `INSERT INTO users (username, password, email, role_id, user_status_id, email_status_id, reg_date)
                VALUES (${database.escape(username)}, '${hashPass.toString()}', ${database.escape(email)}, ${database.escape(roleId)}, 1, 2, ${database.escape(today)})`;
            await asyncQuery(addUSer);

            const getId = `SELECT id FROM users WHERE username = ${database.escape(username)} AND email = ${database.escape(email)}`;
            const resGetId = await asyncQuery(getId);
            const newUserId = resGetId[0].id;
            req.body.id = newUserId;

            // add to profile table
            const addProfile = `INSERT INTO user_ktp (user_id) VALUES (${newUserId})`;
            await asyncQuery(addProfile);

            // create token
            const token = createToken({ id: newUserId, username });

            // setup nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: GMAIL,
                    pass: PASS_GMAIL,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            // send email verification to user
            const option = {
                from: 'admin <customer.support@wiselashop.co.id>',
                to: `${email}`,
                subject: 'Confirm your account on Wisela',
                text: '',
                html: `
                    <!DOCTYPE html>
                    <html>
                    
                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }
                    
                            /* CLIENT-SPECIFIC STYLES */
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }
                    
                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }
                    
                            img {
                                -ms-interpolation-mode: bicubic;
                            }
                    
                            /* RESET STYLES */
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }
                    
                            table {
                                border-collapse: collapse !important;
                            }
                    
                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }
                    
                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }
                    
                            /* MOBILE STYLES */
                            @media screen and (max-width:600px) {
                                h1 {
                                    font-size: 32px !important;
                                    line-height: 32px !important;
                                }
                            }
                    
                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    </head>
                    
                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="#172C93" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#172C93" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#172C93">
                                                                        <a href='http://localhost:3000/authentication/email-verification?token=${token}' target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #172C93; display: inline-block;">
                                                                            Confirm Account
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;"><a href="http://localhost:3000/authentication/email-verification?token=${token}" target="_blank" style="color: #172C93;">http://localhost:3000/authentication/email-verification?token=${token}</a></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Cheers,<br>Wisela Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#172C93" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <h2 style="font-size: 20px; font-weight: 400; color: #fff; margin: 0;">Need more help?</h2>
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #fff;">We&rsquo;re here to help you out</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                                                <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    
                    </html>
                `,
            };
            await transporter.sendMail(option);
            // const transNodeMailer = await transporter.sendMail(option);
            // console.log('Message sent: %s', transNodeMailer.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(option));

            // send token to client
            req.body.token = token;
            // send response
            res.status(200).send({
                status: 'success',
                data: req.body,
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
    login: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            // login by username or email
            let login = 'SELECT * FROM users WHERE ';
            if (username === undefined) {
                login += `email = '${email}'`;
            } else if (email === undefined) {
                login += `username = '${username}'`;
            } else if (email !== undefined && username !== undefined) {
                login += `username = '${username}'`;
            }
            const result = await asyncQuery(login);

            // check username or email
            if (result.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Username or email not registered',
                });
                return;
            }
            // check password
            const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY);
            if (hashPass.toString() !== result[0].password) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'Password invalid!',
                });
                return;
            }
            // create token
            const token = createToken({
                id: result[0].id,
                username: result[0].username,
                role_id: result[0].role_id,
            });

            // send token and delete password
            delete result[0].password;
            result[0].token = token;

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Log In success!',
                data: result[0],
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
    sendEmailResetPassword: async (req, res) => {
        const { email } = req.body;

        // check email empty
        if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) {
            res.status(422).send({
                status: 'fail',
                code: 422,
                message: 'Email is required!',
            });
            return;
        }

        // check input with express validator
        // eslint-disable-next-line no-useless-escape
        const regexEmail = /^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/;
        if (!regexEmail.test(email)) {
            res.status(422).send({
                status: 'fail',
                code: 422,
                message: 'Email doesn\'t valid! Example: youremail@mail.com',
            });
            return;
        }

        try {
            // check user already registered?
            const checkUser = `SELECT * FROM users WHERE email = ${database.escape(email)}`;
            const resultCheck = await asyncQuery(checkUser);

            if (resultCheck.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Your email doesn\'t exists in our database',
                });
                return;
            }

            // create token
            const token = createToken({ email });

            // setup nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: GMAIL,
                    pass: PASS_GMAIL,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            // send email verification for reset password to user
            const option = {
                from: 'admin <customer.support@wiselashop.co.id>',
                to: `${email}`,
                subject: 'Email verification for Reset Password',
                text: '',
                html: `
                    <!DOCTYPE html>
                    <html>
                    
                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }
                    
                            /* CLIENT-SPECIFIC STYLES */
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }
                    
                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }
                    
                            img {
                                -ms-interpolation-mode: bicubic;
                            }
                    
                            /* RESET STYLES */
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }
                    
                            table {
                                border-collapse: collapse !important;
                            }
                    
                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }
                    
                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }
                    
                            /* MOBILE STYLES */
                            @media screen and (max-width:600px) {
                                h1 {
                                    font-size: 32px !important;
                                    line-height: 32px !important;
                                }
                            }
                    
                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    </head>
                    
                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">We have received request to reset your password!</div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="#172C93" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#172C93" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Reset Your Password</h1> <img src="https://img.icons8.com/color/48/000000/forget.png" width="125" height="120" style="display: block; border: 0px;" /> 
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">We've received a request to <strong>reset your password</strong>. Just press the button below.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#172C93">
                                                                        <a href='http://localhost:3000/authentication/reset-password?token=${token}' target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #172C93; display: inline-block;">
                                                                            Reset Password
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;"><a href="http://localhost:3000/authentication/reset-password?token=${token}" target="_blank" style="color: #172C93;">http://localhost:3000/authentication/reset-password?token=${token}</a></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">The link above will expire in 8 hours. If you didn't request for a password reset, don't worry, we haven't done anything yet; feel free to disregard this email.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Cheers,<br>Wisela Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#172C93" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <h2 style="font-size: 20px; font-weight: 400; color: #FFF; margin: 0;">Need more help?</h2>
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFF;">We&rsquo;re here to help you out</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                                                <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    
                    </html>
                `,
            };
            await transporter.sendMail(option);
            // const transNodeMailer = await transporter.sendMail(option);
            // console.log('Message sent: %s', transNodeMailer.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(option));

            // send token to client
            req.body.token = token;
            // send response
            res.status(200).send({
                status: 'success',
                data: req.body,
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
    editResetPassword: async (req, res) => {
        const { email, password } = req.body;
        const errorValidator = validationResult(req);

        try {
            // check email
            const checkEmail = `SELECT * FROM users WHERE email = ${database.escape(email)}`;
            const getCheckEmail = await asyncQuery(checkEmail);

            if (getCheckEmail.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your email doesn\'t exists in our database',
                });
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

            // encrypt password
            const hashNewPass = CryptoJS.HmacMD5(password, SECRET_KEY);

            // edit password
            const editPass = `UPDATE users SET password = '${hashNewPass.toString()}' WHERE email = ${database.escape(email)}`;
            await asyncQuery(editPass);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Password has been changed',
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
    checkExpiredResetPassword: async (req, res) => {
        const { token } = req.body;
        const { iat, exp } = req.data;
        try {
            const checkExpired = `SELECT * FROM users WHERE email = ${database.escape(req.data.email)}`;
            const result = await asyncQuery(checkExpired);

            // check expired
            if (result.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Your email doesn\'t exists in our database',
                });
            }

            const createdDate = new Date(0);
            createdDate.setUTCSeconds(iat);

            const expiredDate = new Date(0);
            expiredDate.setUTCSeconds(exp);

            const dataToken = { token, createdDate, expiredDate };
            const { id, username, email } = result[0];
            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: {
                    id, username, email, dataToken,
                },
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
    emailVerification: async (req, res) => {
        try {
            // activate account
            const setStatus = `UPDATE users SET email_status_id = 1 WHERE id = ${database.escape(req.data.id)} AND username = ${database.escape(req.data.username)}`;
            await asyncQuery(setStatus);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Email has been verified!',
                data: { ...req.data },
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
    keepLogin: async (req, res) => {
        const { token } = req.body;
        const { iat, exp } = req.data;
        try {
            const keepLogin = `SELECT * FROM users WHERE id = ${req.data.id}`;
            const result = await asyncQuery(keepLogin);

            // delete password in result
            delete result[0].password;

            // data from date of token
            const createdDate = new Date(0);
            createdDate.setUTCSeconds(iat);

            const expiredDate = new Date(0);
            expiredDate.setUTCSeconds(exp);

            const dataToken = { token, createdDate, expiredDate };

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: { ...result[0], dataToken },
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
    editUser: async (req, res) => {
        const { id } = req.params;
        try {
            // check user id
            const checkId = `SELECT * FROM users WHERE id = ${database.escape(id)}`;
            const resultId = await asyncQuery(checkId);

            if (resultId.length === 0) {
                res.status(400).send({
                    status: 'fail',
                    code: 422,
                    message: `Users with id: ${id} doesn't exists`,
                });
                return;
            }

            // edit data in user
            const edit = `UPDATE users SET ${generateQuery(req.body)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(edit);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your edit has been successfully',
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
    editPassword: async (req, res) => {
        const { id } = req.params;
        const { password, newPassword } = req.body;
        const errorValidator = validationResult(req);

        try {
            // check old password
            const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY);
            const checkId = `SELECT * FROM users WHERE id = ${database.escape(id)} AND password = '${hashPass.toString()}'`;
            const resultId = await asyncQuery(checkId);

            if (resultId.length === 0) {
                res.status(422).send({
                    status: 'fail',
                    code: 422,
                    message: 'Password invalid',
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

            // encrypt password
            const hashNewPass = CryptoJS.HmacMD5(newPassword, SECRET_KEY);

            // edit password
            const editPass = `UPDATE users SET password = '${hashNewPass.toString()}' WHERE id = ${database.escape(id)}`;
            await asyncQuery(editPass);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Password has been changed',
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
    registerStore: async (req, res) => {
        const { id } = req.params;
        const { roleId } = req.body;
        try {
            // check user
            const checkUser = `SELECT * FROM users WHERE id = ${database.escape(id)}`;
            const getCheckUser = await asyncQuery(checkUser);

            if (getCheckUser.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            // edit role id
            const editRole = `UPDATE users SET role_id = ${database.escape(roleId)} WHERE id = ${database.escape(id)}`;
            await asyncQuery(editRole);

            // add to store table
            const addStore = `INSERT INTO stores (user_id) VALUES (${database.escape(id)})`;
            await asyncQuery(addStore);

            res.status(200).send({
                status: 'success',
                message: 'Congrats! You\'ve registered as seller.',
                data: {
                    role_id: 2,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error,
            });
        }
    },
};
