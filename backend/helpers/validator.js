const { body } = require('express-validator');

const registValidator = [
    body('username')
        .notEmpty()
        .withMessage('Username is required!')
        .isLength({ min: 6 })
        .withMessage('Username minimal 6 characters!'),
    body('email')
        .notEmpty()
        .withMessage('Email is required!')
        .isEmail()
        .withMessage("Email doesn't valid! Example: youremail@mail.com"),
    body('password')
        .notEmpty()
        .withMessage('Password is required!')
        .isLength({ min: 6 })
        .withMessage('Password minimal 6 characters!')
        .matches(/[!@#$%^&*;]/)
        .withMessage('Password must include special characters! Example: !@#$%^&*;')
        .matches(/[0-9]/)
        .withMessage('Password must include number!'),
    body('confPassword')
        .notEmpty()
        .withMessage('Confirm Password is required!')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm Password doesn't match");
            }

            // Indicates the success of this synchronous custom validator
            return true;
        }),
];

const ktpValidator = [
    body('full_name')
        .notEmpty()
        .withMessage('Full Name is required!')
        .isLength({ min: 6 })
        .withMessage('Full Name minimal 6 characters!'),
    body('ktp_number')
        .notEmpty()
        .withMessage('KTP Number is required!')
        .matches(/[0-9]/)
        .withMessage("Email doesn't valid! Example: youremail@mail.com"),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required!')
        .isIn(['Female', 'Male'])
        .withMessage('The correct gender is Female or Male'),
    body('birthplace')
        .notEmpty()
        .withMessage('Birthplace is required!'),
    body('birthdate')
        .notEmpty()
        .withMessage('Birthdate is required!')
        // .isISO8601('yyyy-mm-dd')
        .isDate()
        .withMessage('The correct birthdate format is yyyy-mm-dd'),
    body('address')
        .notEmpty()
        .withMessage('Address is required!'),
];

const passValidator = [
    body('newPassword')
        .notEmpty()
        .withMessage('New Password is required!')
        .isLength({ min: 6 })
        .withMessage('New Password minimal 6 characters!')
        .matches(/[!@#$%^&*;]/)
        .withMessage('New Password must include special characters! Example: !@#$%^&*;')
        .matches(/[0-9]/)
        .withMessage('New Password must include number!'),
    body('confNewPassword')
        .notEmpty()
        .withMessage('Confirm New Password is required!')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Confirm New Password doesn't match");
            }

            // Indicates the success of this synchronous custom validator
            return true;
        }),
];

const resetPassword = [
    body('password')
        .notEmpty()
        .withMessage('New Password is required!')
        .isLength({ min: 6 })
        .withMessage('New Password minimal 6 characters!')
        .matches(/[!@#$%^&*;]/)
        .withMessage('New Password must include special characters! Example: !@#$%^&*;')
        .matches(/[0-9]/)
        .withMessage('New Password must include number!'),
    body('confPassword')
        .notEmpty()
        .withMessage('Confirm New Password is required!')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm New Password doesn't match");
            }

            // Indicates the success of this synchronous custom validator
            return true;
        }),
];

module.exports = {
    registValidator,
    passValidator,
    ktpValidator,
    resetPassword,
};
