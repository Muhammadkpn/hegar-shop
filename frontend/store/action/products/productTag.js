import {URL, GET_PRODUCT_TAG, COUNT_TAG_PRODUCT, GET_PRODUCT_STORE} from '../../helpers'
import Axios from 'axios'

export const getProductTag = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/product-tag`)
            dispatch({type: GET_PRODUCT_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getCountTagProduct = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/product-tag/count`)
            dispatch({type: COUNT_TAG_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getCountTagProductByStore = (store_id) => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/product-tag/count/store/${store_id}`)
            dispatch({type: COUNT_TAG_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addProductTag = (body) => {
    return async(dispatch) => {
        try {
            await Axios.post(`${URL}/products/product-tag`, body)
            
            const result = await Axios.get(`${URL}/products/product-tag`)
            dispatch({type: GET_PRODUCT_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const editProductTag = (body, id) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/products/product-tag/${id}`, body)
            const result = await Axios.get(`${URL}/products/product-tag`)
            dispatch({type: GET_PRODUCT_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const editProductTagByStore = (body, product_id, store_id) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/products/product-tag/store/${product_id}`, body)
            const result = await Axios.get(`${URL}/products/product-tag`)
            dispatch({type: GET_PRODUCT_TAG, payload: result.data})

            const getProductStore = await Axios.get(`${URL}/products/store/${store_id}`)
            dispatch({type: GET_PRODUCT_STORE, payload: getProductStore.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const deleteProductTag = (id) => {
    return async(dispatch) => {
        try {
            await Axios.delete(`${URL}/products/product-tag/${id}`)
            const result = await Axios.get(`${URL}/products/product-tag`)
            dispatch({type: GET_PRODUCT_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}