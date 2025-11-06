import { GET_EMAIL_SUBSCRIBE } from '../../helpers'

const INITIAL_STATE = {
 emailSubscribe: []
}

const subscribeReducer = (state = INITIAL_STATE, action) => {
 switch (action.type) {
  case GET_EMAIL_SUBSCRIBE:
   return { ...state, emailSubscribe: action.payload.data }
  default:
   return state
 }
}

export default subscribeReducer