import {GET_BLOG_CATEGORY, COUNT_CATEGORY_BLOG} from '../../helpers'

const INITIAL_STATE = {
    blogCategory: [],
    countCategory: []
}
const blogCategoryReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case GET_BLOG_CATEGORY:
            return {
                ...state,
                blogCategory: action.payload.data
            }
        case COUNT_CATEGORY_BLOG:
            return {
                ...state,
                countCategory: action.payload.data
            }
        default:
            return state
    }
}

export default blogCategoryReducer