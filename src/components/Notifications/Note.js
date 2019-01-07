import React from 'react';

import logo from './tutor2.gif'


class Note extends React.Component {


    render() {

        return (


            <div className="container-fluid">

                <div className="row">


                    <div className="col-md-12">
                        <div className="kontainer">
                            <div className="header white">

                                <p className="p-3 m-3 text-muted text-justify">

                                    This is a web base Wallet for Tron (TRX) that allows you to both Send TRX and it's
                                    tokens
                                    TRC10 and TRC20. another features of this wallet is voting for Representatives ,
                                    issue Tokens
                                    and buy tokens.<br/>

                                    on of the greatest feature of this Wallet is <b> <span
                                    className="text-danger">Tron</span> Decentralized Name System (TDNS) </b>
                                    that allows you to use a name instead of Wallet Address . <a
                                    href="https://tdns.tronwallet.network">TDNS</a>


                                </p>

                            </div>
                        </div>


                    </div>
                </div>

                <hr/>
                <div className="row ">
                    <hr/>
                    <div className="col-md-12 text-center">


                        <img src={logo} alt="tutorial" className="img-fluid"/>

                    </div>
                </div>


            </div>


        )


    }


}


export default (Note);


