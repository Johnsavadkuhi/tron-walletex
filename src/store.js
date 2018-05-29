import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from './mainRedux/reducers';
import logger from "redux-logger" ;


export function configureStore() {
    const enhancer = compose(
        applyMiddleware(logger , thunk),
    );

    return createStore(reducer, enhancer);
}



