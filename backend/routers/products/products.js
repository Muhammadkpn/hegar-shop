const router = require('express').Router();

// import controller
const { productController } = require('../../controllers');

// middleware
const { upload } = require('../../helpers/multer');

const DESTINATION = './public/image/products';
const TYPE = 'multiple';
const uploader = upload(DESTINATION, TYPE);

// route
router.get('/', productController.getProduct);
router.get('/details/:id', productController.getProductDetails);
router.get('/store/:id', productController.getProductStore);
router.get('/admin', productController.getProductAdmin);
router.post('/', productController.addProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id', productController.editProduct);
router.get('/images', productController.getProductImage);
router.post('/images/:id', uploader, productController.addProductImage);
router.delete('/images/:id', productController.deleteProductImage);
router.patch('/images/:id', productController.editProductImage);

module.exports = router;
