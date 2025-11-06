import {GET_TAG_PRODUCT} from '../../helpers'

const INITIAL_STATE = {
    tagProduct: [],
}
const tagProductReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_TAG_PRODUCT:
            return {
                ...state,
                tagProduct: action.payload.data
            }
        default:
            return state
    }
}

export default tagProductReducer