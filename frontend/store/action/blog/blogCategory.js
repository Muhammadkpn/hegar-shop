import {URL, GET_BLOG_CATEGORY, COUNT_CATEGORY_BLOG} from '../../helpers'
import Axios from 'axios'

export const getBlogCategory = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/blog-category`)
            dispatch({type: GET_BLOG_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getCountCategoryBlog = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/blog/blog-category/count`)
            dispatch({type: COUNT_CATEGORY_BLOG, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addBlogCategory = () => {
    return async(dispatch) => {
        try {
            await Axios.post(`${URL}/blog/blog-category`)
            
            const result = await Axios.get(`${URL}/blog/blog-category`)
            dispatch({type: GET_BLOG_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const editBlogCategory = (body, id) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/blog/blog-category/${id}`, body)

            const result = await Axios.get(`${URL}/blog/blog-category`)
            dispatch({type: GET_BLOG_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

export const deleteBlogCategory = (id) => {
    return async(dispatch) => {
        try {
            await Axios.delete(`${URL}/blog/blog-category/${id}`)
            const result = await Axios.get(`${URL}/blog/blog-category`)
            dispatch({type: GET_BLOG_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}