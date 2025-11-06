import {URL, GET_PRODUCT_CATEGORY, COUNT_CATEGORY_PRODUCT, GET_PRODUCT_STORE} from "../../helpers"
import Axios from 'axios'

export const getProductCategory = (type, category)=>{
    return async(dispatch)=>{
        try {       
            const result = await Axios.get(`${URL}/products/product-category`)
            dispatch({type: GET_PRODUCT_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getCountCategoryProduct = () => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/product-category/count`)
            dispatch({type: COUNT_CATEGORY_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getCountCategoryProductByStore = (store_id) => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/products/product-category/count/store/${store_id}`)
            dispatch({type: COUNT_CATEGORY_PRODUCT, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const addProductCategory= (body)=>{
    return async(dispatch)=>{
        try {       
            await Axios.post(`${URL}/products/product-category`, body)
            
            const result = await Axios.get(`${URL}/products/product-category`)
            dispatch({type: GET_PRODUCT_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const editProductCategory = (body, id)=>{
    return async(dispatch)=>{
        try {       
            await Axios.patch(`${URL}/products/product-category/${id}`, body)
            
            const result = await Axios.get(`${URL}/products/product-category`)
            dispatch({type: GET_PRODUCT_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const editProductCategoryByStore = (body, product_id, store_id)=>{
    return async(dispatch)=>{
        try {       
            await Axios.patch(`${URL}/products/product-category/store/${product_id}`, body)
            
            const result = await Axios.get(`${URL}/products/product-category`)
            dispatch({type: GET_PRODUCT_CATEGORY, payload: result.data})

            const getProductStore = await Axios.get(`${URL}/products/store/${store_id}`)
            dispatch({type: GET_PRODUCT_STORE, payload: getProductStore.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const deleteProductCategory = (id)=>{
    return async(dispatch)=>{
        try {       
            await Axios.delete(`${URL}/products/product-category/${id}`)
            
            const result = await Axios.get(`${URL}/products/product-category`)
            dispatch({type: GET_PRODUCT_CATEGORY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}