const router = require('express').Router();

// import controller
const { productCategoryController } = require('../../controllers');

// route
router.get('/', productCategoryController.getProductCategory);
router.get('/count', productCategoryController.countCategory);
router.get('/count/store/:id', productCategoryController.countCategoryByStore);
router.post('/', productCategoryController.addProductCategory);
router.patch('/:id', productCategoryController.editProductCategory);
router.patch('/store/:id', productCategoryController.editProductCategoryByStore);
router.delete('/:id', productCategoryController.deleteProductCategory);

module.exports = router;
