const router = require('express').Router();

const { shippingController } = require('../../controllers');

router.get('/province', shippingController.getProvince);
router.get('/city', shippingController.getCity);
router.get('/subdistrict', shippingController.getSubdistrict);
router.post('/cost', shippingController.checkDeliveryFee);
router.get('/courier', shippingController.getAdminCourier);
router.get('/courier/:id', shippingController.getAdminCourierById);
router.post('/courier', shippingController.addAdminCourier);
router.patch('/courier/:id', shippingController.editAdminCourier);
router.delete('/courier/:id', shippingController.deleteAdminCourier);
router.get('/courier/store/:id', shippingController.getStoreCourier);
router.patch('/courier/store/:id', shippingController.editStoreCourier);

module.exports = router;
