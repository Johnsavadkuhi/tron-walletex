import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SendIcon from '@material-ui/icons/Send';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import AddIcon from '@material-ui/icons/Add';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
//import logo from "../../images/tronLogoForNote.png" ;
import logo from './tutor2.gif'
import {Col, Row} from "react-bootstrap";


class Note extends React.Component {


    render() {

        return (


            <div className="container-fluid">

                <div className="row">




                    <div className="col-md-12">
                        <div className="kontainer">
                            <div className="header white">

                                <p className="p-3 m-3 text-muted text-justify">

                                    This is a web base Wallet for Tron (TRX) that allows you to both Send TRX and it's tokens
                                    TRC10 and TRC20. another features of this wallet is voting for Representatives , issue Tokens
                                    and  buy tokens.<br/>

                                    on of the greatest feature of this Wallet is  <b> <span className="text-danger">Tron</span> Decentralized Name System (TDNS) </b>
                                    that allows you to use a name instead of Wallet Address . <a href="https://tdns.tronwallet.network">TDNS</a>


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


