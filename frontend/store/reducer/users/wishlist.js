import {GET_WISHLIST} from '../../helpers'

const INITIAL_STATE = {
    wishlist: []
}

const wishlistReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_WISHLIST:
            return { ...state, wishlist: action.payload.data}
        default: 
            return state
    }
}

export default wishlistReducer