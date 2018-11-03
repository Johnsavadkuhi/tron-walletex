import React, {Component} from 'react';
import {Provider} from "react-redux";
import {configureStore} from "../store";
import MainWrap from "./MainWrap";
import { PersistGate } from 'redux-persist/integration/react'
import {TronLoader} from '../components/loader/Loader' ;
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            status:true ,
            store: configureStore().store,
        };
    }

    handleLoad = ()=>{

        this.setState({status:false})

    };


    componentDidMount(){

        window.addEventListener('load', this.handleLoad);

    }

    render() {

        let {store } = this.state;

        return (

            <Provider store={store}>
                <PersistGate loading={null} persistor={configureStore().persistor}>



                    {this.state.status ===true ? <TronLoader children={<div className="text-info">Tron Wallet</div>} height={200} />:<MainWrap/>}

                </PersistGate>
            </Provider>

        );
    }
}

export default App;
