// import all router
const userRouter = require('./users/users');
const profileRouter = require('./users/profiles');
const blogRouter = require('./blog/blog');
const blogCategoryRouter = require('./blog/blogCategory');
const categoryBlogRouter = require('./blog/categories');
const blogTagRouter = require('./blog/blogTag');
const tagBlogRouter = require('./blog/tags');
const commentRouter = require('./blog/comments');
const productRouter = require('./products/products');
const productTagRouter = require('./products/productTag');
const tagProductRouter = require('./products/tags');
const productCategoryRouter = require('./products/productCategory');
const productReviewRouter = require('./products/productReview');
const categoryProductRouter = require('./products/categories');
const cartRouter = require('./transactions/carts');
const transactionRouter = require('./transactions/transactions');
const storeRouter = require('./transactions/stores');
const shippingRouter = require('./transactions/shipping');
const wishlistRouter = require('./users/wishlist');
const addressRouter = require('./users/address');
const subscribeRouter = require('./users/subscribe');

// export all router
module.exports = {
    userRouter,
    profileRouter,
    blogRouter,
    blogCategoryRouter,
    categoryBlogRouter,
    blogTagRouter,
    tagBlogRouter,
    commentRouter,
    productRouter,
    tagProductRouter,
    productTagRouter,
    productCategoryRouter,
    productReviewRouter,
    categoryProductRouter,
    cartRouter,
    storeRouter,
    transactionRouter,
    shippingRouter,
    wishlistRouter,
    addressRouter,
    subscribeRouter,
};
