import {URL, GET_WISHLIST} from '../../helpers'
import Axios from 'axios'

export const getWishlist = (type, id) => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/users/wishlist/${id}?${type ? type : ''}`)
            dispatch({type: GET_WISHLIST, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const updateWishlist = (body) => {
    return async(dispatch) => {
        try {
            await Axios.patch(`${URL}/users/wishlist/update`, body)
            const result = await Axios.get(`${URL}/users/wishlist/${body.userId}?type=user-id`)
            dispatch({type: GET_WISHLIST, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const deleteWishlist = (user_id, product_id) => {
    return async(dispatch) => {
        try {
            await Axios.delete(`${URL}/users/wishlist/${user_id}/${product_id}`)
            const result = await Axios.get(`${URL}/users/wishlist/${user_id}?type=user-id`)
            dispatch({type: GET_WISHLIST, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}