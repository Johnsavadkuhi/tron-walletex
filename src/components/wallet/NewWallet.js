/* eslint-disable array-callback-return */
import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import {tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {deleteTokensBalances, deleteWallet, loadTokenBalances} from "../../mainRedux/actions/actions";
import {find} from "lodash";
import {FormattedNumber} from "react-intl";
import IconButton from "@material-ui/core/IconButton";
import {compose} from "redux";
import SendIcon from '@material-ui/icons/SendRounded';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Tooltip from '@material-ui/core/Tooltip';
import OpenIconSpeedDial from './OpenIconSpeedDial.js';
import Panel from '../common/Panel';
import Swal from 'sweetalert2';
// import SimpleSnackbar from '../common/Snackbar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class NewWallet extends Component {


    constructor(props) {
        super(props);

        this.state = {

            value: 0,
            waitingForTrx: false,
            trxRequestResponse: {
                success: false,
                code: -1,
                message: '',
            },

            address: ''

        }
    }

    onClick = () => {

        localStorage.setItem('walletAddress',

            JSON.stringify(this.state.address));

        window.location = '#/TDNS';

    };


    componentDidMount() {

    }


    componentWillMount() {

        this.setState( {address: this.props.walletInfo.address});

         this.reloadTokens().then().catch(error=>{

             console.log("error : " ,error );


         });


    }

    async reloadTokens() {


        let {loadTokenBalances, deleteTokensBalances} = await this.props;

        if (this.props.balancesReducer.length > 1) {

            await deleteTokensBalances(this.state.address);

        }


        await loadTokenBalances(this.state.address);


    };


    handleClose = () => {


        let {deleteWallet} = this.props;

        Swal({

            title: 'Remove this Wallet ',
            type: 'warning',
            text: 'Are you sure to remove this Wallet ? ',

            preConfirm: () => {

                deleteWallet(this.props.walletInfo.address);


            }

        }).then(result => {

            console.log("result : ", result);



        });


    };

    handleChange = (event, value) => {

        this.setState({value: value});

    };


    getWallet = (req, prop) => {


        switch (req) {

            case "accountResource":

                let accountResource = {frozen_balance_for_energy: {expire_time: 0, frozen_balance: 0}}
                ;
                for (let i = 0; i < prop.length; i++) {

                    if (prop[i].address === this.state.address) {

                        accountResource = prop[i].accountResource;

                        break;
                    }

                }

                return accountResource;


            case "balance":

                let balance = 0;
                for (let i = 0; i < prop.length; i++) {

                    if (prop[i].address === this.state.address) {

                        balance = prop[i].balance;

                        break;
                    }

                }
                return balance;


            case "balances" :

                let walletBalance = [];

                for (let i = 0; i < prop.length; i++) {

                    if (prop[i].address === this.state.address) {

                        walletBalance = prop[i].balances;

                        break;
                    }

                }

                return walletBalance;


            case "bandwidth":


                let bandwidth = {};


                for (let i = 0; i < prop.length; i++) {

                    if (prop[i].address === this.state.address) {

                        bandwidth = prop[i].bandwidth;

                        break;
                    }

                }

                return bandwidth;


            default :

                return;


        }


    };


    renderTronIx() {


        let tokenBalances = [];

        let tb = this.props.balancesReducer;

        tb.filter(val => {

            return val.address === this.props.walletInfo.address

        }).map((obj) => (tokenBalances = obj.balances));


        if (tokenBalances.length === 0) {
            return (
                <span>


                    <FormattedNumber value={0}/> Trx


                </span>
            );
        }

        let trx = find(tokenBalances, token => token.name === "TRX");

        return (

            <span className="t-3">

                {
                    trx && <span className="text-center">

                        <FormattedNumber value={trx.balance}/> Trx

                    </span>
                }

            </span>

        )
    }


    renderTRC10() {

        let tokenBalances = [];

        tokenBalances = this.getWallet("balances", this.props.balancesReducer);


        if (tokenBalances.length === 0) {
            return (
                <table className="table border-0 m-0">
                    <thead>
                    <tr>
                        <th>TRC10</th>
                        <th className="text-right">{tu("balance")}</th>
                    </tr>
                    </thead>

                    <tbody className="text-muted small">

                    <tr>
                        <td> there isn't any TRC10 token</td>

                    </tr>


                    </tbody>

                </table>
            );
        }

        return (
            <table className="table border-0 m-0">
                <thead>
                <tr>
                    <th>TRC10</th>
                    <th className="text-right">{tu("balance")}</th>
                </tr>
                </thead>
                <tbody className="table table-hover header-fixed tbody">
                {
                    tokenBalances.map((token, index) => (

                        (index > 0) && //Hide TRON TRX on this view
                        <tr key={index}>
                            <td>{token.name}</td>
                            <td className="text-right">
                                <FormattedNumber value={token.balance}/>
                            </td>
                        </tr>

                    ))
                }
                </tbody>
            </table>
        )
    }

    renderTRC20() {

        let trc20token_balances = [];
        let tb = this.props.balancesReducer;


        tb.filter(val => {

            return val.address === this.props.walletInfo.address

        }).map((obj) => (trc20token_balances = obj.trc20token_balances));


        if (trc20token_balances.length === 0) {
            return (
                <table className="table border-0 m-0">
                    <thead>
                    <tr>
                        <th>TRC20</th>
                        <th className="text-right">{tu("balance")}</th>
                    </tr>
                    </thead>

                    <tbody className="text-muted small">

                    <tr>
                        <td> there isn't any TRC20 token</td>

                    </tr>


                    </tbody>

                </table>
            );
        }

        return (
            <table className="table border-0 m-0">
                <thead>
                <tr>
                    <th>TRC20</th>
                    <th className="text-right">{tu("balance")}</th>
                </tr>
                </thead>

                <tbody>
                {
                    trc20token_balances.map((token, index) => (

                        (index > 0) && //Hide TRON TRX on this view
                        <tr key={index}>
                            <td>{token.name}</td>
                            <td className="text-right">
                                <FormattedNumber value={token.balance}/>
                            </td>
                        </tr>

                    ))
                }
                </tbody>

            </table>
        )
    }


    //Main render

    render() {

        const bandwidth = this.getWallet("bandwidth", this.props.balancesReducer);
        const accountResource = this.getWallet("accountResource", this.props.balancesReducer);
        console.log("accountResource : ", accountResource);

        return (

            <div className="mt-2 row">

                <div className="col-md-12 col-sm-12 col-lg-12 ">

                    <Card className="mt-2">


                        <CardHeader

                            avatar={

                                <Avatar aria-label="Recipe">
                                    <small className="small">TRX</small>
                                </Avatar>
                            }

                            action={

                                <div>

                                    <Tooltip title="Voting">
                                        <IconButton
                                            aria-label="More">


                                            <AllInclusiveIcon/>

                                        </IconButton></Tooltip>


                                    <Tooltip title="Send">
                                        <IconButton onClick={this.onClick}
                                                    aria-label="More">


                                            <SendIcon nativeColor={"green"}/>

                                        </IconButton>
                                    </Tooltip>


                                </div>
                            }

                            title={this.props.walletInfo.name}
                            subheader={<span className="text-success small "> Balance : {this.renderTronIx()} </span>}
                        />

                        {/* END  : Header */}


                        <CardContent>

                            <div>

                                <Panel title="Wallet Info" element={<div className="container">

                                    <div className="row">

                                        <div className="col-md-6 mt-3 mt-md-0 text-center">

                                            {/*<Level type="bandwidth" tronPower={bandwidth} accountResource={accountResource} />*/}

                                            <span className="small ml-4"
                                                  style={{color: COLORS[0]}}>Tron Power : {bandwidth.freeNetRemaining || 0 } </span>
                                            <span className="small ml-4 "
                                                  style={{color: COLORS[1]}}> BandWidth : {bandwidth.energyRemaining || 0}</span>
                                            <span className="small ml-4 "
                                                  style={{color: COLORS[2]}}> Energy : {accountResource.frozen_balance_for_energy.frozen_balance / 1000000} </span>


                                        </div>


                                        <div className="col-md-6 mt-3 mt-md-0">


                                        </div>


                                    </div>
                                </div>} panel="panel1"/>
                                <Panel title="Tokens" element={<div className="container">

                                    <div className="row ">

                                        <div className="col-md-6">

                                            {this.renderTRC10()}

                                        </div>
                                        <div className="col-md-6">

                                            {this.renderTRC20()}


                                        </div>

                                    </div>
                                </div>} panel="panel4"/>
                                <Panel title="TRON POWER" element={<div className="container">

                                    <div className="row ">

                                        <div className="col-md-3">


                                        </div>

                                        <div className="col-md-6">

                                            <small className="text-muted mt-2 text-justify">
                                                TRX can be frozen/locked to gain Tron Power and enable
                                                additional features. For example, with Tron Power you can vote
                                                for Super Representatives.
                                                Frozen tokens are "locked" for a period of 3 days. During this
                                                period the frozen TRX cannot be traded.
                                                After this period you can unfreeze the TRX and trade the tokens.

                                            </small>


                                        </div>
                                        <div className="col-md-3"></div>

                                    </div>
                                </div>} panel="panel2"/>
                                <Panel title="Transactions" element={<div className="container">

                                    <div className="row ">
                                        <div className="col-md-12">


                                            {/*{*/}
                                            {/*<Transfers filter={{address: address}} pageSize={5}/>*/}
                                            {/*}*/}


                                        </div>

                                    </div>
                                </div>} panel="panel5"/>


                            </div>

                        </CardContent>
                        {/*End: the Card Container*/}
                        {/* request Trx for Test */}

                        <br/><br/>
                    </Card>
                    <br/> <br/>
                    <OpenIconSpeedDial walletInfo={this.state.address}/>


                </div>


            </div>

        );
    }
}


function mapStateToProps(state) {


    return {

        balancesReducer: state.balancesReducer.walletBalances,
        wallets: state.walletsReducer.wallets

    };
}

const mapDispatchToProps = {

    loadTokenBalances,
    deleteTokensBalances,
    deleteWallet

};


export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(NewWallet);