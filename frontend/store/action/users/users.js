import {
    URL,
    LOG_IN_START,
    LOG_IN,
    LOG_IN_END,
    LOG_IN_ERROR,
    REGISTER_START,
    REGISTER,
    REGISTER_END,
    REGISTER_ERROR,
    LOG_OUT,
    authenticate,
    isAuth,
    GET_USER,
    ALERT_PASSWORD,
    GET_MAIN_ADDRESS,
    GET_STORE,
    REGISTER_STORE,
    GET_USER_ID,
    RESET_PASSWORD,
    RESET_PASSWORD_ERROR,
    ALERT_RESET_PASSWORD,
    EMAIL_VERIFICATION
} from '../../helpers';
import Axios from 'axios';
import Router from 'next/router';

export const userLogin = (body) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(URL + `/users/login`, body);
            const data = res.data.data;
            dispatch({ type: LOG_IN_START})

            dispatch({ type: LOG_IN, payload: res.data });

            authenticate(data, () => {
                if (isAuth() && isAuth().role_id == 1) {
                    Router.push(`/super-admin`);
                } else {
                    Router.push(`/`);
                }
            });
            dispatch({ type: LOG_IN_END })
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: LOG_IN_ERROR, payload: error.response?.data || error });
        }
    };
};

export const userRegister = (body) => {
    return async (dispatch) => {
        try {
            dispatch({ type: REGISTER_START });

            const res = await Axios.post(URL + `/users/register`, body);
            dispatch({ type: REGISTER, payload: res.data });

            
            const data = res.data.data;
            authenticate(data, () => {
                if (isAuth() && isAuth().role_id == 1) {
                    Router.push(`/super-admin`);
                } else {
                    Router.push(`/`);
                }
            });
            dispatch({ type: REGISTER_END });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: REGISTER_ERROR, payload: error.response?.data || error });
        }
    };
};

export const storeRegister = (body, id) => {
    return async (dispatch) => {
        try {
            const storeRegister = await Axios.post(`${URL}/users/register/store/${id}`, body);
            dispatch({ type: REGISTER_STORE, payload: storeRegister.data });

            localStorage.setItem('role_id', 2); 

            const result = await Axios.get(`${URL}/users/${id}`);
            dispatch({ type: GET_USER_ID, payload: result.data});
        } catch (error) {
            console.log(error.response ? error.response.data: error);
        }
    }
}

export const userKeepLogin = () => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            const resUser = await Axios.post(
                URL + '/users/keepLogin',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            dispatch({ type: LOG_IN, payload: resUser.data });
        } catch (error) {
            // auto log out when action get an error
            if (error.response?.data?.message === 'Token has expired' ||
                error.response?.data?.message === 'jwt expired' ||
                error.response?.status === 401) {
                localStorage.removeItem('id');
                localStorage.removeItem('token');
                localStorage.removeItem('role_id');
                dispatch({ type: LOG_OUT });
            }
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const userLogout = () => {
    return async (dispatch) => {
        try {
            await localStorage.clear();
            dispatch({ type: LOG_OUT });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const emailVerification = (body) => {
    return async (dispatch) => {
        try {
            const { token } = body;
            const result = await Axios.patch(
                `${URL}/users/verification/email`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            dispatch({ type: EMAIL_VERIFICATION, payload: result.data })
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    }
}

export const sendEmailResetPassword = (body) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/users/verification/reset-password/send-email`, body);
            dispatch({ type: ALERT_RESET_PASSWORD, payload: { message: '' } });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: ALERT_RESET_PASSWORD, payload: error.response?.data || error });
        }
    }
}

export const checkExpiredResetPassword = (body) => {
    return async (dispatch) => {
        try {
            const { token } = body;
            const result = await Axios.post(
                `${URL}/users/verification/reset-password/check-expired`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            dispatch({ type: RESET_PASSWORD, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: RESET_PASSWORD_ERROR, payload: error.response?.data || error });
        }
    }
}

export const editResetPassword = (body) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/reset-password`, body);
            dispatch({ type: ALERT_RESET_PASSWORD, payload: { message: '' } });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: ALERT_RESET_PASSWORD, payload: error.response?.data || error });
        }
    }
}

export const getUser = (query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users?${query}`);
            dispatch({ type: GET_USER, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getUserById = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/${id}`);
            dispatch({ type: GET_USER_ID, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editUser = (body, id, type) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/${id}`, body);

            if (type === 'users') {
                const result1 = await Axios.get(`${URL}/users/${id}`);
                dispatch({ type: GET_USER_ID, payload: result1.data });
            } else if (type === 'admin') {
                const result2 = await Axios.get(`${URL}/users?type=admin`);
                dispatch({ type: GET_USER, payload: result2.data });
            }

            const result3 = await Axios.get(`${URL}/users/address/main-address/${id}`);
            dispatch({ type: GET_MAIN_ADDRESS, payload: result3.data });

            const result4 = await Axios.get(`${URL}/users/profiles/stores/${id}`);
            dispatch({ type: GET_STORE, payload: result4.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editPassword = (body, id) => {
    return async (dispatch) => {
        try {
            const editPass = await Axios.patch(`${URL}/users/password/${id}`, body);
            dispatch({ type: ALERT_PASSWORD, payload: editPass.data });

            const result = await Axios.get(`${URL}/users/${id}?type=user-id`);
            dispatch({ type: GET_USER_ID, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: ALERT_PASSWORD, payload: error.response?.data || error });
        }
    };
};
