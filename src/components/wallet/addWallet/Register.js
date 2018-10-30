import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Stepper from "@material-ui/core/Stepper/Stepper";
import Step from "@material-ui/core/Step/Step";
import StepLabel from "@material-ui/core/StepLabel/StepLabel";
import StepContent from "@material-ui/core/StepContent/StepContent";
import Button from "@material-ui/core/Button/Button";
import {tu} from "../../../utils/i18n";
import Typography from "@material-ui/core/Typography/Typography";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {generateAccount} from "@tronscan/client/src/utils/account";
import TextField from "@material-ui/core/TextField/TextField";
import {_downloadTxtFile, downloadFile} from "../../../functions";
import {encryptKey, encryptString} from "../../../services/encryption_js";
import Input from "@material-ui/core/Input/Input";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {setWallet} from "../../../mainRedux/actions/actions";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    root: {
        width: '90%',
    },

    backButton: {
        marginRight: theme.spacing.unit,

    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },

});

function getSteps() {
    return ['Select a Wallet Name', 'Enter a Password', 'Download your Wallet KeyStore' , 'Copy your Wallet PrivateKey'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Enter Wallet Name';
        case 1:
            return 'Enter a Password ';
        case 2:
            return 'Download your Wallet KeyStore ';
        case 3:
            return 'Copy your Wallet PrivateKey'
        default:
            return 'Uknown stepIndex';
    }
}


class Register extends React.Component {

    constructor() {

        super();

        this.state = {


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


    //the methods of steeper

    getSteps = () => {

        return [<h6 className="text-muted"> Enter Name</h6>,
            <h6 className="text-muted"> Enter a Strong Password</h6>,
            <h6 className="text-muted">Download KeyStore</h6>,
            <h6 className="text-muted">Copy Private Key </h6>];
    };

    getStepContent = (stepIndex) => {

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

                        <br/>




                    </form>

                );
            case 1 :

return (
                <TextField
                    value={this.state.password}
                    type="password"
                    required
                    id="password"
                    label="password"
                    className="text-center bmd-label-static mt-2"
                    margin="normal"
                    onChange={this.handleChange("password")}
                    helperText="Enter at lease 8 characters"

                />);
            case 2:

                const privateKey = this.state.privateKey;
                const passwordToBuffer = new Buffer(this.state.password);

                return downloadFile(_downloadTxtFile, encryptString(encryptKey(passwordToBuffer), privateKey).hex);

            case 3:

                return this.getPrivateKey(this.state.privateKey);

            default:

                return 'Uknown stepIndex';
        }
    };

    handleNext = () => {
        const {activeStep} = this.state;


        this.setState({
            activeStep: activeStep + 1,
        });

        if (this.state.activeStep === 1)
            this.createWallet();


    };

    handleBack = () => {
        const {activeStep} = this.state;
        this.setState({
            activeStep: activeStep - 1,
        });
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
            address: "",
            privateKey: "",

        });
        this.createWallet();
    };



    render() {

        const steps = this.getSteps();
        const {activeStep, isPassValid, nameLengthIsOk} = this.state;


        return (

            <div className="row p-4">
                <div className="col-md-12">
                    <Paper className="p-4">

                        <Stepper activeStep={activeStep} orientation="vertical">

                            {steps.map((label, index) => {

                                return (

                                    <Step key={index}>

                                        <StepLabel>{label}</StepLabel>

                                        <StepContent>

                                            <div>{this.getStepContent(index)}</div>

                                            {/*start div */}

                                            <div className=" mt-2 mb-2">
                                                <div>

                                                    <Button

                                                        disabled={activeStep === 0}
                                                        onClick={this.handleBack}
                                                        className="btn btn-secondary btn-sm font-weight-normal">
                                                        {tu('back')}

                                                    </Button>

                                                    <Button
                                                        // disabled={ !((isPassValid ===false ) && (nameLengthIsOk===false))}
                                                        disabled={!(isPassValid && nameLengthIsOk)}
                                                        className="btn btn-info btn-sm font-weight-normal"
                                                        variant="contained"
                                                        onClick={this.handleNext}>


                                                        {activeStep === steps.length - 1 ? tu('finish') : tu('next')}

                                                    </Button>

                                                    {/*{activeStep===2 ? <button className="btn btn-info btn-sm font-weight-normal"> Print</button> : null}*/}

                                                </div>
                                            </div>

                                            {/*end div */}

                                        </StepContent>
                                    </Step>
                                );
                            })}

                        </Stepper>

                        {activeStep === steps.length &&

                        (
                            <Paper className="text-center" square elevation={0}>

                                <Typography className="text-primary text-center mb-3">All steps completed</Typography>


                                <Button onClick={this.handleReset}
                                        className="btn btn-primary btn-sm font-weight-normal">
                                    {tu('reset')}
                                </Button>

                                <Button onClick={this.handleChange("nextAfterRegister")}

                                        className="btn btn-success btn-sm font-weight-normal">

                                    {tu('enter')}

                                </Button>

                            </Paper>
                        )}

                    </Paper>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));