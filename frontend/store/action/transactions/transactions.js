import { URL, GET_ORDER, GET_HISTORY, UPLOAD_PAYMENT_ERROR, ERROR_CHECKOUT } from '../../helpers'
import Axios from 'axios'

export const getHistory = (id, query = '') => {
    return async(dispatch) => {
        try {
            const result = await Axios.get(`${URL}/transactions/orders/${id}?${query ? query : ''}`)
            dispatch({type: GET_HISTORY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const checkoutConfirmation = (body, order_number, user_id) => {
    return async(dispatch)=>{
        try {
            await Axios.post(`${URL}/transactions/orders/checkout/${order_number}`, body)
            const res = await Axios.get(`${URL}/transactions/orders/${user_id}?type=users`)
            dispatch({type: GET_ORDER, payload: res.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
            // dispatch({type: ERROR_CHECKOUT, payload: error.response.data})
        }
    }
}

export const uploadPayment = (order_number, data, user_id) => {
    return async (dispatch) => {
        const option = {
            header: {
                'Content-type': 'multipart/form-data'
            }
        }
        try {
            await Axios.post(URL + `/transactions/orders/payment-upload/${order_number}`, data, option)
            const result = await Axios.get(`${URL}/transactions/orders/${user_id}?type=users`)
            dispatch({type: GET_HISTORY, payload: result.data})
            
            const res = await Axios.get(`${URL}/transactions/orders/${order_number}?type=order-number`)
            dispatch({type: GET_ORDER, payload: res.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
            dispatch({ type: UPLOAD_PAYMENT_ERROR, payload: error.response.data })
        }
    }
}

// admin konfirmasi struk pembayaran
export const confirmPayment = (order_number) =>{
    return async(dispatch)=>{
        try {
            await Axios.patch(URL + `/transactions/orders/payment-confirmation/${order_number}`)
            const res = await Axios.get(`${URL}/transactions/orders/${order_number}?type=order-number`)
            dispatch({type: GET_ORDER, payload: res.data})

            const result = await Axios.get(`${URL}/transactions/orders/All?type=admin&orderStatus=2`)
            dispatch({type: GET_HISTORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}
// admin reject struk pembayaran jika tidak sesuai
export const rejectPayment = (order_number) =>{
    return async(dispatch)=>{
        try {
            await Axios.patch(URL + `/transactions/orders/failed/${order_number}?type=reject`)

            const res = await Axios.get(`${URL}/transactions/orders/${order_number}?type=order-number`)
            dispatch({type: GET_ORDER, payload: res.data})

            const result = await Axios.get(`${URL}/transactions/orders/All?type=admin&orderStatus=2`)
            dispatch({type: GET_HISTORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

// admin cancel order jika order blm dibayar melebihi batas waktu
export const cancelOrder = (order_number, id) =>{
    return async(dispatch)=>{
        try {
            await Axios.patch(URL + `/transactions/orders/failed/${order_number}?type=cancel`)

            const result = await Axios.get(`${URL}/transactions/orders/${id}?type=users`)
            dispatch({type: GET_HISTORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}
// admin kirim barang ke user
export const sendOrder = (order_number, id) =>{
    return async(dispatch)=>{
        try {
            await Axios.patch(URL + `/transactions/orders/send/${order_number}`)
            
            const result = await Axios.get(`${URL}/transactions/orders/${id}?type=store`)
            dispatch({type: GET_HISTORY, payload: result.data})
        } catch (error) {
            console.log(error.response? error.response.data : error)
        }
    }
}

// user konfirmasi pesanan sudah datang
export const confirmDone = (order_number, user_id) =>{
    return async(dispatch)=>{
        try {
            await Axios.patch(URL + `/transactions/orders/done/${order_number}`)
            const result = await Axios.get(`${URL}/transactions/orders/${user_id}?type=users`)
            dispatch({type: GET_HISTORY, payload: result.data})
            
            const res = await Axios.get(`${URL}/transactions/orders/${order_number}?type=order-number`)
            dispatch({type: GET_ORDER, payload: res.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}
