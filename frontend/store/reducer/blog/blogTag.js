import {GET_BLOG_TAG, COUNT_TAG_BLOG} from '../../helpers'

const INITIAL_STATE = {
    blogTag: [],
    countTagBlog: []
}
const blogTagReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_BLOG_TAG:
            return {
                ...state,
                blogTag: action.payload.data
            }
        case COUNT_TAG_BLOG:
            return {
                ...state,
                countTagBlog: action.payload.data
            }
        default:
            return state
    }
}

export default blogTagReducer