/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import * as qs from "query-string";
import {loadTokenBalances} from "../../mainRedux/actions/actions";
import {tu} from "../../utils/i18n";
import {Client} from "@tronscan/client";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import SendOption from "./SendOption";
import {find} from "lodash";
import {ONE_TRX} from "../../constants";
import {withStyles} from '@material-ui/core/styles';
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {compose} from "redux";

import {getAddress} from "../../tdns";

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import VisibilitySharpIcon from '@material-ui/icons/VisibilitySharp'
import {generateAccount} from "@tronscan/client/src/utils/account";


const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
});



const theme = createMuiTheme({
    palette: {

        primary: green,
    },
    typography: {useNextVariants: true},
});

class NewSend extends React.Component {

    constructor(props) {
        super(props);

        let queryParams = qs.parse(props.location.search);

        this.state = {
            to: queryParams.to || "",
            token: "",
            amount: "",
            sendStatus: 'waiting',
            isLoading: false,
            selectedWallet : "",
            privateKey:"",
            confirmSend : false ,
            address : '',


            //**************************************************************************
            addressName : '',
            myaddress :'',

            sendTo : '',
            helperTo : '' ,
            errorTo : '' ,

            helperAmount : '' ,
            errorAmount : '' ,





        };

    }

    componentWillMount(){

        let walletAddress = '';
        if (localStorage && localStorage.getItem('walletAddress')) {
            walletAddress = JSON.parse(localStorage.getItem('walletAddress'));
        }
        this.setState({address : walletAddress});

        console.log(walletAddress) ;
    }



    handleChange = async(event) =>{


        this.setState({addressName:event.target.value}) ;

        const address  = getAddress(event.target.value);
        console.log(address) ;





    };

    isValidDecryptedPKey = (address ,pKey)=>{


        let addr  = "" ;

        try {

            addr  = pkToAddress(pKey);

        }
        catch (e) {

            console.log(e);

        }

        return addr=== address;
    };

    secondSend = async () =>{


        let client = new Client();

        let {to, token, amount, selectedWallet, privateKey} = this.state;


        this.setState({isLoading: true});


        const resulet = await client.send(token, selectedWallet, to, amount * ONE_TRX)(privateKey);

        this.props.loadTokenBalances(selectedWallet);

        this.setState({
            sendStatus: 'success',
            isLoading: false,
            privateKey: ""
        });

        return resulet;
    } ;


    isAddress = (address) => {
        try {
            return isAddressValid(address);
        } catch (e) {
            return false;
        }
    };


    isValid = () => {

        let {to, token, amount , selectedWallet} = this.state;


        let address ="" ;

        let fr = this.props.tokensBalances ;

        fr.filter(val =>{

            return val.address === selectedWallet

        }).map((obj)=>(address=obj.address));


        return this.isAddress(to) && token !== "" && this.getSelectedTokenBalance() >= amount && amount > 0 && to !== address;

    };



    setAmount = (amount) => {

        if (amount !== '') {
            amount = parseFloat(amount);
        }

        this.setState({
            amount: amount > 0 ? amount : 0,
        });

        // amount = amount.replace(/^0+(?!\.|$)/, '').replace(/[^0-9 .]+/g,'').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1");

        this.setState({
            amount: amount,
        });

    };

    getSelectedTokenBalance = () => {

        const { address} = this.state;

        let tokenBalances = [] ;

        let fr = this.props.tokensBalances ;

        fr.filter(val =>{

            return val.address === address

        }).map((obj)=>(tokenBalances=obj.balances));


        let {token} = this.state;


                if (token) {

                    return parseFloat(find(tokenBalances, t => t.name === token).balance);

                }


        return 0;
    };

    isAmountValid = () => {

        let {amount} = this.state;

        let selectedTokenBalance = this.getSelectedTokenBalance();

        return amount === 0 || amount === '' || selectedTokenBalance >= amount;

    };


    componentDidMount() {

        this.refreshTokenBalances();

    }

    refreshTokenBalances = () => {

        let {address} = this.state ;

        const obj =   this.props.tokensBalances.filter( value => {

            return address === value.address;
        });


        if(obj > 0 )
            this.props.loadTokenBalances(obj[0].address);

    };



    componentDidUpdate() {


        let {selectedWallet} = this.state ;

        const obj =   this.props.tokensBalances.filter( value => {

            return selectedWallet === value.address;
        });


        if(obj > 0 ) {

            let tokensBalances = obj[0].balances ;

            console.log("token balances : ", tokensBalances);


            let {token} = this.state;


            if (!token && tokensBalances.length > 0) {

                this.setState({

                    token: tokensBalances[0].name,

                })

            }

        }

    }


    renderFooter() {

        let {sendStatus, isLoading} = this.state;

        if (sendStatus === 'success') {
            return (
                <div className="alert alert-success text-center">
                    {tu("successful_send")}
                </div>
            )
        }

        return (
            <Fragment>
                <div className="alert alert-warning">
                    {tu("address_warning")}
                </div>
                <button
                    type="button"
                    disabled={!this.isValid() || isLoading}
                    className="btn btn-primary col-md"
                    onClick={this.send}>{tu("send")}</button>
            </Fragment>
        )
    }

    resetForm = ()  => {
        this.setState({
            amount: '',
            sendStatus: 'waiting',
            isLoading: false,
            to: "",
        });
    };



    TextFields = () => {


        return <

            div className="messageInput">

            <TextField

                className="m-2"
                label="Send To"
                name="sendTo"
                variant="outlined"
                placeholder="Example: JustinSun.tron"
                required
                fullWidth
                onChange={this.handlerChange}
                value={this.state.sendTo}
                helperText={this.state.helperTo}
                error={this.state.errorTo}
                InputProps={{
                    endAdornment: (
                        <InputAdornment variant="filled" position="end" name="customInput">
                            <Icon color={"inherit"}>

                                {
                                    this.stateOfWalletNameTextField()

                                }

                            </Icon>
                        </InputAdornment>
                    ),
                }}

            />
            <TextField

                type="password"
                className="m-2"
                label="Password"
                name="password"
                variant="outlined"
                placeholder="Enter a password "
                required
                fullWidth
                onChange={this.handlerChange}
                value={this.state.password}
                helperText={this.state.helperPassword}
                error={this.state.errorPassword}
                InputProps={{
                    endAdornment: (
                        <InputAdornment variant="filled" position="end" name="customInput">
                            <Icon color={"inherit"}>

                                {
                                    this.stateOfPasswordTextField()

                                }

                            </Icon>
                        </InputAdornment>
                    ),
                }}

            />


        </div>


    };


    newForm = () =>{



    }
    renderForm(tokenBalances) {

        let {sendStatus} = this.state;
        let {to, token, amount } = this.state;

        let isToValid = to.length === 0 || this.isAddress(to);
        let isAmountValid = this.isAmountValid();

        if (sendStatus === 'success') {
            return (
                <Fragment>
                    <div className="alert alert-success text-center">
                        {tu("successful_send")}
                    </div>
                    <div className="justify-content-center">
                        <button className="btn btn-primary btn-block" onClick={this.resetForm}>
                            {tu("make_another_transaction")}
                        </button>
                    </div>
                </Fragment>
            )
        }

        return (

            <form>


                <div className="form-group">
                    <label>{tu("to")}</label>
                    <div className="input-group mb-3">

                        <input type="text"
                               //onChange={(ev) => this.setState({ to: ev.target.value })}
                               onChange={this.handleChange}
                               className={"form-control " + (!isToValid ? "is-invalid" : "")}
                               value={this.state.addressName}
                        />


                        <div className="invalid-feedback">
                            {tu("invalid_address")}
                        </div>
                    </div>
                </div>



                <div className="form-group">

                    <label>{tu("token")}</label>

                    <div className="input-group mb-3">

                        <select

                            className="form-control"
                            onChange={(ev) =>  this.setState({ token: ev.target.value }) }
                            value={token}>

                            <SendOption name="Select Token" balance={0}/>
                            {

                                tokenBalances.map(tokenBalance => (
                                    <SendOption key={tokenBalance.name} name={tokenBalance.name} balance={tokenBalance.balance}/>
                                ))
                            }

                        </select>


                    </div>

                </div>



                <div className="form-group">
                    <label>{tu("amount")}</label>
                    <div className="input-group mb-3">

                        <input type="text"
                               onChange={(ev) => this.setAmount(ev.target.value) }
                               className={"form-control " + (!isAmountValid ? "is-invalid" : "")}
                               value={amount}
                               placeholder='0.0000'/>

                        <div className="invalid-feedback">
                            {tu("insufficient_tokens")}
                        </div>


                    </div>
                </div>

                {this.renderFooter()}

            </form>
        )
    }


    renderWallets = ()=>{

        const { address } = this.state;


        let tokenBalances = [] ;

        let fr = this.props.tokensBalances ;

        fr.filter(val =>{

            return val.address === address;

        }).map((obj)=>(tokenBalances=obj.balances));



        return (
            <main className="container-fluid pt-5 pb-5">



                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8 col-lg-5">
                            <div className="card">
                                <div className="card-header text-center bg-info text-white">
                                    {tu("send_trx")}
                                </div>
                                <div className="card-body">

                                    {this.renderForm(tokenBalances)}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )



    };


    render() {

        return(

            <div>
                {

                    this.renderWallets()
                }

            </div>

        )


    }
}

function mapStateToProps(state) {
    return {


        tokensBalances:state.balancesReducer.walletBalances,
        wallets:state.walletsReducer.wallets,

    };
}

const mapDispatchToProps = {
    loadTokenBalances,
};


export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)( NewSend);