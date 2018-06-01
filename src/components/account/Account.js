import React, {Component} from 'react';
import {connect} from "react-redux";
import Wallet from "../wallet/Wallet";

class Account extends Component {

    render() {

        let wallets = this.props.wallets;

        return (


            <div className="container mt-4 mb-4">

                {

                    wallets.length > 0 ? wallets.map((wallet, i) => (

                            <div key={i}>

                                <Wallet walletinfo={wallet}/>

                            </div>
                        )) :


                        <div className="container pb-3 text-center ">
                            <div className="row">

                                <div className="col-md-3"> </div>
                                <div className="col-sm-6">

                                    <div className="card">
                                        <div className="card-body">

                                            <div className="text-center p-3">

                                                you have not added any wallet yet <br/>
                                                click on <a href="#/AddWallet">Add Wallet</a> to add or generate new
                                                wallet

                                            </div>

                                        </div>

                                    </div>

                                </div>
                                <div className="col-md-3"> </div>

                            </div>
                            <div/>
                        </div>

                }


            </div>
        );

    }
}

function mapStateToProps(state) {

    return {

        wallets: state.walletsReducer.wallets
    };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Account)

