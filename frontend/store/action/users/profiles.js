import {
    URL,
    GET_STORE,
    GET_BANK_ACCOUNT,
    UPLOAD_PIC_ERROR,
    GET_UPDATE_BALANCE,
    GET_HISTORY_BALANCE,
    GET_KTP,
    ALERT_KTP,
    GET_USER_ID,
} from '../../helpers';
import Axios from 'axios';

export const getStore = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/profiles/stores/${id}`);
            dispatch({ type: GET_STORE, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const regisStore = (body, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/users/profiles/stores`, body);

            const result = await Axios.get(`${URL}/users/profiles/stores/${user_id}`);
            dispatch({ type: GET_STORE, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editStore = (body, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/profiles/stores/${user_id}`, body);

            const result = await Axios.get(`${URL}/users/profiles/stores/${user_id}`);
            dispatch({ type: GET_STORE, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getKtp = (query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/profiles/ktp?${query}`);
            dispatch({ type: GET_KTP, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getKtpById = (id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/profiles/ktp/${id}`);
            dispatch({ type: GET_KTP, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editKtp = (body, id, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/profiles/ktp/${id}`, body);

            if (user_id) {
                // get ktp
                const getKtp = await Axios.get(`${URL}/users/profiles/ktp/${user_id}`);
                dispatch({ type: GET_KTP, payload: getKtp.data });
            } else {
                // get ktp
                const getKtp = await Axios.get(`${URL}/users/profiles/ktp`);
                dispatch({ type: GET_KTP, payload: getKtp.data });
            }
            dispatch({ type: ALERT_KTP, payload: '' });
        } catch (error) {
            dispatch({ type: ALERT_KTP, payload: error.response.data });
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editKtpStatus = (body, id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/profiles/ktp/status/${id}`, body);
            
            // get ktp
            const getKtp = await Axios.get(`${URL}/users/profiles/ktp`);
            dispatch({ type: GET_KTP, payload: getKtp.data });
            dispatch({ type: ALERT_KTP, payload: '' });
        } catch (error) {
            dispatch({ type: ALERT_KTP, payload: error.response.data });
            console.log(error.response ? error.response.data : error);
        }
    };
};

// upload image for photo profile, ktp, and rekening
export const uploadPic = (type, data) => {
    return async (dispatch) => {
        const option = {
            header: {
                'Content-type': 'multipart/form-data',
            },
        };
        const id = localStorage.getItem('id');
        try {
            await Axios.post(URL + `/users/profiles/upload/${type}/${id}`, data, option);

            const res = await Axios.get(URL + `/users/${id}`);
            dispatch({ type: GET_USER_ID, payload: res.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
            dispatch({ type: UPLOAD_PIC_ERROR, payload: error.response.data });
            if (type === 'ktp') {
                dispatch({ type: ALERT_KTP, payload: error.response.data });
            }
        }
    };
};

export const getBankAccount = (query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/profiles/bank-account?${query}`);
            dispatch({ type: GET_BANK_ACCOUNT, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getBankAccountByUser = (user_id, query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(
                `${URL}/users/profiles/bank-account/${user_id}?${query}`
            );
            dispatch({ type: GET_BANK_ACCOUNT, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addBankAccount = (body, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/users/profiles/bank-account`, body);

            // get bank account
            const getBankAccount = await Axios.get(`${URL}/users/profiles/bank-account/${user_id}`);
            dispatch({ type: GET_BANK_ACCOUNT, payload: getBankAccount.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editBankAccount = (body, id, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/profiles/bank-account/${id}`, body);

            if (user_id) {
                // get bank account by user
                const getBankAccount = await Axios.get(
                    `${URL}/users/profiles/bank-account/${user_id}`
                );
                dispatch({ type: GET_BANK_ACCOUNT, payload: getBankAccount.data });
            } else {
                // get bank account
                const getBankAccount = await Axios.get(`${URL}/users/profiles/bank-account`);
                dispatch({ type: GET_BANK_ACCOUNT, payload: getBankAccount.data });
            }
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteBankAccount = (id, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/users/profiles/bank-account/${id}`);

            // get bank account
            const getBankAccount = await Axios.get(
                `${URL}/users/profiles/bank-account/${user_id}?type=get`
            );
            dispatch({ type: GET_BANK_ACCOUNT, payload: getBankAccount.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getUpdatedBalance = (user_id) => {
    return async (dispatch) => {
        try {
            const getUpdatedBalance = await Axios.get(
                `${URL}/users/profiles/balance/updated/${user_id}`
            );
            dispatch({ type: GET_UPDATE_BALANCE, payload: getUpdatedBalance.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getHistoryBalance = (query = '') => {
    return async (dispatch) => {
        try {
            const getHistoryBalance = await Axios.get(
                `${URL}/users/profiles/balance/history?${query}`
            );
            dispatch({ type: GET_HISTORY_BALANCE, payload: getHistoryBalance.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getHistoryBalanceByUser = (user_id, query = '') => {
    return async (dispatch) => {
        try {
            const getHistoryBalance = await Axios.get(
                `${URL}/users/profiles/balance/history/${user_id}?${query}`
            );
            dispatch({ type: GET_HISTORY_BALANCE, payload: getHistoryBalance.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const updateBalance = (body, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/users/profiles/balance/${user_id}`, body);

            // result of top up balance
            const getUpdatedBalance = await Axios.get(
                `${URL}/users/profiles/balance/updated/${user_id}`
            );
            dispatch({ type: GET_UPDATE_BALANCE, payload: getUpdatedBalance.data });

            // result of history balance
            const getHistoryBalance = await Axios.get(
                `${URL}/users/profiles/balance/history/${user_id}`
            );
            dispatch({ type: GET_HISTORY_BALANCE, payload: getHistoryBalance.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editStatusBalance = (body, balance_id, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/users/profiles/balance/${balance_id}`, body);

            if (user_id) {
                // result of top up balance
                const getUpdatedBalance = await Axios.get(
                    `${URL}/users/profiles/balance/updated/${user_id}`
                );
                dispatch({ type: GET_UPDATE_BALANCE, payload: getUpdatedBalance.data });

                // result of history balance
                const getHistoryBalance = await Axios.get(
                    `${URL}/users/profiles/balance/history/${user_id}`
                );
                dispatch({ type: GET_HISTORY_BALANCE, payload: getHistoryBalance.data });
            } else {
                // result of history balance
                const getHistoryBalance = await Axios.get(`${URL}/users/profiles/balance/history`);
                dispatch({ type: GET_HISTORY_BALANCE, payload: getHistoryBalance.data });
            }
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
