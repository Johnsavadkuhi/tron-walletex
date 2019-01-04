/*eslint-disable no-script-url*/
import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {compose} from "redux";
// import {decryptString, encryptKey, encryptString} from "../../services/encryption_js";
import NotBeforeAddWallet from "../../Notifications/NotbeforeAddWallet";
import Add from "./Add";
import CreateWallet from './CreateWallet';


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


class AddWallet extends Component {

    constructor(props) {

        super(props);


        this.state = {

            selectedValue: "",

        };
    }

    handleChange = nameOf => event => {

        this.setState({selectedValue: event.target.value});

    };

    uploadFile = (event) => {


        let file = event.target.files[0];

        console.log("file data :  ", file);

        if (file) {
            let data = new FormData();
            data.append('file', file);
            // axios.post('/files', data)...
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            console.log(e.target.result);

        };
        reader.readAsText(file);


    };


    // encryptPrivateKey = (password, hexString) => {
    //     return encryptString(password, hexString);
    // };
    //
    //
    // decryptFile = (password, hexString) => {
    //
    //     return decryptString(password, encryptString(encryptKey(password), hexString));
    // };

    render() {

        const {selectedValue} = this.state;

        const {classes} = this.props;

        return (

            <div className="container " style={{height: '400px'}}>

                <div className="row ">

                    <div className="col-md-4  ">

                        <FormControl component="fieldset" className={classes.formControl }>

                            <FormLabel component="legend">Select a Method to Unlock your Wallets</FormLabel>

                            <RadioGroup
                                aria-label="Select a Method "
                                name=""
                                className={classes.group+ 'header white'}
                                value={this.state.selectedValue}
                                onChange={this.handleChange('selectedValue')}>

                                <FormControlLabel value="registernewwallet" control={<Radio/>}
                                                  label="Regist new Wallet"/>
                                <FormControlLabel value="addwithprivatekey" control={<Radio/>}
                                                  label="Import with Private Key"/>

                                {/*<FormControlLabel disabled={true} value="addWithKeystore" control={<Radio/>}*/}
                                {/*label="Add with KeyStore"/>*/}

                            </RadioGroup>

                        </FormControl>


                    </div>

                    <hr className="uk-divider"/>
                    <div className="col-md-8 col-sm-12 text-center p-4 ">
                        {
                            selectedValue === "registernewwallet" ?

                                <CreateWallet/>


                                : selectedValue === "addwithprivatekey" ?

                                <Add/>


                                : selectedValue === "addWithKeystore" ?

                                    <div>

                                        {/*<input type="file" id="fileUpload" multiple accept="txt/*"*/}
                                        {/*style={{display: 'none'}}*/}

                                        {/*onChange={this.uploadFile}/>*/}

                                        {/*<label htmlFor="fileUpload"> Upload your KeyStore</label>*/}

                                    </div>

                                    : <NotBeforeAddWallet/>
                        }
                    </div>
                </div>
                <div className="row">


                </div>


            </div>);

    }
}


export default compose(
    withStyles(styles))(withRouter(AddWallet));