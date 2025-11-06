const router = require('express').Router();

// import controller
const { profileController } = require('../../controllers');

// middleware
const { upload } = require('../../helpers/multer');
const { ktpValidator } = require('../../helpers/validator');

const DESTINATION1 = './public/image/users';
const uploader1 = upload(DESTINATION1);
const DESTINATION2 = './public/image/users/ktp';
const uploader2 = upload(DESTINATION2);

// route
router.get('/stores/:id', profileController.getStore);
router.post('/stores', profileController.registerStore);
router.patch('/stores/:id', profileController.editStore);
router.get('/ktp', profileController.getKtp);
router.get('/ktp/:id', profileController.getKtpById);
router.patch('/ktp/:id', ktpValidator, profileController.editKtp);
router.patch('/ktp/status/:id', profileController.editKtpStatus);
router.get('/bank-account', profileController.getBankAccount);
router.get('/bank-account/:id', profileController.getBankAccountByUser);
router.post('/bank-account/', profileController.addBankAccount);
router.patch('/bank-account/:id', profileController.editBankAccount);
router.delete('/bank-account/:id', profileController.deleteBankAccount);
router.post('/upload/image/:id', uploader1, profileController.uploadImageProfile);
router.post('/upload/ktp/:id', uploader2, profileController.uploadKtp);
router.post('/upload/rekening/:id', uploader2, profileController.uploadRekening);
router.get('/balance/updated/:id', profileController.getUpdatedBalance);
router.get('/balance/history', profileController.getHistoryBalance);
router.get('/balance/history/:id', profileController.getHistoryBalanceByUser);
router.post('/balance/:id', profileController.updateBalance);
router.patch('/balance/:id', profileController.editStatusBalance);

module.exports = router;
