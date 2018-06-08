/*eslint-disable no-script-url*/
import React , {Component } from 'react';
import {generateAccount} from "@tronscan/client/src/utils/account";
import {connect} from "react-redux";
import {tu} from "../../utils/i18n";
import {withRouter} from "react-router-dom";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import StepContent from '@material-ui/core/StepContent';
import {_downloadTxtFile, downloadFile } from "../../functions"
import {setWallet} from "../../mainRedux/actions/actions";
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {compose} from "redux"   ;
import {encryptKey  , decryptString , encryptString} from  "../../services/encryption_js";
import TextField from "@material-ui/core/TextField/TextField";
import  {pkToAddress  } from "@tronscan/client/src/utils/crypto";
import Input from '@material-ui/core/Input';
import { CopyToClipboard } from "react-copy-to-clipboard";
import NotBeforeAddWallet from "../../components/Notifications/NotbeforeAddWallet";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";


/**
 *
 * @param theme
 * @return {{root: {display: string}, formControl: {margin: number}, group: {margin: string}}}
 */
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

    /**
     *constructor
     * @param props
     */
    constructor(props) {

        super(props) ;
        this.handleClick = this.handleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);


        this.state = {

            _notificationSystem: null,

            selectedValue : "",
            address       : "",
            privateKey    : "",
            password      : "",
            showPassword  : false,
            name          :"",
            activeStep    : 0,
            value         :0,
            isPassValid   : false ,
            nameExist     :false ,
            nameLengthIsOk:false,
            privateKeyIsValid: false ,
            passWarning:true ,

        };
    }


    componentDidMount(){
        this.setState({_notificationSystem: this.refs.notificationSystem})
    }

    handleClick = message=>{

        let level = 'error'; // 'success', 'warning', 'error' or 'info'
        this.state._notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-gift"> </span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level,
            position: 'tr',
            autoDismiss: 15,
        });
    };


    /**
     * this method is used to upload keystore
     * @param event
     */
    uploadFile = (event) => {


        let file = event.target.files[0];

        console.log("file data :  " , file );

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


    addWalletSafe=(address , privateKey , name )=>
    {
        const passwordToBuffer = new Buffer(this.state.password);

        const encryptedPKey = this.encryptPrivateKey(encryptKey(passwordToBuffer) , privateKey).hex;

        this.props.addWallet(address , encryptedPKey , name );


    };


    handleChange = nameOf => event=>{

        let {privateKey , address ,name  } = this.state;


        switch ([nameOf][0])
        {
            case "handleClickShowPassword" :

                this.setState({ showPassword: !this.state.showPassword });

                break ;

            case "handleMouseDownPassword" :

                event.preventDefault();

                break ;

            case "nextAfterRegister" :

                // const passwordToBuffer = new Buffer(this.state.password);
                //
                // const encryptedPKey = this.encryptPrivateKey(encryptKey(passwordToBuffer) , privateKey).hex;

                // this.props.addWallet(address , privateKey , name );
                // this.props.addWallet(address , encryptedPKey , name );

                this.addWalletSafe(address , privateKey , name);

                this.props.history.push("/account");
                // this.props.history.push("/wallets") ;

                break ;


            case "unlockWallet":


                // this.addWalletSafe(address , privateKey , name);

                this.props.addWallet(address , privateKey , name );

                this.props.history.push("/account");

                break ;

            case "privateKey":


                this.setState({privateKey:event.target.value ,privateKeyIsValid:false});

                if(event.target.value.length === 64) {

                    let address = pkToAddress(event.target.value);

                    this.setState({address: address  ,privateKeyIsValid:true });
                }

                break ;


            case "selectedValue":

                this.setState({ selectedValue: event.target.value });

                break ;

            case "password" :

                this.setState({[nameOf]: event.target.value, isPassValid: false});

                if (event.target.value.length >= 8) {
                    this.setState({isPassValid: true});

                }

                else if (this.state.passWarning) {

                    this.handleClick("you should enter at least 8 characters");
                    this.setState({passWarning:false});
                }

                break ;

            case "name":

                const v = event.target.value ;

                if(v.length > 5 )
                {
                    this.setState({nameLengthIsOk:true })

                }else {
                    this.setState({nameLengthIsOk:false })
                }


                let x =   this.props.wallets.filter(val=>{

                    return val.name === v ;

                });


                if(x.length === 0) {


                    this.setState({

                        [nameOf]: event.target.value, nameExist:false

                    });

                } else {

                    this.setState({[nameOf]:"", nameExist:true});
                    this.handleClick("Wallet Name Already Exist") ;

                }

                break ;


            default:
                return ;
        }

    };

    /**
     * create a wallet
     */
    createWallet = () => {

        const account = generateAccount();

        this.setState({

            address: account.address,
            privateKey: account.privateKey,

        });

    };


    getSteps = () => {

        return [<h6 className="text-muted"> Enter a Strong Password</h6>,
            <h6 className="text-muted">Download KeyStore</h6>,
            <h6 className="text-muted">Copy Private Key </h6>];
    };


    /**
     *
     * @param stepIndex
     * @return {*}
     */
    getStepContent = (stepIndex) => {

        switch (stepIndex) {
            case 0:
                // return passForm();
              return (  <form>

                  <TextField
                      value={this.state.name}
                      type = "text"

                      id = "walletName"
                      label = "Wallet Name"
                      className = "text-center bmd-label-static mt-2"
                      margin = "normal"
                      onChange={this.handleChange("name")}
                      helperText="Enter at least 5 characters "
                  />
                 <br/>

                  <TextField
                        value={this.state.password}
                        type ="password"
                        required
                        id = "password"
                        label = "password"
                        className = "text-center bmd-label-static mt-2"
                        margin = "normal"
                        onChange={this.handleChange("password")}
                        helperText="Enter at lease 8 characters"

                    />


                  {/*<Input*/}

                      {/*className="text-center bmd-label-static mt-2 mb-3"*/}
                      {/*type={this.state.showPassword ? 'text' : 'password'}*/}
                      {/*value={this.state.password}*/}
                      {/*onChange={this.handleChange('password')}*/}
                      {/*placeholder="Password"*/}
                      {/*fullWidth*/}

                      {/*endAdornment={*/}
                          {/*<InputAdornment position="end">*/}
                              {/*<IconButton*/}
                                  {/*aria-label="Toggle password visibility"*/}
                                  {/*onClick={this.handleChange("handleClickShowPassword")}*/}
                                  {/*onMouseDown={this.handleChange("handleMouseDownPassword")}*/}
                              {/*>*/}
                                  {/*{this.state.showPassword ? <VisibilityOff /> : <Visibility />}*/}
                              {/*</IconButton>*/}
                          {/*</InputAdornment>*/}
                      {/*}*/}
                  {/*/>*/}




                </form>

              );

            case 1:

                const privateKey = this.state.privateKey ;
                const passwordToBuffer = new Buffer(this.state.password);

                return downloadFile(_downloadTxtFile , encryptString(encryptKey(passwordToBuffer) , privateKey).hex );

                case 2:

                    return this.getPrivateKey(this.state.privateKey);

                default:

                    return 'Uknown stepIndex';
        }
    };

    /**
     *
     * @param password
     * @param hexString
     * @return {{bytes, hex}}
     */
    encryptPrivateKey= (password ,hexString) => {
      return   encryptString(password , hexString )  ;
    };

    /**
     *
     * @param password
     * @param hexString
     * @return {*}
     */
    decryptFile =(password  , hexString )=>{

        return decryptString(password , encryptString(encryptKey(password ) , hexString) );
    };

    /**
     *
     */
    handleNext = () => {
        const {activeStep} = this.state;


        this.setState({
            activeStep: activeStep + 1,
        });

        if(this.state.activeStep===1)
            this.createWallet();


    };

    handleBack = () => {
        const {activeStep} = this.state;
        this.setState({
            activeStep: activeStep - 1,
        });
    };

    /**
     *
     */
    handleReset = () => {
        this.setState({
            activeStep: 0,
            address: "",
            privateKey: "",

        });
        this.createWallet();
    };

    /**
     *
     * @param pKey
     * @return {*}
     */
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
                                    <Button className="btn btn-info btn-sm mt-2 text-center " variant="raised">
                                        <i className="fa fa-paste" />
                                    </Button>
                                </CopyToClipboard>

                        </div>
                    </div>
                </div>
            </div>
        );
    };




    /*************************************************************
                         Render Methods
    *************************************************************/



    renderRegisterWallet= (activeStep , steps , isPassValid  , nameLengthIsOk) =>{

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
                                            disabled={ !(isPassValid && nameLengthIsOk)}
                                            className="btn btn-info btn-sm font-weight-normal"
                                            variant="raised"
                                            onClick={this.handleNext}>


                                            {activeStep === steps.length - 1 ? tu('finish') : tu('next') }

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
            )

            }


        </Paper>
            </div>
                </div>
        );
    };

    /**
     *
     * @return {*}
     */
    render() {

        const steps = this.getSteps();
        const {activeStep , selectedValue ,isPassValid , nameLengthIsOk} = this.state;


        const { classes } = this.props;



        return (

            <div className="container mt-4 mb-4" style={{height:'500px'}}>


            <div className="row" >
                <NotificationSystem ref="notificationSystem" style={style}/>


                <div className="col-md-4 ">

                        <div className={classes.root}>

                            <FormControl component="fieldset"  className={classes.formControl}>

                                <FormLabel component="legend">Select a Method to Unlock your Wallets</FormLabel>

                                <RadioGroup
                                    aria-label="Select a Method "
                                    name=""
                                    className={classes.group}
                                    value={this.state.selectedValue}
                                    onChange={this.handleChange('selectedValue')}>

                                    <FormControlLabel value="registernewwallet" control={<Radio />} label="Regist new Wallet" />
                                    <FormControlLabel value="addwithprivatekey" control={<Radio />} label="Add with Private Key" />
                                    <FormControlLabel disabled={true} value="addWithKeystore" control={<Radio />} label="Add with KeyStore" />

                                </RadioGroup>

                            </FormControl>

                        </div>

                </div>

                    <div className="col-md-8 col-sm-12 text-center p-2">
                    {
                        selectedValue==="registernewwallet"?

                            this.renderRegisterWallet(activeStep , steps , isPassValid , nameLengthIsOk)

                            :  selectedValue ==="addwithprivatekey" ?

                            <div className="row p-4">
                                <div className="col-md-12">
                                    <Paper className="p-4">

                                        <TextField
                                            value={this.state.privateKey}
                                            required
                                            fullWidth
                                            id = "priKeyforUnlock"
                                            label = "Private Key"
                                            className = "text-center bmd-label-static mt-2"
                                            margin = "normal"
                                            onChange={this.handleChange("privateKey")}
                                            helperText="Enter your private key "
                                        /><br/>

                                        <Button disabled={this.state.privateKeyIsValid ===false}  onClick={this.handleChange("unlockWallet")} className="btn btn-sm  btn-primary mt-4 " > Unlock </Button>

                                    </Paper></div></div>

                            :  selectedValue === "addWithKeystore"  ?

                                <div>

                                <input type="file" id="fileUpload" multiple accept="txt/*" style={{display:'none'}}

                    onChange={this.uploadFile}/>

                    <label htmlFor="fileUpload" > Upload your KeyStore</label>

                    </div>

                                : <NotBeforeAddWallet  />
                    }
                </div>
            </div>

        </div>);

    }
}



/**
 *
 * @param state
 * @return {{}}
 */
function mapStateToProps(state) {
    return {

        wallets : state.walletsReducer.wallets

    };
}


/**
 *
 * @param dispatch
 * @return {{addWallet: addWallet}}
 */
const mapDispatchToProps = (dispatch) => {


    return {

        addWallet:(address , key  , name ) =>{
            dispatch(setWallet(address  ,key , name  ))
        }

    }

};


export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)( withRouter(AddWallet));