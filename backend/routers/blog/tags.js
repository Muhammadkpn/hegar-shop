const router = require('express').Router();

// import controller
const { tagBlogController } = require('../../controllers');

// route
router.get('/', tagBlogController.getTag);
router.post('/', tagBlogController.addTags);
router.delete('/:id', tagBlogController.deleteTags);
router.patch('/:id', tagBlogController.editTags);

module.exports = router;
