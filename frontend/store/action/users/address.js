import { URL, GET_ADDRESS, GET_MAIN_ADDRESS, GET_STORE_ADDRESS } from '../../helpers';
import Axios from 'axios';

export const getMainAddress = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/address/main-address/${id}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getAddress = (type, id, filter = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(
                `${URL}/users/address/${id}?${type ? type : 'type=user-id'}&${
                    filter ? `${filter}` : ''
                }`
            );
            dispatch({ type: GET_ADDRESS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addAddress = (body) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/users/address`, body);

            const result1 = await Axios.get(`${URL}/users/address/main-address/${body.userId}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/users/address/${body.userId}?type=user-id`);
            dispatch({ type: GET_ADDRESS, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editAddress = (body, user_id, id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/address/${id}`, body);

            const result1 = await Axios.get(`${URL}/users/address/${user_id}?type=user-id`);
            dispatch({ type: GET_ADDRESS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/users/address/main-address/${user_id}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteAddress = (user_id, id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/users/address/${id}`);

            const result = await Axios.get(`${URL}/users/address/${user_id}?type=user-id`);
            dispatch({ type: GET_ADDRESS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getStoreAddress = (id, query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/address/stores/${id}?${query}`);
            dispatch({ type: GET_STORE_ADDRESS, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addStoreAddress = (body, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/users/address/stores`, body);

            const result1 = await Axios.get(`${URL}/users/address/stores/${user_id}`);
            dispatch({ type: GET_STORE_ADDRESS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/users/profiles/stores/${user_id}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editStoreAddress = (body, user_id, id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/address/stores/${id}`, body);

            const result1 = await Axios.get(`${URL}/users/address/stores/${user_id}`);
            dispatch({ type: GET_STORE_ADDRESS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/users/profiles/stores/${user_id}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteStoreAddress = (user_id, id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/users/address/stores/${id}`);

            const result1 = await Axios.get(`${URL}/users/address/stores/${user_id}`);
            dispatch({ type: GET_STORE_ADDRESS, payload: result1.data });

            const result2 = await Axios.get(`${URL}/users/profiles/stores/${user_id}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result2.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
