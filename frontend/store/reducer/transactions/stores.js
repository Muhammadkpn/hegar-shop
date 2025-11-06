import { GET_SALES_SUMMARY, GET_SALES_EARNINGS, GET_SALES_CHARTS } from "../../helpers";

const INITIAL_STATE = {
  salesSummary: [],
  salesEarnings: [],
  salesCharts: []
};

const storeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SALES_SUMMARY:
      return {
        ...state,
        salesSummary: action.payload.data,
      };
    case GET_SALES_EARNINGS:
      return {
        ...state,
        salesEarnings: action.payload.data,
      };
    case GET_SALES_CHARTS:
      return {
        ...state,
        salesCharts: action.payload.data,
      };
    default:
      return state;
  }
};

export default storeReducer;
