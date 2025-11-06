import {GET_PRODUCT_CATEGORY, COUNT_CATEGORY_PRODUCT} from "../../helpers"

const INITIAL_STATE ={
   productCategory: [],
   countCategoryProduct: []
}

const productCategoryReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case GET_PRODUCT_CATEGORY:
            return {
                ...state,
                productCategory: action.payload.data
            }
        case COUNT_CATEGORY_PRODUCT:
            return {
                ...state,
                countCategoryProduct: action.payload.data
            }
        default:
            return state
    }
}

export default productCategoryReducer