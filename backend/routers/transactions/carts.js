const router = require('express').Router();

// import controller
const { cartController } = require('../../controllers');

// create route
router.get('/:id', cartController.getCart);
router.post('/', cartController.addToCart);
router.patch('/:id', cartController.editQtyInCart);
router.delete('/:id', cartController.deleteCart);

// export router
module.exports = router;
