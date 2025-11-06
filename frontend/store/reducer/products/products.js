import {
    GET_NEW_PRODUCT,
    GET_PRODUCT,
    GET_PRODUCT_ADMIN,
    GET_PRODUCT_DETAILS,
    GET_PRODUCT_DISCOUNT,
    GET_PRODUCT_IMAGE,
    GET_PRODUCT_STORE,
    GET_SEARCH_BANNER,
    GET_SEARCH_PRODUCT,
    RESET_SEARCH_BANNER,
    RESET_SEARCH_PRODUCT,
} from '../../helpers';

const INITIAL_STATE = {
    products: [],
    productDetails: [],
    productImage: [],
    productStore: [],
    productAdmin: [],
    newProducts: [],
    productDiscount: [],
    searchProducts: [],
    searchBanner: [],
};

const productReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_PRODUCT:
            return {
                ...state,
                products: action.payload.data,
            };
        case GET_SEARCH_PRODUCT:
            return {
                ...state,
                searchProducts: action.payload.data,
            };
        case RESET_SEARCH_PRODUCT:
            return {
                ...state,
                searchProducts: [],
            };
        case GET_SEARCH_BANNER:
            return {
                ...state,
                searchBanner: action.payload.data,
            };
        case RESET_SEARCH_BANNER:
            return {
                ...state,
                searchBanner: [],
            };
        case GET_NEW_PRODUCT:
            return {
                ...state,
                newProducts: action.payload.data,
            };
        case GET_PRODUCT_DISCOUNT:
            return {
                ...state,
                productDiscount: action.payload.data,
            };
        case GET_PRODUCT_DETAILS:
            return {
                ...state,
                productDetails: action.payload.data,
            };
        case GET_PRODUCT_IMAGE:
            return {
                ...state,
                productImage: action.payload.data,
            };
        case GET_PRODUCT_ADMIN:
            return {
                ...state,
                productAdmin: action.payload.data,
            };
        case GET_PRODUCT_STORE:
            return {
                ...state,
                productStore: action.payload.data,
            };
        default:
            return state;
    }
};

export default productReducer;
