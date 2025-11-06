import {URL, GET_TAG_BLOG} from '../../helpers'
import Axios from 'axios'


export const getTagBlog = (query = '') => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/tags?${query}`)
            dispatch({type: GET_TAG_BLOG, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addTagBlog = (body) => {
    return async(dispatch) => {
        try {
            await Axios.post(`${URL}/blog/tags`, body)
            const result = await Axios.get(`${URL}/blog/tags`)
            dispatch({type: GET_TAG_BLOG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const editTagBlog = (body, id) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/tags/${id}`, body)
            const result = await Axios.get(`${URL}/blog/tags`)
            dispatch({type: GET_TAG_BLOG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const deleteTagBlog = (id) => {
    return async(dispatch) => {
        try {
            await Axios.delete(`${URL}/blog/tags/${id}`)
            const result = await Axios.get(`${URL}/blog/tags`)
            dispatch({type: GET_TAG_BLOG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}