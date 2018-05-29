import React, {Component} from 'react';
import {connect} from "react-redux";
import Wallet from "../wallet/Wallet";
import Paper from "@material-ui/core/Paper" ;
import NotBeforeAddWallet from "../../components/Notifications/NotbeforeAddWallet";


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


                        <div className="row">

                            <div className="col-md-12 ">


                                <NotBeforeAddWallet/>


                            </div>


                        </div>

                }





                {/*{*/}
                {/*wallets.map((wallet, i) => (*/}

                {/*<div key={i}>*/}

                {/*<Wallet walletinfo={wallet}/>*/}

                {/*</div>*/}
                {/*))*/}
                {/*}*/}


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

