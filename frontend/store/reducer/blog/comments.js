import {GET_COMMENTS, GET_COMMENTS_ADMIN} from '../../helpers'

const INITIAL_STATE = {
    comments: [],
    commentsAdmin: [],
}

const commentReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_COMMENTS:
            return {
                ...state, comments: action.payload.data
            }
        case GET_COMMENTS_ADMIN:
            return {
                ...state, commentsAdmin: action.payload.data
            }
        default: 
            return state
    }
}

export default commentReducer