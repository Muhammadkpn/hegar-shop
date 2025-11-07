import {URL, GET_PRODUCT_REVIEW, ERROR_UPLOAD_REVIEW} from '../../helpers'
import Axios from 'axios'

export const getProductReview = (id, type='') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/reviews/${id}?${type}`)
            dispatch({type: GET_PRODUCT_REVIEW, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addProductReview = (id, review_id, body) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/products/reviews/${review_id}`, body)

            const result = await Axios.get(`${URL}/products/reviews/${id}?type=user-id`)
            dispatch({type: GET_PRODUCT_REVIEW, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const editProductReview = (body, id, product_id) => {
    return async (dispatch) => {
        try {
            await Axios.patch(`${URL}/products/reviews/edit/${id}`, body)

            const result = await Axios.get(`${URL}/products/reviews/${product_id}?type=product-id`)
            dispatch({type: GET_PRODUCT_REVIEW, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const deleteProductReview = (id, product_id) => {
    return async (dispatch) => {
        try {
            await Axios.delete(`${URL}/products/reviews/${id}`)

            const result = await Axios.get(`${URL}/products/reviews/${product_id}?type=product-id`)
            dispatch({type: GET_PRODUCT_REVIEW, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const uploadReview = (data, id) => {                                                                                                                                                                                                                         
    return async (dispatch) => {
        const option = {
            header: {
                'Content-type': 'multipart/form-data'
            }
        }
        try {
            await Axios.post(URL + `/products/reviews/review-upload/${id}`, data, option)
        } catch (error) {
            console.log(error.response ? error.response.data : error)
            dispatch({ type: ERROR_UPLOAD_REVIEW, payload: error.response?.data || error })
        }
    }
}

