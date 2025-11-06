// import all controller
const userController = require('./users/users');
const profileController = require('./users/profiles');
const blogController = require('./blog/blog');
const blogCategoryController = require('./blog/blogCategory');
const categoryBlogController = require('./blog/categories');
const blogTagController = require('./blog/blogTag');
const tagBlogController = require('./blog/tags');
const commentController = require('./blog/comments');
const productController = require('./products/products');
const productTagController = require('./products/productTag');
const tagProductController = require('./products/tags');
const productCategoryController = require('./products/productCategory');
const productReviewController = require('./products/productReview');
const categoryProductController = require('./products/categories');
const cartController = require('./transactions/carts');
const transactionController = require('./transactions/transactions');
const storeController = require('./transactions/stores');
const shippingController = require('./transactions/shipping');
const wishlistController = require('./users/wishlist');
const addressController = require('./users/address');
const subscribeController = require('./users/subscribe');

// export all controller
module.exports = {
    userController,
    profileController,
    blogController,
    blogCategoryController,
    categoryBlogController,
    blogTagController,
    tagBlogController,
    commentController,
    productController,
    productTagController,
    tagProductController,
    productCategoryController,
    productReviewController,
    categoryProductController,
    cartController,
    storeController,
    transactionController,
    shippingController,
    wishlistController,
    addressController,
    subscribeController,
};
