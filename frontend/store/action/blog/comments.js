import { URL, GET_COMMENTS, GET_COMMENTS_ADMIN } from '../../helpers';
import Axios from 'axios';

export const getCommentsByBlog = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/comments/${id}`);
            dispatch({ type: GET_COMMENTS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getCommentsAdmin = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/comments/admin/${id}`);
            dispatch({ type: GET_COMMENTS_ADMIN, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addComments = (body, blog_id) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/blog/comments`, body);

            const result1 = await Axios.get(`${URL}/blog/comments/${blog_id}`);
            dispatch({ type: GET_COMMENTS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/blog/comments/admin/${blog_id}`);
            dispatch({ type: GET_COMMENTS_ADMIN, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editComments = (body, comment_id, blog_id, query = '') => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/comments/${comment_id}?${query}`, body);
            const result1 = await Axios.get(`${URL}/blog/comments/${blog_id}`);
            dispatch({ type: GET_COMMENTS, payload: result1.data });
            
            const result2 = await Axios.get(`${URL}/blog/comments/admin/${blog_id}`);
            dispatch({ type: GET_COMMENTS_ADMIN, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteComments = (id, blog_id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/blog/comments/${id}`);
            const result1 = await Axios.get(`${URL}/blog/comments/${blog_id}`);
            dispatch({ type: GET_COMMENTS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/blog/comments/admin/${blog_id}`);
            dispatch({ type: GET_COMMENTS_ADMIN, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
