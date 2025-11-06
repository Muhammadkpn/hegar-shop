import {URL, GET_SALES_SUMMARY, GET_SALES_EARNINGS, GET_SALES_CHARTS } from '../../helpers'
import Axios from 'axios'

export const getSalesSummary = (type, id) => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/transactions/stores/sales-summary/${id}?${type}`)
            dispatch({type: GET_SALES_SUMMARY, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getSalesEarnings = (type, id, query = '') => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/transactions/stores/sales-earnings/${id}?${type}&${query ? `start_date='${query.start_date}'&end_date='${query.end_date}'` : ''}`)
            dispatch({type: GET_SALES_EARNINGS, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}

export const getSalesCharts = (user_id, query = "") => {
    return async (dispatch) => {
        try {
            const result = await Axios.get(`${URL}/transactions/stores/sales-charts/${user_id}?${query}`)
            dispatch({type: GET_SALES_CHARTS, payload: result.data})
        } catch (error) {
            console.log(error.response ? error.response.data : error)
        }
    }
}