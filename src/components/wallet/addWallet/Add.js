import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {encryptKey, encryptString} from "../../../services/encryption_js";
import {setWallet} from "../../../mainRedux/actions/actions";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

 class Add extends React.Component{

    constructor(props)
    {
        super(props);


        this.state={

            address: "",
            privateKey: "",
            password: "",
            name: "",
            isPassValid: false,
            nameLengthIsOk: false,
            privateKeyIsValid: false,
            passWarning: true,
            walletExist : false

        }
    }

    handleChange = nameOf => event => {

        let {privateKey, address, name} = this.state;

        switch ([nameOf][0]) {

            case "nextAfterRegister" :

                this.addWalletSafe(address, privateKey, name);

                this.props.history.push("/account");

                break;

            case "unlockWallet":

                this.addWalletSafe(address, privateKey, name);

                this.props.history.push("/account");

                break;

            case "privateKey":


                this.setState({privateKey: event.target.value, privateKeyIsValid: false});

                if (event.target.value.length === 64) {

                    let address = pkToAddress(event.target.value);

                    let w = this.props.wallets.filter(val => {

                        return val.address === address;

                    });

                    if(w.length===0)
                    {
                        this.setState({address: address, privateKeyIsValid: true , walletExist :false });

                    }else{

                        this.setState({address: "", privateKeyIsValid: false , walletExist :true});
                    }

                }

                break;

            case "password" :

                this.setState({[nameOf]: event.target.value, isPassValid: false});

                if (event.target.value.length >= 8) {
                    this.setState({isPassValid: true});

                }

                else if (this.state.passWarning) {

                    // this.handleClick("you should enter at least 8 characters");
                    this.setState({passWarning: false});
                }

                break;

            case "name":

                const v = event.target.value;

                if (v.length >= 5) {
                    this.setState({nameLengthIsOk: true ,  [nameOf]: event.target.value})

                } else {
                    this.setState({nameLengthIsOk: false ,  [nameOf]: event.target.value})
                }


                break;


            default:
                return;
        }

    };

     encryptPrivateKey = (password, hexString) => {
         return encryptString(password, hexString);
     };

    addWalletSafe = (address, privateKey, name) => {
        const passwordToBuffer = new Buffer(this.state.password);

        const encryptedPKey = this.encryptPrivateKey(encryptKey(passwordToBuffer), privateKey).hex;

        this.props.addWallet(address, encryptedPKey, name);


    };

    render()
    {

        const { isPassValid, nameLengthIsOk} = this.state;

        return (
            <div className="row p-4">
            <div className="col-md-12">
                <Paper className="p-4">


                    <TextField
                        value={this.state.privateKey}
                        required

                        id="priKeyforUnlock"
                        label="Private Key"
                        className="text-center bmd-label-static mt-2"
                        margin="normal"
                        onChange={this.handleChange("privateKey")}
                        helperText="Enter your private key "
                    />
                    <br/>
                    <TextField
                        value={this.state.name}
                        required

                        label="Wallet Name"
                        className="text-center bmd-label-static mt-2"
                        margin="normal"
                        onChange={this.handleChange("name")}
                        helperText="enter at least 5 characters"
                    /><br/>
                    <TextField
                        value={this.state.password}
                        required

                        label="Wallet Password"
                        className="text-center bmd-label-static mt-2"
                        margin="normal"
                        onChange={this.handleChange("password")}
                        helperText="enter at least 8 characters"
                    /><br/>

                    <Button
                        disabled={!(isPassValid && nameLengthIsOk && this.state.privateKeyIsValid)}
                        onClick={this.handleChange("unlockWallet")}
                        className="btn btn-sm  btn-primary mt-4 "> Unlock </Button>

                </Paper></div>
        </div>)

    }



}


function mapStateToProps(state) {
    return {

        wallets: state.walletsReducer.wallets

    };
}

const mapDispatchToProps = (dispatch) => {


    return {

        addWallet: (address, key, name) => {
            dispatch(setWallet(address, key, name))
        }

    }

};

export default     connect(mapStateToProps, mapDispatchToProps) (withRouter(Add));