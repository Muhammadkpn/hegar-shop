const router = require('express').Router();

// import controller
const { addressController } = require('../../controllers');

// route
router.get('/main-address/:id', addressController.getMainAddress);
router.get('/:id', addressController.getAddress);
router.post('/', addressController.addAddress);
router.patch('/:id', addressController.editAddress);
router.delete('/:id', addressController.deleteAddress);
router.get('/stores/:id', addressController.getStoreAddress);
router.post('/stores/', addressController.addStoreAddress);
router.patch('/stores/:id', addressController.editStoreAddress);
router.delete('/stores/:id', addressController.deleteStoreAddress);

module.exports = router;
