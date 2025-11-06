const router = require('express').Router();

// import controller
const { tagProductController } = require('../../controllers');

// route
router.get('/', tagProductController.getTag);
router.post('/', tagProductController.addTags);
router.delete('/:id', tagProductController.deleteTags);
router.patch('/:id', tagProductController.editTags);

module.exports = router;
