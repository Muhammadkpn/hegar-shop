import { combineReducers } from "redux";
import blogReducer from "./blog/blog";
import commentReducer from "./blog/comments";
import categoryBlogReducer from "./blog/categories";
import tagBlogReducer from "./blog/tags";
import blogTagReducer from "./blog/blogTag";
import blogCategoryReducer from "./blog/blogCategory";
import cartReducer from "./transactions/carts";
import transactionReducer from "./transactions/transactions";
import shippingReducer from "./transactions/shipping";
import storeReducer from "./transactions/stores";
import productReducer from "./products/products";
import productTagReducer from "./products/productTag";
import tagProductReducer from "./products/tags";
import categoryProductReducer from "./products/categories";
import productCategoryReducer from "./products/productCategory";
import productReviewReducer from "./products/productReview";
import userReducer from "./users/users";
import subscribeReducer from './users/subscribe'
import profileReducer from "./users/profiles";
import addressReducer from "./users/address";
import wishlistReducer from "./users/wishlist";

const RootReducer = combineReducers({
    blog: blogReducer,
    categoryBlog: categoryBlogReducer,
    blogCategory: blogCategoryReducer,
    tagBlog: tagBlogReducer,
    blogTag: blogTagReducer,
    blogComments: commentReducer,
    cart: cartReducer,
    transaction: transactionReducer,
    shipping: shippingReducer,
    store: storeReducer,
    products: productReducer,
    tagProduct: tagProductReducer,
    productTag: productTagReducer,
    categoryProduct: categoryProductReducer,
    productCategory: productCategoryReducer,
    productReview: productReviewReducer,
    users: userReducer,
    subscribe: subscribeReducer,
    address: addressReducer,
    profile: profileReducer,
    wishlist: wishlistReducer,
});

export default RootReducer;
