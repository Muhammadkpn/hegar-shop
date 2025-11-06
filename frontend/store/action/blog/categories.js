import { URL, GET_CATEGORY_BLOG } from '../../helpers';
import Axios from 'axios';

export const getCategoryBlog = (query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/categories?${query}`);
            dispatch({ type: GET_CATEGORY_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addCategoryBlog = (body) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/blog/categories`, body);
            const result = await Axios.get(`${URL}/blog/categories`);
            dispatch({ type: GET_CATEGORY_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editCategoryBlog = (body, id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/categories/${id}`, body);
            const result = await Axios.get(`${URL}/blog/categories`);
            dispatch({ type: GET_CATEGORY_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteCategoryBlog = (id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/blog/categories/${id}`);

            const result = await Axios.get(`${URL}/blog/categories`);
            dispatch({ type: GET_CATEGORY_BLOG, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
