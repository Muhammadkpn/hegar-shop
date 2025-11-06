const router = require('express').Router();

// import controller
const { categoryProductController } = require('../../controllers');

// route
router.get('/', categoryProductController.getCategory);
router.get('/child', categoryProductController.getCategoryChild);
router.post('/', categoryProductController.addCategory);
router.delete('/:id', categoryProductController.deleteCategory);
router.patch('/:id', categoryProductController.editCategory);

module.exports = router;
