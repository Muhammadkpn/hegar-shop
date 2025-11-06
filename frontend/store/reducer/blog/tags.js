import {GET_TAG_BLOG} from '../../helpers'

const INITIAL_STATE = {
    tagBlog: [],
}
const tagBlogReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_TAG_BLOG:
            return {
                ...state,
                tagBlog: action.payload.data
            }
        default:
            return state
    }
}

export default tagBlogReducer