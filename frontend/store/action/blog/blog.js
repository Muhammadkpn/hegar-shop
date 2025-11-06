import { URL, GET_BLOG, GET_ADMIN_BLOG, GET_BLOG_DETAILS, GET_OTHERS_BLOG, GET_POPULAR } from '../../helpers';
import Axios from 'axios';

export const getAllBlog = (query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog?${query}`);
            dispatch({ type: GET_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getAdminBlog = (query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/admin?${query}`);
            dispatch({ type: GET_ADMIN_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getBlogDetails = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/details/${id}`);
            dispatch({ type: GET_BLOG_DETAILS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getOthersBlog = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/others/${id}`);
            dispatch({ type: GET_OTHERS_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getPopularBlog = () => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/popular`);
            dispatch({ type: GET_POPULAR, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const countView = (blog_id) => {
    return async (dispatch) => {
        try {
            const addView = `${URL}/blog/count-view/${blog_id}`;
            await Axios.post(addView);

            const result = await Axios.get(`${URL}/blog/details/${id}`);
            dispatch({ type: GET_BLOG_DETAILS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    }
}

export const addBlog = (bodyBlog, bodyCategory, bodyTag) => {
    const option = {
        header: {
            'Content-type': 'multipart/form-data',
        },
    };

    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/blog`, bodyBlog, option);
            await Axios.post(`${URL}/blog/blog-category`, bodyCategory);
            await Axios.post(`${URL}/blog/blog-tag`, bodyTag);

            const result = await Axios.get(`${URL}/blog/admin`);
            dispatch({ type: GET_ADMIN_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editBlog = (body, id) => {
    const option = {
        header: {
            'Content-type': 'multipart/form-data',
        },
    };
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/${id}`, body, option);

            const result1 = await Axios.get(`${URL}/blog`);
            dispatch({ type: GET_BLOG, payload: result1.data });

            const result2 = await Axios.get(`${URL}/blog/admin`);
            dispatch({ type: GET_ADMIN_BLOG, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editBlogImage = (body, id) => {
    const option = {
        header: {
            'Content-type': 'multipart/form-data',
        },
    };
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/image/${id}`, body, option);

            const result1 = await Axios.get(`${URL}/blog`);
            dispatch({ type: GET_BLOG, payload: result1.data });

            const result2 = await Axios.get(`${URL}/blog/admin`);
            dispatch({ type: GET_ADMIN_BLOG, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteBlog = (id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/blog/${id}`);
            const result = await Axios.get(`${URL}/blog`);
            dispatch({ type: GET_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
