import {GET_CATEGORY_BLOG} from '../../helpers'

const INITIAL_STATE = {
    categoryBlog: [],
}
const categoryBlogReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_CATEGORY_BLOG:
            return {
                ...state,
                categoryBlog: action.payload.data
            }
        default:
            return state
    }
}

export default categoryBlogReducer;