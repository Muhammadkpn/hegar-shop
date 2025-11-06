import { URL, GET_EMAIL_SUBSCRIBE } from "../../helpers";
import Axios from "axios";

export const getEmailSubscribe = () => {
 return async (dispatch) => {
   try {
     const result = await Axios.get(`${URL}/users/subscribe`)
     dispatch({type: GET_EMAIL_SUBSCRIBE, payload: result.data})
   } catch (error) {
     console.log(error.response ? error.response.data : error)
   }
 }
}

export const addEmailSubscribe = (body) => {
 return async (dispatch) => {
   try {
     // add email to database
     await Axios.post(`${URL}/users/subscribe`, body)
     
     // get update data
     const result = await Axios.get(`${URL}/users/subscribe`)
     dispatch({type: GET_EMAIL_SUBSCRIBE, payload: result.data})
   } catch (error) {
     console.log(error.response ? error.response.data: error)
   }
 }
}

export const editEmailSubscribe = (body, id) => {
 return async (dispatch) => {
   try {
     // edit email to database
     await Axios.patch(`${URL}/users/subscribe/${id}`, body)
     
     // get update data
     const result = await Axios.get(`${URL}/users/subscribe`)
     dispatch({type: GET_EMAIL_SUBSCRIBE, payload: result.data})
   } catch (error) {
     console.log(error.response ? error.response.data: error)
   }
 }
}

export const deleteEmailSubscribe = (id) => {
 return async (dispatch) => {
   try {
     // delete email to database
     await Axios.delete(`${URL}/users/subscribe/${id}`)
     
     // get update data
     const result = await Axios.get(`${URL}/users/subscribe`)
     dispatch({type: GET_EMAIL_SUBSCRIBE, payload: result.data})
   } catch (error) {
     console.log(error.response ? error.response.data: error)
   }
 }
}