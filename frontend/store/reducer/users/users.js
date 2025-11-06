import {
    LOG_IN,
    LOG_IN_START,
    LOG_IN_END,
    LOG_IN_ERROR,
    REGISTER,
    REGISTER_START,
    REGISTER_END,
    REGISTER_ERROR,
    LOG_OUT,
    ALERT_PASSWORD,
    GET_USER,
    REGISTER_STORE,
    GET_USER_ID,
    RESET_PASSWORD,
    RESET_PASSWORD_ERROR,
    ALERT_RESET_PASSWORD,
    EMAIL_VERIFICATION,
} from '../../helpers';

const INITIAL_STATE = {
    id: null,
    username: '',
    email: '',
    image: '',
    role: null,
    errorLogin: '',
    errorReg: '',
    loadingLogin: false,
    loadingRegister: false,
    token: '',
    loadingGet: false,
    alertPassword: '',
    resetPassword: [],
    errorResetPassword: '',
    users: [],
    userById: {},
    emailSubscribe: [],
    emailConfirmation: {},
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                users: action.payload.data,
            };
        case GET_USER_ID:
            return {
                ...state,
                userById: action.payload.data,
            };
        case LOG_IN_START:
            return { ...state, loadingLogin: true };
        case LOG_IN:
            return {
                ...state,
                id: action.payload.data.id,
                username: action.payload.data.username,
                image: action.payload.data.image,
                email: action.payload.data.email,
                role: action.payload.data.role_id,
                token: action.payload.data.token,
                errorLogin: '',
            };
        case REGISTER_STORE:
            return { ...state, role: action.payload.data.role_id };
        case LOG_IN_END:
            return { ...state, loadingLogin: false };
        case LOG_IN_ERROR:
            return { ...state, errorLogin: action.payload.message, loadingLogin: false };
        case REGISTER_START:
            return { ...state, loadingRegister: true };
        case REGISTER:
            return {
                ...state,
                id: action.payload.data.id,
                username: action.payload.data.username,
                email: action.payload.data.email,
                role: action.payload.data.role_id,
                token: action.payload.data.token,
                errorReg: '',
            };
        case REGISTER_END:
            return { ...state, loadingRegister: false };
        case REGISTER_ERROR:
            return { ...state, errorReg: action.payload.message.errors, loadingRegister: false };
        case ALERT_PASSWORD:
            return { ...state, alertPassword: action.payload.message };
        case RESET_PASSWORD:
            return { ...state, resetPassword: action.payload.data, errorResetPassword: '' };
        case ALERT_RESET_PASSWORD:
            return { ...state, errorResetPassword: action.payload.message || '' };
        case RESET_PASSWORD_ERROR:
            return { ...state, resetPassword: action.payload.code };
        case EMAIL_VERIFICATION:
            return { ...state, emailConfirmation: action.payload.data };
        case LOG_OUT:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default userReducer;
