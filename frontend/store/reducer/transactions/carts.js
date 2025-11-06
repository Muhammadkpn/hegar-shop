import { GET_CART, ERROR_CART } from '../../helpers';

const INITIAL_STATE = {
    cart: [],
    error_cart: '',
};

const cartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CART:
            return {
                ...state,
                cart: action.payload.data ? action.payload.data : [],
                error_cart: '',
            };
        case ERROR_CART:
            return {
                ...state,
                error_cart: action.payload.message,
            };
        default:
            return state;
    }
};

export default cartReducer;
