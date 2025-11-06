const router = require('express').Router();

// import controller
const { productTagController } = require('../../controllers');

// route
router.get('/', productTagController.getProductTag);
router.get('/count', productTagController.countTag);
router.get('/count/store/:id', productTagController.countTagByStore);
router.post('/', productTagController.addProductTag);
router.delete('/:id', productTagController.deleteProductTag);
router.patch('/:id', productTagController.editProductTag);
router.patch('/store/:id', productTagController.editProductTagByStore);

module.exports = router;
