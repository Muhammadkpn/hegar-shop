import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import Rootreducer from './reducer';

// const initialState = {}
// const middleware = [ReduxThunk]

// const store = createStore(Rootreducer, initialState, composeWithDevTools(...middleware))

// export default store

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
        if (state.count) nextState.count = state.count; // preserve count value on client side navigation
        return nextState;
    } else {
        return Rootreducer(state, action);
    }
};

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
};

export const initStore = () => {
    return createStore(reducer, bindMiddleware([ReduxThunk]));
};

export const wrapper = createWrapper(initStore);
// const globalStore = () => createStore(Rootreducer, bindMiddleware([ReduxThunk]));
// globalStore.subscribe(() => console.log('Global store: ', globalStore.getState()))
