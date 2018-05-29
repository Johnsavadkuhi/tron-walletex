import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
// import Paper from '@material-ui/core/Paper';
import {tu} from "../../utils/i18n";
import xhr from "axios/index";
import {BarLoader} from "../common/loaders";
import {connect} from "react-redux";
import {deleteTokensBalances, deleteWallet, loadTokenBalances} from "../../mainRedux/actions/actions";
import {find} from "lodash";
import {FormattedDate, FormattedNumber, FormattedTime} from "react-intl";
import {ONE_TRX} from "../../constants";
import {Client} from "@tronscan/client";
import FreezeBalanceModal from "../../components/account/FreezeBalanceModal";
import {buildUnfreezeBalance} from "@tronprotocol/wallet-api/src/utils/transaction";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import Transactions from "./Transactions";
import Transfers from "../transactions/CommonTransfers_js";

import {compose} from "redux";
//expand menu
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import {withRouter} from "react-router-dom";
import Notifications from "./notifications";


// const ITEM_HEIGHT = 48;


const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});



class  Wallet extends Component{

    constructor(props)
    {
        super(props);

        this.state = {

            //modal is for freeze and unfreeze handler
            modal : null ,
            // for tabs
            value : 0 ,
            anchorEl: null,
            waitingForTrx: false,
            trxRequestResponse: {
                success: false,
                code: -1,
                message: '',
            },
            expanded: null,
        }
    }


    handleChangeForExpand = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };


    componentDidMount()
    {
        this.reloadTokens();

    }

    // for reloading Tokens
    reloadTokens = () => {

        let address = this.props.walletinfo.address ;

        let {loadTokenBalances , deleteTokensBalances} = this.props;
        console.log("ReducerBalances : " , this.props.balancesReducer.length );

        if(this.props.balancesReducer.length  > 1 ) {

            deleteTokensBalances(address);
            console.log("deleted object :" , deleteTokensBalances.length);

        }

        loadTokenBalances(address);


    };

    requestTrx = async () => {

        this.setState({waitingForTrx: true});

        try {

            let address = this.props.walletinfo.address ;

            let {data} = await xhr.post(`https://tronscan.org/request-coins`, {
                address,
            });

            this.setState({
                trxRequestResponse: {
                    success: data.success,
                    code: data.code,
                    message: data.message,
                },
            });


            // setTimeout(() => this.reloadTokens(), 1200);

            this.reloadTokens() ;

        } catch (e) {
            this.setState({
                trxRequestResponse: {
                    success: false,
                    code: 9,
                    message: tu("An_unknown_error_occurred,_please_try_again_in_a_few_minutes")
                },
            })
        }

        finally {

            this.setState({

                waitingForTrx: false

            });
        }
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = name => event => {

        if([name][0] === 'remove')
        {
            // this.props.logout();
            let {deleteWallet} = this.props ;

            deleteWallet(this.props.walletinfo.address);

            console.log("this.state.address : " , this.props.walletinfo.address);

            console.log('your wallet removed');
        }

        this.setState({ anchorEl: null });

    };

    handleChange =(event , value) => {

        this.setState({value:value});

    };

    showFreezeBalance = () => {
        this.setState({
            modal: (
                <FreezeBalanceModal
                    walletinfo ={this.props.walletinfo}
                    onHide={() => this.setState({ modal: null })}
                    onConfirm={() => {
                        this.setState({ modal: null });
                        setTimeout(() => this.reloadTokens(), 1200);
                    }}
                />
            )
        })
    };

    unfreeze = async () => {

        let client = new Client();
        let address = this.props.walletinfo.address ;

        // let address = this.props.address;
        let transaction = buildUnfreezeBalance(address);
        // let success = await client.signTransaction("", transaction);
        let success = await  client.sendTransaction(this.props.walletinfo.key ,transaction);

        if (success) {
            this.setState({
                modal: null,
            });

            // setTimeout(() => this.reloadTokens(), 1200);

            this.reloadTokens() ;

        } else {
            this.setState({
                modal: (
                    <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered" >
                        <ModalBody className="text-center">
                            <p>
                                Unable to unfreeze TRX. This could be caused because the minimal freeze period hasn't been reached yet.
                            </p>
                            <button className="btn btn-primary mr-2" onClick={() => this.setState({ modal: null })}>
                                {tu("Close")}
                            </button>
                        </ModalBody>
                    </Modal>
                ),
            });
        }
    };

    unfreezeBalance = async () => {

        this.setState({
            modal: (
                <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered" >
                    <ModalHeader className="text-center" toggle={this.hideModal}>
                        {tu("Unfreeze TRX")}
                    </ModalHeader>
                    <ModalBody className="text-center">
                        <p>
                            Are you sure you want to unfreeze your TRX?
                        </p>
                        <button className="btn btn-secondary mr-2" onClick={() => this.setState({ modal: null })}>
                            {tu("Cancel")}
                        </button>
                        <button className="btn btn-danger" onClick={this.unfreeze}>
                            <i className="fa fa-fire mr-2"/>
                            {tu("Unfreeze TRX")}
                        </button>
                    </ModalBody>
                </Modal>
            )
        });
    };


//***************************************************************************************************************//

                                                 Renders

//***************************************************************************************************************//

    renderTronix() {

        let tokenBalances = [] ;
        let tb  = this.props.balancesReducer;

        tb.filter(val =>{

            return val.address === this.props.walletinfo.address

        }).map((obj)=>(tokenBalances=obj.balances));


        if (tokenBalances.length === 0) {
            return (
                <span >


                    {/*<BarLoader/>*/}


                </span>
            );
        }

        let trx = find(tokenBalances, token => token.name === "TRX");

        return (
            <span className="t-3">

                {
                    trx && <span className="text-center">
                        {/*<h2 className="text-secondary">{tu("trx_balance")}</h2>*/}

                        <FormattedNumber  value={trx.balance}/> Trx
                    </span>
                }

            </span>
        )
    }

    renderTestnetRequest() {

        let {waitingForTrx, trxRequestResponse} = this.state;

        if (waitingForTrx) {
            return (
                <div className="text-center d-flex justify-content-center p-4">
                    <BarLoader/>
                </div>
            );
        }

        if (trxRequestResponse.code !== -1) {
            if (trxRequestResponse.success === true) {
                return (
                    <div className="alert alert-success text-success">
                        1000000 TRX {tu("have_been_added_to_your_account!")}
                    </div>
                )
            } else {
                return (
                    <div className="alert alert-warning text-warning">
                        {trxRequestResponse.message}
                    </div>
                )
            }
        }


        return (

            <React.Fragment>
                <button className="btn btn-primary" onClick={this.requestTrx}>
                    {tu("request_trx_for_testing")}
                </button>
                <p className="pt-1">
                    {/*{tu("information_message_1")}*/}
                </p>
            </React.Fragment>

        );
    }

    renderTokens() {

        let tokenBalances = [] ;
        let tb  = this.props.balancesReducer;


        tb.filter(val =>{

            return val.address === this.props.walletinfo.address

        }).map((obj)=>(tokenBalances=obj.balances));


        if (tokenBalances.length === 0) {
            return (
                <div className="text-center d-flex justify-content-center p-4">
                    <BarLoader/>
                </div>
            );
        }

        return (
            <table className="table border-0 m-0"  >
                <thead >
                <tr>
                    <th>{tu("name")}</th>
                    <th className="text-right">{tu("balance")}</th>
                </tr>
                </thead>
                <tbody >
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

    renderFrozenTokens()
    {
        let frozen = {total:0 , balances:[]};
        const fr = this.props.balancesReducer;

        fr.filter(val =>{

            return val.address === this.props.walletinfo.address

        }).map((obj)=>(frozen=obj.frozen));


        if (frozen.balances.length === 0) {
            return null;
        }




        return (
            <table className="table border-0 m-0">
                <thead className="thead-light">
                <tr>
                    <th>{tu("amount")}</th>
                    <th className="text-right">{tu("expires")}</th>
                </tr>
                </thead>
                <tbody>
                {
                    frozen.balances.map((balance, index) => (
                        <tr key={index}>
                            <td>
                                <FormattedNumber value={balance.amount / ONE_TRX} />
                            </td>
                            <td className="text-right">
                                <FormattedDate value={balance.expires}/>&nbsp;
                                <FormattedTime value={balance.expires}/>
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

        const { classes } = this.props;
        const { expanded } = this.state;

        const {anchorEl , modal} = this.state;

        let frozen = {total:0 , balances:[]};

        let bandwidth={ assets:{},freeNetUsed: 0, freeNetLimit: 0,
            freeNetRemaining: 0, freeNetPercentage: 0,
            netUsed: 0 ,netLimit:0 , netPercentage:0 ,netRemaining:0 };

        let fr = this.props.balancesReducer;


        fr.filter(val =>{

            return val.address === this.props.walletinfo.address

        }).map((obj)=>{frozen=obj.frozen ; bandwidth = obj.bandwidth});


        let address = this.props.walletinfo.address  ;

        let hasFrozen = frozen.balances.length > 0;





            return (

                    <div className="mt-2 row" >
                        {modal}

                        <div className="col-md-12 col-sm-12 col-lg-12 ">

                            <Card className="mt-2">


                                {/* Start : Header of Card : avatar and Menu */}
                                <CardHeader

                                    avatar={

                                        <Avatar aria-label="Recipe"  >
                                            <small className="small">TRX</small>
                                        </Avatar>
                                    }

                                    action={

                                        <div>
                                            <Notifications wallet={this.props.walletinfo}/>


                                            {/*<IconButton*/}
                                                {/*aria-label="More"*/}
                                                {/*aria-owns={anchorEl ? 'long-menu' : null}*/}
                                                {/*aria-haspopup="true"*/}
                                                {/*onClick={this.handleClick}>*/}

                                                {/*<MoreVertIcon />*/}

                                            {/*</IconButton>*/}
                                            {/*<Menu*/}
                                                {/*id="long-menu"*/}
                                                {/*anchorEl={anchorEl}*/}
                                                {/*open={Boolean(anchorEl)}*/}
                                                {/*onClose={this.handleClose}*/}
                                                {/*PaperProps={{*/}
                                                    {/*style: {*/}
                                                        {/*maxHeight: ITEM_HEIGHT * 4.5,*/}
                                                        {/*width: 200,*/}
                                                    {/*},*/}
                                                {/*}}>*/}

                                                {/*<MenuItem  onClick={this.handleClose('edite')}>Edit</MenuItem>*/}
                                                {/*<MenuItem  onClick={this.handleClose('remove')}>Remove</MenuItem>*/}
                                                {/*)*/}

                                            {/*</Menu>*/}



                                        </div>
                                    }

                                    title={this.props.walletinfo.name}
                                    subheader={<span className="text-success small ">Balance :{this.renderTronix()} </span>}
                                />

                                {/* END  : Header */}





                                <CardContent>

                                    <div className={classes.root}>

                                    <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChangeForExpand('panel1')}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            {/*<Typography className={classes.heading}>Wallet</Typography>*/}
                                            <Typography className={classes.secondaryHeading}> Wallet Info </Typography>
                                        </ExpansionPanelSummary>

                                        <ExpansionPanelDetails>

                                            <div className="container">

                                                <div className="row">

                                            <div className="col-md-4 mt-3 mt-md-0">
                                                <div className="card h-100 text-center widget-icon">
                                                    {/*<WidgetIcon className="fa fa-clock text-primary"  />*/}
                                                    <div className="card-body">

                                                        <p className="text-primary">{frozen.total / ONE_TRX}</p>

                                                        Tron Power
                                                    </div>
                                                </div>
                                            </div>

                                                <div className="col-md-4 mt-3 mt-md-0">
                                                    <div className="card h-100 text-center widget-icon">
                                                        {/*<WidgetIcon className="fa fa-clock text-primary"  />*/}

                                                        <div className="card-body">

                                                            <p className="text-primary">{bandwidth.netRemaining}</p>

                                                            Bandwidth

                                                        </div>

                                                    </div>
                                                </div>


                                                    <div className="col-md-4 mt-3 mt-md-0">
                                                        <div className="card h-100 text-center widget-icon">

                                                            {/*<WidgetIcon className="fa fa-clock text-primary"  />*/}

                                                            <div className="card-body">

                                                              Transactions

                                                            </div>

                                                        </div>

                                                    </div>

                                            </div>

                                                <div className="row mt-4 ">
                                                    <div className="col-me-12">
                                                    <div className="text-center">

                                                        <p className="text-truncate">Address : {address}</p>

                                                    </div>
                                                </div>
                                                </div>

                                            </div>


                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                        <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChangeForExpand('panel4')}>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                {/*<Typography className={classes.heading}>Tron Power</Typography>*/}
                                                <Typography className={classes.secondaryHeading}>
                                                    Tokens
                                                </Typography>
                                            </ExpansionPanelSummary>

                                            <ExpansionPanelDetails className="text-center">

                                                <div className="container">

                                                    <div className="row ">
                                                        <div className="col-md-3"></div>
                                                        <div className="col-md-6">

                                                            <div className="card" >
                                                                <div className="card-header border-bottom-0 text-center bg-info text-white">

                                                                    {tu("tokens")}

                                                                </div>

                                                                <div className="card-body p-0 border-0" style={{minHeight:100 , maxHeight : 100 , overflowY:'scroll' }} >

                                                                    {this.renderTokens()}

                                                                </div>

                                                            </div>


                                                        </div>
                                                        <div className="col-md-3"></div>

                                                    </div>
                                                </div>

                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>

                                    <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChangeForExpand('panel2')}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            {/*<Typography className={classes.heading}>Tron Power</Typography>*/}
                                            <Typography className={classes.secondaryHeading}>
                                             TRON POWER
                                            </Typography>
                                        </ExpansionPanelSummary>

                                        <ExpansionPanelDetails className="text-center">

                                            <div className="container">

                                                <div className="row ">
                                                    <div className="col-md-3">




                                                    </div>
                                                    <div className="col-md-6">

                                                        <small className="text-muted mt-2 text-justify">
                                                            TRX can be frozen/locked to gain Tron Power and enable additional features. For example, with Tron Power you can vote for Super Representatives.
                                                            Frozen tokens are "locked" for a period of 3 days. During this period the frozen TRX cannot be traded.
                                                            After this period you can unfreeze the TRX and trade the tokens.

                                                        </small>
                                                        <div className="mt-4 p-2">

                                                            {this.renderFrozenTokens()}

                                                            {hasFrozen &&

                                                            <button className="btn btn-danger mr-2 " onClick={this.unfreezeBalance}>
                                                            <i className="fa fa-fire mr-2"/>
                                                            Unfreeze
                                                            </button>

                                                            }

                                                            <button className="btn btn-primary mr-2" onClick={this.showFreezeBalance}>
                                                            <i className="fa fa-snowflake mr-2"/>
                                                            Freeze
                                                            </button>

                                                            </div>



                                                    </div>
                                                    <div className="col-md-3"></div>

                                                </div>
                                            </div>

                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                    <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChangeForExpand('panel5')}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            {/*<Typography className={classes.heading}>Tron Power</Typography>*/}
                                            <Typography className={classes.secondaryHeading}>
                                                Transactions
                                            </Typography>
                                        </ExpansionPanelSummary>

                                        <ExpansionPanelDetails className="text-center">

                                            <div className="container">

                                                <div className="row ">
                                                    <div className="col-md-12">

                                                        {/*<Transactions filter = {{address:address}} pageSize={5} />*/}

                                                        {
                                                            <Transfers filter = {{address:address}} pageSize={5}   />
                                                        }

                                                    </div>

                                                </div>
                                            </div>

                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                        <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChangeForExpand('panel3')}>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                {/*<Typography className={classes.heading}></Typography>*/}
                                                <Typography className={classes.secondaryHeading}>
                                                    Request Trx For Test
                                                </Typography>
                                            </ExpansionPanelSummary>

                                            <ExpansionPanelDetails className="text-center">

                                                <div className="container">

                                                    <div className="row ">
                                                        <div className="col-md-3">

                                                        </div>
                                                        <div className="col-md-6">

                                                            <small className="text-muted mt-2 mb-2 text-justify">
                                                                When requesting TRX you will receive 10000 TRX which you can use for testing on the testnet.
                                                                You may only request TRX 10 times per account.
                                                            </small>


                                                            {this.renderTestnetRequest()}


                                                            </div>
                                                        <div className="col-md-3"> </div>

                                                    </div>
                                                </div>

                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>

                                </div>

                                </CardContent>
                                {/*End: the Card Container*/}
                                {/* request Trx for Test */}
                            </Card>
                        </div>
                    </div>

        );
    }
}


function mapStateToProps(state) {

    return {

        // account: state.app.account,
        // tokenBalances: state.account.tokens,
        // frozen: state.account.frozen,

        balancesReducer: state.balancesReducer.walletBalances,

    };
}

const mapDispatchToProps = {

    loadTokenBalances,
    deleteTokensBalances,
    deleteWallet


};

// export default connect(mapStateToProps, mapDispatchToProps)(Wallet)


export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(Wallet);