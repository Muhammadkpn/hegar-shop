import {GET_PRODUCT_REVIEW, ERROR_UPLOAD_REVIEW} from "../../helpers"

const INITIAL_STATE ={
   productReview: [],
   errorUploadReview: ''
}

const productReviewReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case GET_PRODUCT_REVIEW:
            return {
                ...state,
                productReview: action.payload.data
            }
        case ERROR_UPLOAD_REVIEW:
            return {
                ...state,
                errorUploadReview: action.payload.data
            }
        default:
            return state
    }
}

export default productReviewReducer