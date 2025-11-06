import Axios from 'axios';
import {
    URL,
    GET_PROVINCE,
    GET_CITY,
    GET_SUBDISTRICT,
    CHECK_DELIVERY_FEE,
    GET_ADMIN_COURIER,
    GET_STORE_COURIER,
    GET_ADMIN_COURIER_ID,
} from '../../helpers';

export const getProvince = (query = '') => {
    return async (dispatch) => {
        try {
          const getProvince = await Axios.get(`${URL}/transactions/shipping/province?${query}`);
          dispatch({ type: GET_PROVINCE, payload: getProvince.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getCity = (query = '') => {
    return async (dispatch) => {
        try {
          const getCity = await Axios.get(`${URL}/transactions/shipping/city?${query}`);
          dispatch({ type: GET_CITY, payload: getCity.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getSubdistrict = (query = '') => {
    return async (dispatch) => {
        try {
          const getSubdistrict = await Axios.get(`${URL}/transactions/shipping/subdistrict?${query}`);
          dispatch({ type: GET_SUBDISTRICT, payload: getSubdistrict.data });
        } catch (error) {
          console.log(error.response ? error.response.data : error);
        }
    };
};

export const checkDeliveryFee = (body) => {
  return async (dispatch) => {
    try {
      const checkDeliveryFee = await Axios.post(`${URL}/transactions/shipping/cost`, body)
      dispatch({ type: CHECK_DELIVERY_FEE, payload: checkDeliveryFee.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const getAdminCourier = (query = '') => {
  return async (dispatch) => {
    try {
      const getAdminCourier = await Axios.get(`${URL}/transactions/shipping/courier?${query}`);
      dispatch({ type: GET_ADMIN_COURIER, payload: getAdminCourier.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const getAdminCourierById = (id) => {
  return async (dispatch) => {
    try {
      const getAdminCourierById = await Axios.get(`${URL}/transactions/shipping/courier/${id}`);
      dispatch({ type: GET_ADMIN_COURIER_ID, payload: getAdminCourierById.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const addAdminCourier = (body) => {
  return async (dispatch) => {
    try {
      await Axios.post(`${URL}/transactions/shipping/courier`, body);

      // get update courier
      const getAdminCourier = await Axios.get(`${URL}/transactions/shipping/courier`);
      dispatch({ type: GET_ADMIN_COURIER, payload: getAdminCourier.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const editAdminCourier = (body, id) => {
  return async (dispatch) => {
    try {
      await Axios.patch(`${URL}/transactions/shipping/courier/${id}`, body);

      // get update courier
      const getAdminCourier = await Axios.get(`${URL}/transactions/shipping/courier`);
      dispatch({ type: GET_ADMIN_COURIER, payload: getAdminCourier.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const deleteAdminCourier = (id) => {
  return async (dispatch) => {
    try {
      await Axios.delete(`${URL}/transactions/shipping/courier/${id}`);

      // get update courier
      const getAdminCourier = await Axios.get(`${URL}/transactions/shipping/courier`);
      dispatch({ type: GET_ADMIN_COURIER, payload: getAdminCourier.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const getStoreCourier = (store_id, query = '') => {
  return async (dispatch) => {
    try {
      const getStoreCourier = await Axios.get(`${URL}/transactions/shipping/courier/store/${store_id}?${query}`);
      dispatch({ type: GET_STORE_COURIER, payload: getStoreCourier.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}

export const editStoreCourier = (body, store_id) => {
  return async (dispatch) => {
    try {
      console.log(body)
      await Axios.patch(`${URL}/transactions/shipping/courier/store/${store_id}`, body);

      // get update store courier
      const getStoreCourier = await Axios.get(`${URL}/transactions/shipping/courier/store/${store_id}`);
      dispatch({ type: GET_STORE_COURIER, payload: getStoreCourier.data });
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  }
}