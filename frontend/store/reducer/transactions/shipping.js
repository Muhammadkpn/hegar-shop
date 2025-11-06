import {
    GET_PROVINCE,
    GET_CITY,
    GET_SUBDISTRICT,
    CHECK_DELIVERY_FEE,
    GET_ADMIN_COURIER,
    GET_ADMIN_COURIER_ID,
    GET_STORE_COURIER,
} from '../../helpers';

const INITIAL_STATE = {
    province: [],
    city: [],
    subdistrict: [],
    deliveryFee: [],
    adminCourier: [],
    adminCourierId: {},
    storeCourier: [],
};

const shippingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_PROVINCE:
            return {
                ...state,
                province: action.payload.data,
            };
        case GET_CITY:
            return {
                ...state,
                city: action.payload.data,
            };
        case GET_SUBDISTRICT:
            return {
                ...state,
                subdistrict: action.payload.data,
            };
        case CHECK_DELIVERY_FEE:
            return {
                ...state,
                deliveryFee: action.payload.data,
            };
        case GET_ADMIN_COURIER:
            return {
                ...state,
                adminCourier: action.payload.data,
            };
        case GET_ADMIN_COURIER_ID:
            return {
                ...state,
                adminCourierId: action.payload.data,
            };
        case GET_STORE_COURIER:
            return {
                ...state,
                storeCourier: action.payload.data,
            };
        default:
            return state;
    }
};

export default shippingReducer;
