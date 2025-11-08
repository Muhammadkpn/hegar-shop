// Base URLs (override via NEXT_PUBLIC_* env for non-local environments)
const apiBaseEnv = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    : null;
const assetBaseEnv = process.env.NEXT_PUBLIC_ASSET_URL
    ? process.env.NEXT_PUBLIC_ASSET_URL.replace(/\/$/, '')
    : null;

const defaultApiBase = 'http://localhost:2000/api';
const defaultAssetBase = 'http://localhost:2000';

export const URL = apiBaseEnv || defaultApiBase;
export const URL_IMG =
    assetBaseEnv ||
    (apiBaseEnv && apiBaseEnv.endsWith('/api') ? apiBaseEnv.slice(0, -4) : apiBaseEnv) ||
    defaultAssetBase;

// Helper function to get full image URL
// If the path is already a full URL (starts with http:// or https://), return as is
// Otherwise, prepend URL_IMG to the path
export const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';

    // If already full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Otherwise prepend URL_IMG
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${URL_IMG}${cleanPath}`;
};

// cart
export const ADD_TO_CART = 'ADD_TO_CART';
export const GET_CART = 'GET_CART';
export const ERROR_CART = 'ERROR_CART';

// transaction
export const GET_ORDER = 'GET_ORDER';
export const ERROR_CHECKOUT = 'ERROR_CHECKOUT';
export const UPLOAD_PAYMENT_ERROR = 'UPLOAD_PAYMENT_ERROR';
export const GET_PAYMENT = 'GET_PAYMENT';
export const GET_HISTORY = 'GET_HISTORY';

// store
export const GET_SALES_SUMMARY = 'GET_SALES_SUMMARY';
export const GET_SALES_EARNINGS = 'GET_SALES_EARNINGS';
export const GET_SALES_CHARTS = 'GET_SALES_CHARTS';

// products
export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_SEARCH_PRODUCT = 'GET_SEARCH_PRODUCT';
export const RESET_SEARCH_PRODUCT = 'RESET_SEARCH_PRODUCT';
export const GET_SEARCH_BANNER = 'GET_SEARCH_BANNER';
export const RESET_SEARCH_BANNER = 'RESET_SEARCH_BANNER';
export const GET_PRODUCT_DISCOUNT = 'GET_PRODUCT_DISCOUNT';
export const GET_NEW_PRODUCT = 'GET_NEW_PRODUCT';
export const GET_PRODUCT_TAG = 'GET_PRODUCT_TAG';
export const GET_TAG_PRODUCT = 'GET_TAG_PRODUCT';
export const COUNT_TAG_PRODUCT = 'COUNT_TAG_PRODUCT';
export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const GET_PRODUCT_STORE = 'GET_PRODUCT_STORE';
export const GET_PRODUCT_ADMIN = 'GET_PRODUCT_ADMIN';
export const GET_PRODUCT_REVIEW = 'GET_PRODUCT_REVIEW';
export const GET_CATEGORY_PRODUCT = 'GET_CATEGORY_PRODUCT';
export const GET_CATEGORY_CHILD_PRODUCT = 'GET_CATEGORY_CHILD_PRODUCT';
export const COUNT_CATEGORY_PRODUCT = 'COUNT_CATEGORY_PRODUCT';
export const GET_PRODUCT_IMAGE = 'GET_PRODUCT_IMAGE';
export const GET_PRODUCT_CATEGORY = 'GET_PRODUCT_CATEGORY';
export const ERROR_UPLOAD_REVIEW = 'ERROR_UPLOAD_REVIEW';

// blog
export const GET_BLOG = 'GET_BLOG';
export const GET_ADMIN_BLOG = 'GET_ADMIN_BLOG';
export const GET_BLOG_DETAILS = 'GET_BLOG_DETAILS';
export const GET_OTHERS_BLOG = 'GET_OTHERS_BLOG';
export const GET_POPULAR = 'GET_POPULAR';
export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_COMMENTS_ADMIN = 'GET_COMMENTS_ADMIN';
export const GET_TAG_BLOG = 'GET_TAG_BLOG';
export const COUNT_TAG_BLOG = 'COUNT_TAG_BLOG';
export const GET_BLOG_TAG = 'GET_BLOG_TAG';
export const COUNT_CATEGORY_BLOG = 'COUNT_CATEGORY_BLOG';
export const GET_CATEGORY_BLOG = 'GET_CATEGORY_BLOG';
export const GET_BLOG_CATEGORY = 'GET_BLOG_CATEGORY';

// user
export const LOG_IN_START = 'LOG_START';
export const LOG_IN = 'LOG_IN';
export const LOG_IN_END = 'LOG_OUT_END';
export const LOG_IN_ERROR = 'LOG_IN_ERROR';
export const REGISTER_START = 'REGISTER_START';
export const REGISTER = 'REGISTER';
export const REGISTER_END = 'REGISTER_END';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_STORE = 'REGISTER_STORE';
export const LOG_OUT = 'LOG_OUT';
export const ALERT_PASSWORD = 'ALERT_PASSWORD';
export const UPLOAD_PIC_ERROR = 'UPLOAD_PIC_ERROR';
export const GET_EMAIL_SUBSCRIBE = 'GET_EMAIL_SUBSCRIBE';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const ALERT_RESET_PASSWORD = 'ALERT_RESET_PASSWORD';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';
export const EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';

// profile
export const GET_STORE = 'GET_STORE';
export const GET_KTP = 'GET_KTP';
export const ALERT_KTP = 'ALERT_KTP';
export const GET_BANK_ACCOUNT = 'GET_BANK_ACCOUNT';
export const GET_USER = 'GET_USER';
export const GET_USER_ID = 'GET_USER_ID';
export const GET_ADDRESS = 'GET_ADDRESS';
export const GET_STORE_ADDRESS = 'GET_STORE_ADDRESS';
export const GET_MAIN_ADDRESS = 'GET_MAIN_ADDRESS';
export const GET_WISHLIST = 'GET_WISHLIST';
export const GET_UPDATE_BALANCE = 'GET_UPDATE_BALANCE';
export const GET_HISTORY_BALANCE = 'GET_HISTORY_BALANCE';

// Shipping
export const GET_PROVINCE = 'GET_PROVINCE';
export const GET_CITY = 'GET_CITY';
export const GET_SUBDISTRICT = 'GET_SUBDISTRICT';
export const CHECK_DELIVERY_FEE = 'CHECK_DELIVERY_FEE';
export const GET_ADMIN_COURIER = 'GET_ADMIN_COURIER';
export const GET_ADMIN_COURIER_ID = 'GET_ADMIN_COURIER_ID';
export const GET_STORE_COURIER = 'GET_STORE_COURIER';

/*authentication*/
import cookie from 'js-cookie';
// set cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1,
        });
    }
};

export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1,
        });
    }
};
// get cookie
export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key);
    }
};
// localstorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, value);
    }
};

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setCookie('id', data.id);
    setLocalStorage('token', data.token);
    setLocalStorage('id', data.id);
    setLocalStorage('role_id', data.role_id);
    next();
};

export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const role_id = localStorage.getItem('role_id');
        if (cookieChecked) {
            if (id && role_id && token) {
                return { id, role_id, token };
            } else {
                return false;
            }
        }
    }
};
