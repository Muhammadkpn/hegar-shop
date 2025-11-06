const router = require('express').Router();
const { upload } = require('../../helpers/multer');

// import controllers
const { productReviewController } = require('../../controllers');

// middleware
const DESTINATION = './public/image/users/review';
const uploader = upload(DESTINATION, 'multiple');

// route
router.get('/:id', productReviewController.getProductReview);
router.patch('/:id', productReviewController.addReview);
router.post('/review-upload/:id', uploader, productReviewController.reviewUpload);
router.delete('/:id', productReviewController.deleteReview);
router.patch('/edit/:id', productReviewController.editReview);

module.exports = router;
