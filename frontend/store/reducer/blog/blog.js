import { GET_BLOG, GET_BLOG_DETAILS, GET_OTHERS_BLOG, GET_POPULAR, GET_ADMIN_BLOG } from '../../helpers';

const INITIAL_STATE = {
    blog: [],
    blogAdmin: [],
    blogDetails: [],
    othersBlog: [],
    popular: [],
};

const blogReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_BLOG:
            return {
                ...state,
                blog: action.payload.data,
            };
        case GET_ADMIN_BLOG:
            return {
                ...state,
                blogAdmin: action.payload.data,
            };
        case GET_BLOG_DETAILS:
            return {
                ...state,
                blogDetails: action.payload.data,
            };
        case GET_OTHERS_BLOG:
            return {
                ...state,
                othersBlog: action.payload.data,
            };
        case GET_POPULAR:
            return {
                ...state,
                popular: action.payload.data,
            };
        default:
            return state;
    }
};

export default blogReducer;
