const router = require('express').Router();

// import controllers
const { commentController } = require('../../controllers');

router.get('/:id', commentController.getCommentByArticle);
router.get('/admin/:id', commentController.getCommentsAdmin);
router.post('/', commentController.addComment);
router.delete('/:id', commentController.deleteComment);
router.patch('/:id', commentController.editComment);

module.exports = router;
