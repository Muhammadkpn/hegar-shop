const router = require('express').Router();

// import controller
const { categoryBlogController } = require('../../controllers');

// route
router.get('/', categoryBlogController.getCategory);
router.post('/', categoryBlogController.addCategory);
router.delete('/:id', categoryBlogController.deleteCategory);
router.patch('/:id', categoryBlogController.editCategory);

module.exports = router;
