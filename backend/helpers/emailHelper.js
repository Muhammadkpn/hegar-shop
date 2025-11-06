const nodemailer = require('nodemailer');

const { GMAIL, PASS_GMAIL } = process.env;

/**
 * Email Templates & Helper
 * Centralized email sending functionality
 */

// Create reusable transporter
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL,
            pass: PASS_GMAIL,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
}

// Welcome/Verification Email Template
function getVerificationEmailTemplate(token) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Wisela</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#172C93" align="center" style="padding: 40px 10px;">
                <h1 style="color: white; margin: 0;">Welcome!</h1>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white;">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2>Confirm Your Account</h2>
                            <p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/authentication/email-verification?token=${token}"
                                   style="background: #172C93; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Confirm Account
                                </a>
                            </p>
                            <p>If the button doesn't work, copy and paste this link:</p>
                            <p style="word-break: break-all; color: #172C93;">
                                http://localhost:3000/authentication/email-verification?token=${token}
                            </p>
                            <p>If you have any questions, just reply to this email.</p>
                            <p>Cheers,<br>Wisela Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

// Reset Password Email Template
function getResetPasswordEmailTemplate(token) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#172C93" align="center" style="padding: 40px 10px;">
                <h1 style="color: white; margin: 0;">Reset Your Password</h1>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white;">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2>Password Reset Request</h2>
                            <p>We've received a request to reset your password. Just press the button below.</p>
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/authentication/reset-password?token=${token}"
                                   style="background: #172C93; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Reset Password
                                </a>
                            </p>
                            <p>If the button doesn't work, copy and paste this link:</p>
                            <p style="word-break: break-all; color: #172C93;">
                                http://localhost:3000/authentication/reset-password?token=${token}
                            </p>
                            <p><strong>Important:</strong> This link will expire in 8 hours.</p>
                            <p>If you didn't request a password reset, please ignore this email. Your password won't be changed.</p>
                            <p>Cheers,<br>Wisela Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

/**
 * Send verification email
 * @param {string} email - Recipient email
 * @param {string} token - Verification token
 */
async function sendVerificationEmail(email, token) {
    const transporter = createTransporter();

    const mailOptions = {
        from: 'Wisela <customer.support@wiselashop.co.id>',
        to: email,
        subject: 'Confirm your account on Wisela',
        html: getVerificationEmailTemplate(token),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to: ${email}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Failed to send verification email to ${email}:`, error.message);
        throw error;
    }
}

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} token - Reset token
 */
async function sendPasswordResetEmail(email, token) {
    const transporter = createTransporter();

    const mailOptions = {
        from: 'Wisela <customer.support@wiselashop.co.id>',
        to: email,
        subject: 'Reset your password - Wisela',
        html: getResetPasswordEmailTemplate(token),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to: ${email}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Failed to send password reset email to ${email}:`, error.message);
        throw error;
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    createTransporter,
};
