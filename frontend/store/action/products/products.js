import {
    URL,
    GET_PRODUCT,
    GET_PRODUCT_DETAILS,
    GET_PRODUCT_IMAGE,
    GET_PRODUCT_STORE,
    GET_PRODUCT_ADMIN,
    GET_PRODUCT_CATEGORY,
    GET_PRODUCT_TAG,
    GET_NEW_PRODUCT,
    GET_PRODUCT_DISCOUNT,
    GET_SEARCH_PRODUCT,
    RESET_SEARCH_PRODUCT,
    GET_SEARCH_BANNER,
    RESET_SEARCH_BANNER
} from '../../helpers';
import Axios from 'axios';

export const getProduct = (query = '') => {
    return async (dispatch) => {
        try {
            const getProduct = await Axios.get(`${URL}/products?${query}`);
            dispatch({ type: GET_PRODUCT, payload: getProduct.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getSearchProduct = (type, search='', category='') => {
    return async (dispatch) => {
        try {
            if (type === 'navbar-search') {
                if(search) {
                    const getSearchProduct = await Axios.get(`${URL}/products?search=${search}`);
                    dispatch({ type: GET_SEARCH_PRODUCT, payload: getSearchProduct.data });
                } else {
                    dispatch({ type: RESET_SEARCH_PRODUCT })
                }
            } else {
                if(search) {
                    const getSearchProduct = await Axios.get(`${URL}/products?search=${search}&category=${category}`);
                    dispatch({ type: GET_SEARCH_BANNER, payload: getSearchProduct.data });
                } else {
                    dispatch({ type: RESET_SEARCH_BANNER })
                }
            }
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getNewProduct = () => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products?_sort=p.released_date&_order=DESC`);
            dispatch({ type: GET_NEW_PRODUCT, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getProductDiscount = () => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products?_sort=discount&_order=DESC`);
            dispatch({ type: GET_PRODUCT_DISCOUNT, payload: result.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getProductDetails = (id) => {
    return async (dispatch) => {
        try {
            const getProductDetails = await Axios.get(`${URL}/products/details/${id}`);
            dispatch({ type: GET_PRODUCT_DETAILS, payload: getProductDetails.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getProductStore = (id, type = '') => {
    return async (dispatch) => {
        try {
            const getProductStore = await Axios.get(`${URL}/products/store/${id}?${type}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getProductAdmin = (query = '') => {
    return async (dispatch) => {
        try {
            const getProductAdmin = await Axios.get(`${URL}/products/admin?${query}`);
            dispatch({ type: GET_PRODUCT_ADMIN, payload: getProductAdmin.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addProduct = (body, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/products`, body);

            const getProductStore = await Axios.get(`${URL}/products/store/${user_id}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addProductStore = (product, image, category, tag, store_id) => {
    const option = {
        header: {
            'Content-type': 'multipart/form-data',
        },
    };

    return async (dispatch) => {
        const { formData, params } = image;
        try {
            await Axios.post(`${URL}/products`, product);
            await Axios.post(`${URL}/products/images/${params}`, formData, option);
            await Axios.post(`${URL}/products/product-category`, category);
            await Axios.post(`${URL}/products/product-tag`, tag);

            const getProductStore = await Axios.get(`${URL}/products/store/${store_id}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });

            const getImage = await Axios.get(`${URL}/products/images`);
            dispatch({ type: GET_PRODUCT_IMAGE, payload: getImage.data });

            const getProductCategory = await Axios.get(`${URL}/products/product-category`);
            dispatch({ type: GET_PRODUCT_CATEGORY, payload: getProductCategory.data });

            const getProductTag = await Axios.get(`${URL}/products/product-tag`);
            dispatch({ type: GET_PRODUCT_TAG, payload: getProductTag.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editProduct = (body, product_id, store_id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/products/${product_id}`, body);

            const getProductAdmin = await Axios.get(`${URL}/products/admin`);
            dispatch({ type: GET_PRODUCT_ADMIN, payload: getProductAdmin.data });

            const getProductStore = await Axios.get(`${URL}/products/store/${store_id}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteProduct = (product_id, user_id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/products/${product_id}`);

            const getProductStore = await Axios.get(`${URL}/products/store/${user_id}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const getProductImage = (query = '') => {
    return async (dispatch) => {
        try {
            const getImage = await Axios.get(`${URL}/products/images?${query}`);
            dispatch({ type: GET_PRODUCT_IMAGE, payload: getImage.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const addProductImage = (product_id, store_id, data) => {
    const option = {
        header: {
            'Content-type': 'multipart/form-data',
        },
    };

    return async (dispatch) => {
        try {
            await Axios.post(`${URL}/products/images/${product_id}`, data, option);

            const getImage = await Axios.get(`${URL}/products/images`);
            dispatch({ type: GET_PRODUCT_IMAGE, payload: getImage.data });

            const getProductStore = await Axios.get(`${URL}/products/store/${store_id}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const editProductImage = (id, body) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/products/images/${id}`, body);

            const getImage = await Axios.get(`${URL}/products/images`);
            dispatch({ type: GET_PRODUCT_IMAGE, payload: getImage.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};

export const deleteProductImage = (image_id, store_id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/products/images/${image_id}`);

            const getImage = await Axios.get(`${URL}/products/images`);
            dispatch({ type: GET_PRODUCT_IMAGE, payload: getImage.data });

            const getProductStore = await Axios.get(`${URL}/products/store/${store_id}`);
            dispatch({ type: GET_PRODUCT_STORE, payload: getProductStore.data });
        } catch (error) {
            console.log(error.response ? error.response.data : error);
        }
    };
};
