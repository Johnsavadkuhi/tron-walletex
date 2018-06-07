/*eslint-disable no-script-url*/
import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";

// import {filter, find, includes, round, sortBy} from "lodash";
// import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime} from "react-intl";
import {tu} from "../../utils/i18n";
import {TextField} from "../../utils/formHelper";
import {ONE_TRX} from "../../constants";
// import Avatar from "../../common/Avatar";
import SweetAlert from "react-bootstrap-sweetalert";
// import Paging from "../../common/Paging";
// import {checkPageChanged} from "../../../utils/PagingUtils";
import {Client} from "@tronscan/client";
import {setTokens} from "../../mainRedux/actions/actions";
import {Sticky, StickyContainer} from "react-sticky";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {decryptString} from "../../services/encryption_js";


class BuyToken extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeToken: null,
            alert: null,
            amount: "",
            confirmed: false,
            confirmedParticipate: false,
            participateSuccess: false,
            loading: false,
            viewMode: 'grid',
            filters: {
                active: true,
                waiting: true,
            },
            confirmVisible: false,
            total: 0,
            pageSize: 25,
            page: 0,
            tokens: [],
            selectedWallet:'Select your Wallet',
            isSelectedWalletValid :false,
            modal : null ,
            modal1 :null,
            modal2:null ,
            privateKey:""
        };
    }


    handleChange =event =>{

        if(event.target.value  === "Select your Wallet")
          this.setState({ selectedWallet: event.target.value ,isSelectedWalletValid :false , modal:null })

        else
            this.setState({selectedWallet: event.target.value ,isSelectedWalletValid :true , modal:(

                    <SweetAlert
                        confirmBtnText="Decrypt"
                        input
                        inputType="password"
                        cancelBtnBsStyle="default"
                        title={ <small className="small">Enter your wallet password</small>}
                        required
                        onConfirm={this.onConfirm}
                        validationMsg="You must enter your password!"
                    />
                )})


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


    onConfirm = event =>{

        let { selectedWallet} = this.state;

        const obj =  this.props.wallets.filter(val => {

            return selectedWallet === val.address;

        });

        const pKey = decryptString(event , obj[0].key);



        if( this.isValidDecryptedPKey(selectedWallet , pKey) )
        {

            this.setState({modal:null , privateKey:pKey});

            this.setState({modal1:(<SweetAlert  success title="Success" onConfirm={this.hideAlert1}>

                    the private key was decrypted successfully

                </SweetAlert> )});

        }else {

            this.setState({modal:null});

            this.setState({modal2: (

                    <SweetAlert danger title="Wrong Password" confirmBtnText="Try again" onConfirm={this.hideAlert2 } >

                        you entered a wrong password! Try again

                    </SweetAlert>

                ) })

        }

    };


    hideAlert1 =()=>{

        this.setState({modal1:null });

    };


    hideAlert2=()=>{

        this.setState({modal2:null, privateKey:""});
        this.setState({modal:(

                <SweetAlert
                    confirmBtnText="Decrypt"
                    input
                    inputType="password"
                    cancelBtnBsStyle="default"
                    title={ <small className="small">Enter your wallet password</small>}
                    required
                    onConfirm={this.onConfirm}
                    validationMsg="You must enter your password!"
                />
            )

        })

    };







    toggleToken(token) {

        this.setState({
            activeToken: token,
            amount: 0,
            confirmed: false,
            confirmedParticipate: false,
            participateSuccess: false,
            loading: false,
        })

    }

    closeToken() {

        this.setState({

            activeToken: null,
            amount: 0,
            confirmed: false,
            confirmedParticipate: false,
            participateSuccess: false,
            loading: false,

        })

    }

    getTokenState = (token) => {

        let now = new Date().getTime();

        if (token.endTime < now || token.percentage === 100) {
            return 'finished';
        }

        if (token.startTime < now) {
            return 'active';
        }

        return 'waiting';
    };

    buyTokens = (token) => {

        let {amount} = this.state;

        this.setState({
            alert: (
                <SweetAlert
                    info
                    showCancel
                    confirmBtnText="Confirm Transaction"
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="default"
                    title="Are you sure?"
                    onConfirm={() => this.confirmTransaction(token)}
                    onCancel={() => this.setState({alert: null})}
                >
                    Are you sure you want to buy<br/>
                    {amount} {token.name} for {amount * (token.price / ONE_TRX)} TRX?

                </SweetAlert>
            ),
        });
    };

    containsToken(token) {

        let {activeToken} = this.state;

        if (!activeToken) {
            return false;
        }

        return activeToken.name === token.name;
    }

    loadPage = async (page = 0) => {

        this.setState({loading: true});

        let {pageSize} = this.state;

        let {tokens, total} = await new Client().getTokens({
            sort: '-name',
            limit: pageSize,
            start: page * pageSize,
            status: "ico",
        });

        this.setState({
            page,
            loading: false,
            tokens,
            total,
        });
    };

    componentDidMount() {
        this.loadPage();
    }

    componentDidUpdate() {

        // checkPageChanged(this, this.loadPage);

    }

    isValid = () => {
        let {amount} = this.state;
        return (amount > 0);
    };

    whichAddressSelected =() => {

        let {selectedWallet} = this.state ;

        let wallet ={address :"" , key:"" , name:""};

        let fr = this.props.wallets ;

        fr.filter(val =>{

            return val.address === selectedWallet

        }).map((obj)=>(wallet=obj));


        return wallet ;

    };

    submit = async (token) => {

        const wallet  =  this.whichAddressSelected();


        let {amount , privateKey} = this.state;

        this.setState({loading: true});

        console.log("participate", token);

        let isSuccess = await new Client().participateAsset(

            wallet.address,
            token.ownerAddress,
            token.name,
            amount * token.price)(privateKey);

        this.setState({
            activeToken: null,
            confirmedParticipate: true,
            participateSuccess: isSuccess,
            loading: false,
        });
    };

    renderGrid() {

        let {amount, tokens} = this.state;

        return (
            <div className="row">
                {
                    tokens.map((token, index) => (
                        <Fragment key={index + "-" + token.name}>
                            <div className="col-12 col-sm-6 col-lg-4 mb-3">
                                <div className="card token-card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title break-word">
                                            {/*<Avatar value={token.name} size={25} className="float-right"/>*/}
                                            {/*<TokenLink name={token.name}/>*/}
                                            {token.name}
                                        </h5>
                                        <p className="card-text break-word">
                                            {token.description}
                                        </p>
                                        {/*<p className="mb-0">*/}
                                        {/*<ExternalLink url={token.url} className="card-link text-primary text-center">*/}
                                        {/*Visit Website*/}
                                        {/*</ExternalLink>*/}
                                        {/*</p>*/}
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                      <span className="text-success">
                        <FormattedNumber  value={token.issued} className="text-success "/>&nbsp;
                      </span>
                                            <span className="text-muted ml-0">
                        <FormattedNumber value={token.totalSupply}/>
                      </span>
                                            <span className="float-right text-success">
                        {Math.ceil(token.percentage)}%
                      </span>

                                            <div className="progress1 mt-1">
                                                <div className="progress-bar1 bg-success" style={{width: token.percentage + '%'}}/>
                                            </div>


                                        </li>
                                        <li className="list-group-item">
                                            {
                                                this.getTokenState(token) === 'active' &&
                                                <div className="text-center">
                                                    ends&nbsp;
                                                    <FormattedRelative value={token.endTime} units="day"/>
                                                </div>
                                            }
                                            {
                                                this.getTokenState(token) === 'finished' &&
                                                <button className="btn btn-link btn-block" disabled={true}>
                                                    Finished
                                                </button>
                                            }
                                            {
                                                this.getTokenState(token) === 'waiting' &&
                                                <div className="text-center">
                                                    Starts <FormattedRelative value={token.endTime}/>
                                                </div>
                                            }
                                        </li>
                                    </ul>
                                    {
                                        (this.state.isSelectedWalletValid && this.getTokenState(token) === 'active') && (
                                            !this.containsToken(token) ?
                                                <div className="card-footer bg-transparent border-top-0">
                                                    {
                                                        this.getTokenState(token) === 'finished' ?
                                                            <button className="btn btn-outline-secondary btn-block"
                                                                    disabled={true}>
                                                                Finished
                                                            </button> :
                                                            <button className="btn btn-block btn-outline-primary"
                                                                    onClick={() => this.toggleToken(token)}>
                                                                Participate
                                                            </button>
                                                    }
                                                </div> :
                                                <div className="card-footer bg-transparent border-top-0">
                                                    <div className="text-muted text-center">
                                                        How much tokens do you want to buy?<br/>
                                                        Price: {(token.price / ONE_TRX)}
                                                    </div>
                                                    <div className="input-group mt-3">
                                                        <TextField type="number" cmp={this} field="amount"
                                                                   className="form-control"/>
                                                        <div className="input-group-append">
                                                            <button className="btn btn-success"
                                                                    type="button"
                                                                    disabled={!this.isValid()}
                                                                    onClick={() => this.buyTokens(token)}>
                                                                <i className="fa fa-check"/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-center mt-1 text-muted">
                                                        <FormattedNumber value={amount}/> {token.name}<br/>
                                                        =&nbsp;
                                                        <b><FormattedNumber
                                                            value={amount * (token.price / ONE_TRX)}/> TRX</b>
                                                    </div>
                                                </div>
                                        )
                                    }
                                </div>
                            </div>
                        </Fragment>
                    ))
                }

            </div>
        );
    }

    renderSmallDate(token) {

        let now = new Date().getTime();

        if (token.endTime < now) {
            return (
                <Fragment>
          <span className="text-muted">
            Finished&nbsp;
              <FormattedDate value={token.endTime}/>&nbsp;
              <FormattedTime value={token.endTime}/>
          </span>
                </Fragment>
            );
        }

        if (token.startTime < now) {
            return (
                <Fragment>
          <span className="text-muted">
            Started&nbsp;
              <FormattedDate value={token.startTime}/>&nbsp;
              <FormattedTime value={token.startTime}/>
          </span>
                    {
                        !this.containsToken(token) && <button
                            className="btn btn-primary btn-sm float-right"
                            onClick={() => this.toggleToken(token)}>
                            {tu("participate")}
                        </button>
                    }

                </Fragment>
            )
        }

        return (
            <Fragment>
          <span className="text-muted">
            Starts&nbsp;

              <FormattedDate value={token.startTime}/>&nbsp;

              <FormattedTime value={token.startTime}/>
          </span>
            </Fragment>
        );
    }



    confirmTransaction = (token) => {

        this.setState({
            alert: (
                <SweetAlert success title="Transaction Confirmed" onConfirm={() => this.setState({alert: null})}>
                    Successfully received x tokens
                </SweetAlert>
            )
        });

        this.submit(token);

    };




    render() {

        let {alert, /*loading, total, pageSize, page*/  selectedWallet , modal , modal1 , modal2} = this.state;

        // let {match} = this.props;

        // let wallet = this.whichAddressSelected() ;


        return (
            <Fragment>
                {alert}
                {modal}
                {modal1}
                {modal2}
                <StickyContainer className="container header-overlap pb-3">
                    <Sticky>
                        {
                            ({style, isSticky}) => (
                                <div
                                    className={"row " + (isSticky ? " bg-white no-gutters p-2 border border-secondary  border-top-0" : "")}
                                    style={{zIndex: 1000, ...style}}>

                                    <div className="col-sm-12">

                                        {/*<Paging loading={loading} url={match.url} total={total} pageSize={pageSize} page={page}  />*/}

                                        </div>
                                </div>
                            )
                        }
                    </Sticky>

                    <div className="row mt-4 mb-2">
                        <div className="col-md-3"> </div>
                        <div className="col-md-6">

                            <div className="form-group">

                                {/*<label>{tu("wallet")}</label>*/}

                                <div className="input-group mb-3">

                                    <select
                                        className="form-control"
                                        onChange={this.handleChange}
                                        value={selectedWallet}>

                                        <option  name="Select your Wallet">Select your Wallet</option>
                                        {
                                            this.props.wallets.map((wallet)=>(
                                                <option key ={wallet.name} value={wallet.address} >

                                                    {wallet.address}

                                                </option>

                                            ))
                                        }

                                    </select>
                                </div>
                            </div>


                        </div>
                        <div className="col-md-3"> </div>
                    </div>

                    <div className="row mt-3">

                        <div className="col-sm-12">


                            {this.renderGrid()}


                            </div>
                    </div>
                </StickyContainer>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {

        wallets : state.walletsReducer.wallets

    };
}



const mapDispatchToProps = (dispatch) => {

    return {

        loadTokens: async () => {

            const client = new Client();

            let tokens = await  client.getTokens();

            dispatch(setTokens(tokens));

        }

    }
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)( withRouter(BuyToken));