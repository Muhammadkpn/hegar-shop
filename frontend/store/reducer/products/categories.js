import { GET_CATEGORY_PRODUCT, GET_CATEGORY_CHILD_PRODUCT } from '../../helpers';

const INITIAL_STATE = {
    categoryProduct: [],
    categoryChild: [],
};

const categoryProductReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CATEGORY_PRODUCT:
            return {
                ...state,
                categoryProduct: action.payload.data,
            };
        case GET_CATEGORY_CHILD_PRODUCT:
            return {
                ...state,
                categoryChild: action.payload.data,
            };
        default:
            return state;
    }
};

export default categoryProductReducer;
