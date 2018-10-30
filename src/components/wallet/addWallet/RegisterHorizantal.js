import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField/TextField";
import {_downloadTxtFile, downloadFile} from "../../../functions";
import {encryptString , encryptKey} from "../../../services/encryption_js";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {generateAccount} from "@tronscan/client/src/utils/account";
import Input from "@material-ui/core/Input/Input";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {setWallet} from "../../../mainRedux/actions/actions";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

class RegisterHorizantal extends React.Component {
    state = {
        address: "",
        privateKey: "",
        password: "",
        showPassword: false,
        name: "",
        activeStep: 0,
        value: 0,
        isPassValid: false,
        nameExist: false,
        nameLengthIsOk: false,
        privateKeyIsValid: false,
        passWarning: true,
        welletExist: false
    };
    getSteps = ()=> {
        return ['Select a Wallet Name', 'Enter a Password', 'Download your Wallet KeyStore' , 'Copy your Wallet PrivateKey'];
    };

    getStepContent=(stepIndex)=> {

        switch (stepIndex) {
            case 0:

                return (<form>

                    <TextField
                        value={this.state.name}
                        type="text"
                        id="walletName"
                        label="Wallet Name"
                        className="text-center bmd-label-static mt-2"
                        margin="normal"
                        onChange={this.handleChange("name")}
                        helperText="Enter at least 5 characters"/>

                </form>);

            case 1:
                return (
                    <form>
                        <TextField
                            value={this.state.password}
                            type="password"
                            required
                            id="password"
                            label="password"
                            className="text-center bmd-label-static mt-2"
                            margin="normal"
                            onChange={this.handleChange("password")}
                            helperText="Enter at lease 8 characters"/>

                    </form>);

            case 2:

                const privateKey = this.state.privateKey;
                const passwordToBuffer = new Buffer(this.state.password);

                return <div>{downloadFile(_downloadTxtFile, encryptString(encryptKey(passwordToBuffer), privateKey).hex)}</div>

            case 3:

                return  <form>{this.getPrivateKey(this.state.privateKey)}</form>;

            default:
                return 'Uknown stepIndex';
        }
    };

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

                    if (w.length === 0) {
                        console.log("at line 175 : ", w.length);
                        this.setState({address: address, privateKeyIsValid: true, welletExist: false});

                    } else {
                        console.log("at line 179 : ", w.length);

                        this.setState({address: "", privateKeyIsValid: false, welletExist: true});

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
                    this.setState({nameLengthIsOk: true, [nameOf]: event.target.value})

                } else {
                    this.setState({nameLengthIsOk: false, [nameOf]: event.target.value})
                }


                break;


            default:
                return;
        }

    };

    addWalletSafe = (address, privateKey, name) => {

        const passwordToBuffer = new Buffer(this.state.password);

        const encryptedPKey = this.encryptPrivateKey(encryptKey(passwordToBuffer), privateKey).hex;

        this.props.addWallet(address, encryptedPKey, name);

    };
    createWallet = () => {

        const account = generateAccount();

        this.setState({

            address: account.address,
            privateKey: account.privateKey,

        });

    };
    encryptPrivateKey = (password, hexString) => {
        return encryptString(password, hexString);
    };
    getPrivateKey = (pKey) => {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10">

                        <Input
                            value={pKey}
                            className="form-control text-sm-left"
                            disabled
                            inputProps={{'aria-label': 'privateKey',}}
                        />
                    </div>

                    <div className="col-md-2">

                        <div className="text-center">

                            <CopyToClipboard text={pKey}>
                                <Button className="btn btn-info btn-sm mt-2 text-center " variant="contained">
                                    <i className="fa fa-paste"/>
                                </Button>
                            </CopyToClipboard>

                        </div>
                    </div>
                </div>
            </div>
        );
    };





    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
        if (this.state.activeStep === 1)
            this.createWallet();

    };


    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    render() {

        const steps = this.getSteps();
        const { activeStep } = this.state;

        return (
            <div >
                <Stepper  activeStep={activeStep} alternativeLabel >
                    {steps.map(label => {
                        return (
                            <Step key={label}>
                                <StepLabel  >{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div>
                    {this.state.activeStep === steps.length ? (
                        <div>
                            <Typography >All steps completed</Typography>
                            <Button onClick={this.handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div  className="uk-text-center uk-margin-top">
                            <div>{this.getStepContent(activeStep)}</div>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={this.handleBack}

                                >
                                    Back
                                </Button>

                                <Button variant="contained" color="primary" onClick={this.handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

RegisterHorizantal.propTypes = {
    classes: PropTypes.object,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterHorizantal));