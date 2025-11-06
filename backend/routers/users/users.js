const router = require('express').Router();
const { passValidator, registValidator, resetPassword } = require('../../helpers/validator');
const { verify } = require('../../helpers/jwt');

// import controller
const { userController } = require('../../controllers');

// route
router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/register', registValidator, userController.register);
router.post('/register/store/:id', userController.registerStore);
router.patch('/reset-password', resetPassword, userController.editResetPassword);
router.post('/verification/reset-password/send-email', userController.sendEmailResetPassword);
router.post('/verification/reset-password/check-expired', verify, userController.checkExpiredResetPassword);
router.patch('/verification/email', verify, userController.emailVerification);
router.post('/login', userController.login);
router.post('/keepLogin', verify, userController.keepLogin);
router.patch('/:id', userController.editUser);
router.patch('/password/:id', passValidator, userController.editPassword);

module.exports = router;
