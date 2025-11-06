import {GET_PRODUCT_TAG, COUNT_TAG_PRODUCT} from '../../helpers'

const INITIAL_STATE = {
    productTag: [],
    countTagProduct: []
}
const productTagReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_PRODUCT_TAG:
            return {
                ...state,
                productTag: action.payload.data
            }
        case COUNT_TAG_PRODUCT:
            return {
                ...state,
                countTagProduct: action.payload.data
            }
        default:
            return state
    }
}

export default productTagReducer