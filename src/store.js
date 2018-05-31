import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from './mainRedux/reducers';
import logger from "redux-logger" ;
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['walletsReducer']
};

const persistedReducer = persistReducer(persistConfig, reducer);


export function configureStore() {
    const enhancer = compose(
        applyMiddleware(logger , thunk),
    );

    let store = createStore(persistedReducer , enhancer) ;
    let persistor = persistStore(store);
    // return createStore(reducer, enhancer);
    return {store , persistor} ;
}



