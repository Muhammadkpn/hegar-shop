const router = require('express').Router();

// import controllers
const { wishlistController } = require('../../controllers');

// route
router.get('/:id', wishlistController.getWishlist);
router.delete('/:userId/:productId', wishlistController.deleteWishlist);
router.patch('/update', wishlistController.updateWishlist);

module.exports = router;
