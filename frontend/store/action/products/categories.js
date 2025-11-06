import { URL, GET_CATEGORY_PRODUCT, GET_CATEGORY_CHILD_PRODUCT } from '../../helpers';
import Axios from 'axios';

export const getCategoryProduct = (query = '') => {
    return async (dispatch) => {
        try {
            const getCategory = await Axios.get(`${URL}/products/categories?${query}`);
            dispatch({ type: GET_CATEGORY_PRODUCT, payload: getCategory.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getCategoryChildProduct = () => {
    return async (dispatch) => {
        try {
            const getCategory = await Axios.get(`${URL}/products/categories/child`);
            dispatch({ type: GET_CATEGORY_CHILD_PRODUCT, payload: getCategory.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addCategoryProduct = (body) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/products/categories`, body);

            const getCategory = await Axios.get(`${URL}/products/categories`);
            dispatch({ type: GET_CATEGORY_PRODUCT, payload: getCategory.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editCategoryProduct = (body, id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/products/categories/${id}`, body);

            const getCategory = await Axios.get(`${URL}/products/categories`);
            dispatch({ type: GET_CATEGORY_PRODUCT, payload: getCategory.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteCategoryProduct = (id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/products/categories/${id}`);

            const getCategory = await Axios.get(`${URL}/products/categories`);
            dispatch({ type: GET_CATEGORY_PRODUCT, payload: getCategory.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
