const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json()); // Used to parse JSON bodies
// cors
if (process.env.NODE_ENV === 'development') {
    app.use(
        cors({
            origin: `${process.env.CLIENT_URL}`,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        }),
    );
}
app.use(express.static('./public'));

// test
app.get('/', (req, res) => {
    res.status(200).send('API Wisela Web App');
});

// create alert for database connection
const database = require('./database');

database.connect((err) => {
    if (err) {
        console.error(`error connecting : ${err.stack}`);
        return;
    }
    console.log('Connected as id : ', database.threadId);
});

// import router
const {
    userRouter,
    profileRouter,
    blogRouter,
    blogCategoryRouter,
    categoryBlogRouter,
    blogTagRouter,
    tagBlogRouter,
    commentRouter,
    productCategoryRouter,
    productRouter,
    tagProductRouter,
    productTagRouter,
    productReviewRouter,
    categoryProductRouter,
    cartRouter,
    storeRouter,
    transactionRouter,
    wishlistRouter,
    addressRouter,
    subscribeRouter,
    shippingRouter,
} = require('./routers');

app.use('/api/users', userRouter);
app.use('/api/users/profiles', profileRouter);
app.use('/api/users/wishlist', wishlistRouter);
app.use('/api/users/address', addressRouter);
app.use('/api/users/subscribe', subscribeRouter);
app.use('/api/blog', blogRouter);
app.use('/api/blog/blog-category', blogCategoryRouter);
app.use('/api/blog/categories', categoryBlogRouter);
app.use('/api/blog/blog-tag', blogTagRouter);
app.use('/api/blog/tags', tagBlogRouter);
app.use('/api/blog/comments', commentRouter);
app.use('/api/products', productRouter);
app.use('/api/products/tags', tagProductRouter);
app.use('/api/products/product-tag', productTagRouter);
app.use('/api/products/product-category', productCategoryRouter);
app.use('/api/products/reviews', productReviewRouter);
app.use('/api/products/categories', categoryProductRouter);
app.use('/api/transactions/orders', transactionRouter);
app.use('/api/transactions/carts', cartRouter);
app.use('/api/transactions/stores', storeRouter);
app.use('/api/transactions/shipping', shippingRouter);

const PORT = 2000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
