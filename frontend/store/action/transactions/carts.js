import { URL, ADD_TO_CART, GET_CART, ERROR_CART } from '../../helpers';
import Axios from 'axios';

export const getCart = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/transactions/carts/${id}`);
            dispatch({ type: GET_CART, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteCart = (id, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/transactions/carts/${id}`);
            const cart = await Axios.get(`${URL}/transactions/carts/${user_id}`);
            dispatch({ type: GET_CART, payload: cart.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editCart = (body, id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/transactions/carts/${id}`, body);
            const cart = await Axios.get(`${URL}/transactions/carts/${body.userId}`);
            dispatch({ type: GET_CART, payload: cart.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: ERROR_CART, payload: error.response?.data || error });
        }
    };
};

export const addToCart = (body) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/transactions/carts`, body);

            const result = await Axios.get(`${URL}/transactions/carts/${body.userId}`);
            dispatch({ type: GET_CART, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: ERROR_CART, payload: error.response?.data || error });
        }
    };
};
