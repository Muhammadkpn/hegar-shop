const router = require('express').Router();

// import controller
const { blogCategoryController } = require('../../controllers');

// route
router.get('/', blogCategoryController.getBlogCategory);
router.get('/count', blogCategoryController.countCategory);
router.post('/', blogCategoryController.addBlogCategory);
router.delete('/:id', blogCategoryController.deletBlogCategory);
router.patch('/:id', blogCategoryController.editBlogCategory);

module.exports = router;
