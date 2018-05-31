import React, {Component} from 'react';
import {Provider} from "react-redux";
import {configureStore} from "../store";
import MainWrap from "./MainWrap";
import { PersistGate } from 'redux-persist/integration/react'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            store: configureStore().store,
        };
    }

    render() {

        let {store} = this.state;


        return (

            <Provider store={store}>
                <PersistGate loading={null} persistor={configureStore().persistor}>
                <MainWrap/>
                </PersistGate>
            </Provider>

        );
    }
}

export default App;
