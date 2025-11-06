const router = require('express').Router();
const { upload } = require('../../helpers/multer');

// import controller
const { blogController } = require('../../controllers');

const DESTINATION = './public/image/blog/';
const uploader = upload(DESTINATION);

// route
router.get('/', blogController.getBlog);
router.get('/admin', blogController.getAdminBlog);
router.get('/details/:id', blogController.getDetailsBlog);
router.get('/others/:id', blogController.getOthersBlog);
router.get('/popular', blogController.getPopularBlog);
router.post('/count-view/:id', blogController.countView);
router.post('/', uploader, blogController.addBlog);
router.delete('/:id', blogController.deleteBlog);
router.patch('/:id', blogController.editBlog);
router.patch('/image/:id', uploader, blogController.editBlogImage);

module.exports = router;
