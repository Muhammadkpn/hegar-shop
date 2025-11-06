import { GET_MAIN_ADDRESS, GET_ADDRESS, GET_STORE_ADDRESS } from '../../helpers';

const INITIAL_STATE = {
    mainAddress: [],
    address: [],
    storeAddress: [],
};

const addressReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_MAIN_ADDRESS:
            return {
                ...state,
                mainAddress: action.payload.data,
            };
        case GET_ADDRESS:
            return {
                ...state,
                address: action.payload.data,
            };
        case GET_STORE_ADDRESS:
            return {
                ...state,
                storeAddress: action.payload.data,
            };
        default:
            return state;
    }
};

export default addressReducer;
