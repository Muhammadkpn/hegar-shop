import {
    GET_BANK_ACCOUNT,
    UPLOAD_PIC_ERROR,
    GET_UPDATE_BALANCE,
    GET_HISTORY_BALANCE,
    GET_KTP,
    GET_STORE,
    ALERT_KTP
} from '../../helpers';

const INITIAL_STATE = {
    stores: [],
    ktp: [],
    bankAccount: [],
    error: '',
    balance: {},
    historyBalance: [],
    alertKtp: '',
};

const profileReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_STORE:
            return {
                ...state,
                stores: action.payload.data,
            };
        case GET_KTP:
            return {
                ...state,
                ktp: action.payload.data,
            };
        case GET_BANK_ACCOUNT:
            return {
                ...state,
                bankAccount: action.payload.data,
            };
        case UPLOAD_PIC_ERROR:
            return {
                ...state,
                error: action.payload.data,
            };
        case GET_UPDATE_BALANCE:
            return {
                ...state,
                balance: action.payload.data,
            };
        case GET_HISTORY_BALANCE:
            return {
                ...state,
                historyBalance: action.payload.data,
            };
        case ALERT_KTP:
            return {
                ...state,
                alertKtp: action.payload.message,
            };
        default:
            return state;
    }
};

export default profileReducer;
