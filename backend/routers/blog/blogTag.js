const router = require('express').Router();

// import controller
const { blogTagController } = require('../../controllers');

// route
router.get('/', blogTagController.getBlogTag);
router.get('/count', blogTagController.countTag);
router.post('/', blogTagController.addBlogTag);
router.delete('/:id', blogTagController.deleteBlogTag);
router.patch('/:id', blogTagController.editBlogTag);

module.exports = router;
