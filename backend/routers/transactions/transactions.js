const router = require('express').Router();
const { upload } = require('../../helpers/multer');

// import controllers
const { transactionController } = require('../../controllers');

// declaration of middleware
const DESTINATION = './public/image/users/receipt';
const uploader = upload(DESTINATION);

// route
router.get('/:id', transactionController.getHistory);
router.patch('/checkout/:order', transactionController.checkoutConfirmation);
router.post('/payment-upload/:order', uploader, transactionController.paymentUpload);
router.patch('/payment-confirmation/:order', transactionController.paymentConfirmation);
router.patch('/send/:order', transactionController.sendConfirmation);
router.patch('/done/:order', transactionController.doneConfirmation);
router.patch('/failed/:order', transactionController.transactionFailed);

module.exports = router;
