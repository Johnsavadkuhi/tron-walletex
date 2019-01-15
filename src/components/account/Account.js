import React, {Component} from 'react';
import {connect} from "react-redux";
import NewWallet from "../wallet/NewWallet";
class Account extends Component {

    searchInWallets () {

        let wallets = this.props.wallets;

        for (let i = 0; i < wallets.length; i++)
        {

        }
    }
    render() {


        let wallets = this.props.wallets;

        return (


            <div className="container mt-4 mb-4">

                {


                    wallets.length > 0 ? wallets.map((wallet, i) => (

                            <div key={i}>

                                <NewWallet walletInfo={wallet}/>

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

