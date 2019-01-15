/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React from "react";
import {loadTokenBalances} from "../../mainRedux/actions/actions";
import {isAddressValid, pkToAddress} from "@tronscan/client/src/utils/crypto";
import SendOption from "./SendOption";

import {find} from "lodash";
import { withStyles} from '@material-ui/core/styles';
import {compose} from "redux";
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import ReactDOM from 'react-dom';
import Checkbox from "@material-ui/core/Checkbox";
import LinkIcon from "@material-ui/icons/Link";
import {getAddress} from '../../tdns/index' ;
import CircularProgress from "@material-ui/core/CircularProgress";
import TextFormatIcon from '@material-ui/icons/TextFormat'
import {Client} from "@tronscan/client";
import {ONE_TRX} from "../../constants";
import Button from "@material-ui/core/Button" ;
import {ENABLE_ADDRESS_NAME , DISABLE_ADDRESS_NAME} from "../constant/Constant";
import Swal from 'sweetalert2';
import {decryptString} from "../../services/encryption_js";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    checkBoxRoot: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },

    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 350,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    checked: {},

});




class TDNS extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            token: 'TRX',
            sendStatus: 'waiting',
            isLoading: false,
            privateKey: '',
            confirmSend: false,
            address: '',
            addressName: '',
            sendTo: '',
            helperTo: 'Enter Address or Name ',
            errorTo: false,
            amount: 0 ,
            helperAmount: 'Amount',
            errorAmount: false,

            labelWidth: 0,
            checkedG: false,
            loadingName: true,
            isAddressNameFree: true,
            to: '' ,

            transactionResult: '' ,


        };

    }

    componentWillMount() {

        let walletAddress = '';

        if (localStorage && localStorage.getItem('walletAddress')) {

            walletAddress = JSON.parse(localStorage.getItem('walletAddress'));

        }
        this.setState({address: walletAddress});

        console.log(walletAddress);
    }

    componentDidMount() {

        this.setState({

            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,

        });

        console.log(this.state.token);



        this.refreshTokenBalances();

    }


    handlerChange = async event => {

        switch (event.target.name) {


            case 'sendTo' :


                if (!this.state.checkedG) {

                    this.setState({sendTo: event.target.value});

                    if (event.target.value.length === 0 || this.isAddress(event.target.value.trim())) {


                        event.target.value === this.state.address ? this.setState({errorTo: true, helperTo: 'You can not send TRX to your address'}) :

                            this.setState({errorTo: false, helperTo: 'Valid Address'});


                        // if (event.target.value === this.state.address )
                        // {
                        //     this.setState({errorTo: true, helperTo: 'You can not send TRX to your address'});
                        // }else {
                        //
                        //     this.setState({errorTo: false, helperTo: 'Valid Address'});
                        // }

                    }

                    else {


                        this.setState({errorTo: true, helperTo: 'Invalid Address'});


                    }

                } else {

                    this.setState({sendTo: event.target.value});

                    if (event.target.value.length === 0) {


                        this.setState({errorTo: false, helperTo: 'Name is required.'});


                    } else if (event.target.value !== "" || event.target.value.length > 0) {


                        this.setState({loadingName: true});


                        const x = await getAddress(event.target.value.toString().trim());


                        this.setState({loadingName: false});

                        const DONT_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';

                        if (x !== DONT_ADDRESS) {

                            //this.setState({errorTo: false, isAddressNameFree: false, helperTo: 'It is ok : ' + x, to: x});

                            x  === this.state.address ? this.setState({errorTo: true, helperTo: 'You can not send TRX to your address'}) :

                                this.setState({errorTo: false, isAddressNameFree: false, helperTo: 'It is ok : ' + x, to: x})  ;






                        } else if (this.state.sendTo === "") {

                            this.setState({errorTo: false, helperTo: 'Name is required ', to: ''});

                        } else {

                            //this.setState({isAddressNameFree: true, helperTextForName: '' , errorName: false});
                            this.setState({isAddressNameFree: true, errorTo: true, helperTo: 'No Address', to: ''});


                        }


                    } else {

                    }

                }


                break;

            case 'amount' :


                this.setAmount(event.target.value) ;

                if(this.isAmountValid(event.target.value ) === false )
                {

                    this.setState({errorAmount:true ,helperAmount : 'Insufficient Tokens' });



                }
                else {

                    this.setState({errorAmount:false ,helperAmount : 'Amount' }) ;

                }

                console.log("is amount valid : " , this.isAmountValid(event.target.value ))  ;


                break;

            case 'token' :


                this.setState({token: event.target.value});

                console.log(event.target.value );

                break;

            case 'checkedG' :


                this.setState({checkedG: event.target.checked});


                break;


            default :
                return;

        }


    };

    myChange =  event => {


        this.setState({checkedG: event.target.checked});

        if (!this.state.checkedG) {

            this.setState({errorTo: false, helperTo: 'Name is required.', sendTo: ''});

        } else {

            this.setState({errorTo: false, helperTo: 'Address is required', sendTo: ''});


        }


    };



    handlerClick = async event => {


           this.decryption ();

    };

    decryption  = async () => {

        await Swal({
            type: 'question',
            title: 'Enter your Password',
            input: 'password',

            inputPlaceholder: 'Enter your Password',
            showLoaderOnConfirm: true,
            closeOnConfirm: false,
            preConfirm: async (password) => {

                if (password) {

                    let {address} = this.state;

                    const obj = this.props.wallets.filter(val => {

                        return address === val.address;

                    });

                    const pKey = decryptString(password, obj[0].key);


                    if (!this.isValidDecryptedPKey(address, pKey))
                    {
                        Swal.showValidationMessage("Password is Not Correct.");


                    }else {

                        let  result ={} ;
                        let client = new Client();

                        let {to, sendTo, token, amount, address} = this.state;

                        if(!this.state.checkedG) {

                            console.log("token : " , token , "\n" , "amount : "  , amount , "\n");

                            result = await client.send(token, address, sendTo, token === "TRX" ? amount * ONE_TRX : amount  )(pKey);


                            console.log('result : ', result) ;

                        }
                        else {

                             result =  await client.send(token, address, to, token === "TRX" ? amount * ONE_TRX : amount )(pKey);

                        }


                      await  this.setState({transactionResult:result});


                      console.log("transaction : " , this.state.transactionResult);

                        this.props.loadTokenBalances(address);


                        this.setState({sendTo:'' , amount:0 , to:''});
                        //this.setState({privateKey:pKey}) ;

                    }

                } else {

                    Swal.showValidationMessage("Password is Empty");

                }

            },
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            }

        });


        if (this.state.transactionResult.code ==="SUCCESS" )
        {
           Swal({

                type:'success' ,
                title: 'Sent Successfully ',
               text:'hash id : ' + this.state.transactionResult.transaction.hash


            })


        }
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
    isValid = () => {

        let {to, token, amount, address, sendTo} = this.state;

        if (!this.state.checkedG) {

            let myAddress = "";

            let fr = this.props.tokensBalances;

            fr.filter(val => {

                return val.address === address

            }).map((obj) => (myAddress = obj.address));


            return this.isAddress(sendTo) && token !== "" && this.getSelectedTokenBalance() >= amount && amount > 0 && sendTo !== myAddress;

        } else {

            let myAddress = "";

            let fr = this.props.tokensBalances;

            fr.filter(val => {

                return val.address === address

            }).map((obj) => (myAddress = obj.address));


            return this.isAddress(to) && token !== "" && this.getSelectedTokenBalance() >= amount && amount > 0 && to !== myAddress;

        }

    };

    setAmount = (amount) => {

        if (amount !== '') {
            amount = parseFloat(amount);
        }

        if(amount >= 0)
        this.setState({
            amount: amount > 0 ? amount : 0,
        });



        // amount = amount.replace(/^0+(?!\.|$)/, '').replace(/[^0-9 .]+/g,'').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1");

        // this.setState({
        //     amount: amount,
        // });

    };

    refreshTokenBalances = () => {

        let {address} = this.state;

        const obj = this.props.tokensBalances.filter(value => {

            return address === value.address;
        });


        if (obj > 0)

            this.props.loadTokenBalances(obj[0].address);

    };

    isAddress = (address) => {
        try {
            return isAddressValid(address);
        } catch (e) {
            return false;
        }
    };

    stateOfSendTo = () => {

        if (!this.state.checkedG) {

            if (this.state.sendTo.length !== 34) {


                return (!this.state.errorTo ? <LinkIcon color="action"/> : <WarningIcon color="error"/>)


            } else {


                return <CheckIcon color="primary"/>

            }

        } else {

            if (this.state.sendTo.length === 0) {


                return <TextFormatIcon/>;


            } else {

                if (this.state.loadingName) {

                    return <CircularProgress size={26}/>

                }
                return (this.state.isAddressNameFree ? <WarningIcon color="error"/> : <CheckIcon color="primary"/>);

            }

        }


    };

    stateOfAmount = () => {




    };

    isAmountValid = (amount ) => {


        const  selectedTokenBalance = this.getSelectedTokenBalance();


        console.log("selected Token Balance " , selectedTokenBalance) ;


       // return amount === 0 || amount === '' || selectedTokenBalance >= amount;


        return  (selectedTokenBalance >= amount) ;

    };


    getSelectedTokenBalance = () => {

        const {address} = this.state;

        let tokenBalances = [];

        let fr = this.props.tokensBalances;

        fr.filter(val => {

            return val.address === address

        }).map((obj) => (tokenBalances = obj.balances));


        let {token} = this.state;


        if (token) {

            return parseFloat(find(tokenBalances, t => t.name === token).balance);

        }


        return 0;
    };


    TextFields = (tokenBalances) => {

        const {classes} = this.props;

        return <

            div className="messageInput">

            <div className="container">

                <div className="row">

                    <div className="col-md-4">

                        <TextField

                            className="m-2"
                            label="Send To"
                            name="sendTo"
                            variant="outlined"
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
                                                this.stateOfSendTo()

                                            }

                                        </Icon>
                                    </InputAdornment>
                                ),
                            }}

                        />

                    </div>

                    <div className="col-md-4">

                        <FormControl variant="outlined" className={classes.formControl}>

                            <InputLabel
                                ref={ref => {
                                    this.InputLabelRef = ref;
                                }}
                                htmlFor="outlined-age-native-simple"
                            >
                            </InputLabel>

                            <Select
                                name="token"
                                native
                                value={this.state.token}
                                onChange={this.handlerChange}
                                input={
                                    <OutlinedInput
                                        name="token"
                                        labelWidth={this.state.labelWidth}
                                        id="outlined-age-native-simple"/>
                                }>

                                {

                                    tokenBalances.map(tokenBalance => (
                                        <SendOption key={tokenBalance.name} name={tokenBalance.name}
                                                    balance={tokenBalance.balance}/>
                                    ))
                                }


                            </Select>

                        </FormControl>

                    </div>

                    <div className="col-md-4">

                        <TextField

                            type="number"
                            className="m-2"
                            label="Amount"
                            name="amount"
                            variant="outlined"
                            placeholder="Enter Token Amount "
                            required
                            fullWidth
                            onChange={this.handlerChange}
                            value={this.state.amount}
                            helperText={this.state.helperAmount}
                            error={this.state.errorAmount}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment variant="filled" position="end" name="customInput">
                                        <Icon color={"inherit"}>

                                            {
                                                this.stateOfAmount()

                                            }

                                        </Icon>
                                    </InputAdornment>
                                ),
                            }}

                        />


                    </div>

                </div>

                <hr/>

                <div className="row">

                    <Button

                        className="sendButton"
                        disabled={!this.isValid()}
                        name="send"
                        onClick={this.handlerClick}>

                        Send

                    </Button>


                </div>


            </div>

        </div>


    };


    render() {

        const {address} = this.state;


        let tokenBalances = [];

        let fr = this.props.tokensBalances;

        fr.filter(val => {

            return val.address === address;

        }).map((obj) => (tokenBalances = obj.balances));
        const {classes} = this.props;

        return (<div className="kontainer">

            <div className="header white ">

                <p>
                    <b>Send TRX : </b> for sending trx you can use either recipient's address or the name of address.<br/>

                    <label>

                        <Checkbox

                            onChange={this.myChange}
                            value="checkedG"
                            checked={this.state.checkedG}

                            classes={{

                                root: classes.checkBoxRoot,
                                checked: classes.checked,

                            }}

                        /> { !this.state.checkedG ? ENABLE_ADDRESS_NAME : DISABLE_ADDRESS_NAME}

                    </label>
                </p>

            </div>

            {
                this.TextFields(tokenBalances)

            }


        </div>);


    }


}


function mapStateToProps(state) {
    return {


        tokensBalances: state.balancesReducer.walletBalances,
        wallets: state.walletsReducer.wallets,

    };
}

const mapDispatchToProps = {
    loadTokenBalances,
};

// export default connect(mapStateToProps, mapDispatchToProps)
// withStyles(styles)(TDNS);


export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(TDNS);