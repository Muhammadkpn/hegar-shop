import { GET_ORDER, GET_HISTORY, ERROR_CHECKOUT, UPLOAD_PAYMENT_ERROR, GET_PAYMENT } from "../../helpers";

const INITIAL_STATE = {
  checkout: [],
  errorUpload: null,
  errorCheckout: null,
  payment: [],
  history: []
};

const transactionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ORDER:
      return {
        ...state,
        checkout: action.payload.data,
      };
    case GET_HISTORY:
      return {
        ...state,
        history: action.payload.data,
      };
    case UPLOAD_PAYMENT_ERROR:
      return { ...state, errorUpload: action.payload.data };
    case ERROR_CHECKOUT:
      return { ...state, errorCheckout: action.payload.data };
    case GET_PAYMENT:
      return { ...state, payment: action.payload.data };
    default:
      return state;
  }
};

export default transactionReducer;
