import React from 'react';
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
import {encryptKey, encryptString} from "../../../services/encryption_js";
import {generateAccount} from "@tronscan/client/src/utils/account";
import {setWallet} from "../../../mainRedux/actions/actions";
import connect from "react-redux/es/connect/connect";


const theme = createMuiTheme({
    palette: {

        primary: green,
    },
    typography: {useNextVariants: true},
});


class CreateWallet extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            address: "",
            privateKey: "",

            walletName: '',
            password: '',
            helperName: 'Wallet name is required.',
            errorName: false,

            helperPassword: 'Strong password is required.',
            errorPassword: false

        }
    }


    handlerChange = async event => {


        switch (event.target.name) {


            case 'walletName' :

                this.setState({walletName: event.target.value.trim()});

                if (event.target.value.length > 0 && event.target.value !== "") {
                    this.setState({helperName: 'Name is Ok ', errorName: false});

                } else {

                    this.setState({helperName: 'Wallet name is required.', errorName: true});

                }

                break;

            case 'password' :

                this.setState({password: event.target.value.trim()});

                if (event.target.value.length < 8) {
                    this.setState({errorPassword: true, helperPassword: 'password must be at least 8 characters'});

                    if (event.target.value === "") {

                        this.setState({errorPassword: false, helperPassword: 'Strong password is required '});
                    }

                } else if (event.target.value.length >= 8) {

                    this.setState({errorPassword: false, helperPassword: 'Password is Ok '})

                }


                break;

            default :


                break;

        }
    };


    handlerClick = async event => {

       if( this.validation())
       {

           await this.createWallet() ;

            console.log("address : " , this.state.address , "\n"  , "private Key : " , this.state.privateKey) ;

            this.addWalletSafe(this.state.address , this.state.privateKey , this.state.walletName);

       }



    };


    stateOfWalletNameTextField = () => {

        if (this.state.walletName.length === 0) {


            return <TextFormatIcon/>;


        } else {


            return (this.state.errorName ? <WarningIcon color="error"/> : <CheckIcon color="primary"/>);

        }

    };


    stateOfPasswordTextField = () => {

        if (this.state.password.length === 0) {


            return <VisibilitySharpIcon/>;


        } else {


            return (this.state.errorPassword ? <WarningIcon color="error"/> : <CheckIcon color="primary"/>);

        }

    };


    validation = () => {

        if (this.state.walletName.length > 0) {

            if (this.state.password.length > 8) {

                return true;

            }

        }

        return false;

    };


    createWallet = () => {

        const account = generateAccount();

        this.setState({

            address: account.address,
            privateKey: account.privateKey,

        });

    };


    addWalletSafe = (address, privateKey, name) => {

        const passwordToBuffer = new Buffer(this.state.password);

        const encryptedPKey = this.encryptPrivateKey(encryptKey(passwordToBuffer), privateKey).hex;

        this.props.addWallet(address, encryptedPKey, name);

    };



    encryptPrivateKey = (password, hexString) => {

        return encryptString(password, hexString);
    };


    TextFields = () => {


        return <

            div className="messageInput">

            <TextField

                className="m-2"
                label="Name "
                name="walletName"
                variant="outlined"
                placeholder="Example: Savadkuhi"
                required
                fullWidth
                onChange={this.handlerChange}
                value={this.state.walletName}
                helperText={this.state.helperName}
                error={this.state.errorName}
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


    render() {

        return (<div>

            <div className={'messageInput'}>

                <MuiThemeProvider theme={theme}>

                    <div className="container">

                        <div className="row">

                            <div className="col-md-12">

                                {this.TextFields()}


                            </div>

                        </div>


                    </div>


                </MuiThemeProvider>

                <div className='m-4  footer'>

                    <Button onClick={this.handlerClick}>

                        Create

                    </Button>


                </div>
            </div>


        </div>);


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

export default connect(mapStateToProps, mapDispatchToProps)(CreateWallet);
