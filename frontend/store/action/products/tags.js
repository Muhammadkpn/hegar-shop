import {URL, GET_TAG_PRODUCT} from '../../helpers'
import Axios from 'axios'


export const getTagProduct = (query = '') => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/tags?${query}`)
            dispatch({type: GET_TAG_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addTagProduct = (body) => {
    return async(dispatch) => {
        try {
            await Axios.post(`${URL}/products/tags`, body)
            const result = await Axios.get(`${URL}/products/tags`)
            dispatch({type: GET_TAG_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const editTagProduct = (body, id) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/products/tags/${id}`, body)
            const result = await Axios.get(`${URL}/products/tags`)
            dispatch({type: GET_TAG_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const deleteTagProduct = (id) => {
    return async(dispatch) => {
        try {
            await Axios.delete(`${URL}/products/tags/${id}`)
            const result = await Axios.get(`${URL}/products/tags`)
            dispatch({type: GET_TAG_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}