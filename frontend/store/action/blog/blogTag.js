import {URL, GET_BLOG_TAG, COUNT_TAG_BLOG} from '../../helpers'
import Axios from 'axios'

export const getBlogTag = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/blog-tag`)
            dispatch({type: GET_BLOG_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getCountTagBlog = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/blog-tag/count`)
            dispatch({type: COUNT_TAG_BLOG, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addBlogTag = () => {
    return async(dispatch) => {
        try {
            await Axios.post(`${URL}/blog/blog-tag`)
            const result = await Axios.get(`${URL}/blog/blog-tag`)
            dispatch({type: GET_BLOG_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const editBlogTag = (body, id) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/blog-tag/${id}`, body)
            
            const result = await Axios.get(`${URL}/blog/blog-tag`)
            dispatch({type: GET_BLOG_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const deleteBlogTag = (id) => {
    return async(dispatch) => {
        try {
            await Axios.delete(`${URL}/blog/blog-tag/${id}`)
            const result = await Axios.get(`${URL}/blog/blog-tag`)
            dispatch({type: GET_BLOG_TAG, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}