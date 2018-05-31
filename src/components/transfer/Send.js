/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import * as qs from "query-string";
import {loadTokenBalances} from "../../mainRedux/actions/actions";
import {tu} from "../../utils/i18n";
import {Client} from "@tronscan/client";
import {isAddressValid} from "@tronprotocol/wallet-api/src/utils/crypto";
import SendOption from "./SendOption";
import {find} from "lodash";
import {ONE_TRX} from "../../constants";
import {withStyles} from '@material-ui/core/styles';

import {compose} from "redux";


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



class Send extends React.Component {

  constructor(props) {
    super(props);

    let queryParams = qs.parse(props.location.search);

    this.state = {
      to: queryParams.to || "",
      token: "",
      amount: "",
      sendStatus: 'waiting',
      isLoading: false,
        selectedAddress:"",
        selectedPrivateKey:"",
        isSelectedAddress:false ,

        selectedValue : "",

    };

  }



  isAddress = (address) => {
      try {
          return isAddressValid(address);
      } catch (e) {
          return false;
      }
  };


  isValid = () => {

      let {to, token, amount , selectedValue} = this.state;


      let address ="" ;

      let fr = this.props.tokensBalances ;

      fr.filter(val =>{

          return val.address === selectedValue

      }).map((obj)=>(address=obj.address));


    return this.isAddress(to) && token !== "" && this.getSelectedTokenBalance() >= amount && amount > 0 && to !== address;

  };


  send = async() => {

      let  client = new Client()  ;

    let {to, token, amount , selectedValue} = this.state;


    const obj =  this.props.wallets.filter(val => {

          return selectedValue === val.address;

      });


    this.setState({ isLoading: true });

   const resulet =   await client.send( token,selectedValue ,to, amount * ONE_TRX)(obj[0].key);

      this.props.loadTokenBalances(selectedValue);

    this.setState({
      sendStatus: 'success',
      isLoading: false,
    });

    return resulet  ;

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


      const { selectedValue} = this.state;

      let tokenBalances = [] ;

     let fr = this.props.tokensBalances ;

      fr.filter(val =>{

          return val.address === selectedValue

      }).map((obj)=>(tokenBalances=obj.balances));


    let {token} = this.state;


    if(selectedValue !=="Select your Wallet") {
        if (token !== "Select Token") {

            if (token) {

                return parseFloat(find(tokenBalances, t => t.name === token).balance);

            }
        }

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

      let {selectedValue} = this.state ;

      const obj =   this.props.tokensBalances.filter( value => {

          return selectedValue === value.address;
      });


      if(obj > 0 )
          this.props.loadTokenBalances(obj[0].address);

  };

  componentDidUpdate() {


      let {selectedValue} = this.state ;

      const obj =   this.props.tokensBalances.filter( value => {

          return selectedValue === value.address;
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

  renderForm(tokenBalances) {

    let {sendStatus} = this.state;
    let {to, token, amount  , selectedValue} = this.state;
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

              <label>{tu("wallet")}</label>

              <div className="input-group mb-3">

                  <select
                      className="form-control"
                      onChange={(ev) =>  this.setState({ selectedValue: ev.target.value }) }
                      value={selectedValue}>

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



          <div className="form-group">
          <label>{tu("to")}</label>
          <div className="input-group mb-3">
            <input type="text"
                   onChange={(ev) => this.setState({ to: ev.target.value })}
                   className={"form-control " + (!isToValid ? "is-invalid" : "")}
                   value={to} />
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

    // renderWallets = ()=>{
    //
    //     const { selectedValue} = this.state;
    //     const { classes } = this.props;
    //
    //
    //     const obj =   this.props.tokensBalances.filter( value => {
    //
    //         return selectedValue === value.address;
    //     });
    //
    //
    //     return (
    //
    //
    //         <div className="container mt-4 mb-4">
    //             <Paper>
    //
    //                 <div className="row" style={{height:'450px'}}>
    //
    //
    //                     <div className="col-md-4 col-sm-12 ">
    //
    //                         <div className="text-center text-secondary">
    //
    //                             <div className={classes.root}>
    //
    //
    //                                 <FormControl component="fieldset"  className={classes.formControl}>
    //
    //                                     <FormLabel component="legend"> Your Wallets </FormLabel>
    //
    //                                     <RadioGroup
    //                                         aria-label="Select a Method "
    //                                         name=""
    //                                         className={classes.group}
    //                                         value={this.state.selectedValue}
    //                                         onChange={this.handleChange}>
    //
    //                                         { this.props.wallets.length > 0 ?"" :"Please Generate Or Add wallet first "}
    //
    //
    //
    //                                         {
    //                                             this.props.wallets.map((wallet, index )=>(
    //
    //                                                 <FormControlLabel key={index} value={wallet.address} control={<Radio />} label={wallet.address} />
    //                                             ))
    //
    //
    //
    //                                         }
    //
    //
    //                                     </RadioGroup>
    //
    //                                 </FormControl>
    //
    //                             </div>
    //
    //                         </div>
    //                     </div>
    //
    //                     <div className="col-md-8 col-sm-12 text-center p-2">
    //
    //                         {
    //                             obj.length > 0 ?
    //
    //                                 <Paper className="p-4 m-4">
    //                                     {this.renderForm(obj[0].balances)}
    //                                 </Paper>
    //
    //
    //                                 : <div className="container p-4 m-2">
    //
    //                                     <Paper>
    //
    //                                         Select Your Wallet from left Panel
    //
    //                                     </Paper>
    //
    //                                 </div>
    //
    //                         }
    //
    //
    //
    //                     </div>
    //
    //                 </div>
    //             </Paper>
    //         </div>
    //
    //     );
    //
    //
    //
    // };

    renderWallets = ()=>{

        const { selectedValue} = this.state;


        let tokenBalances = [] ;

        let fr = this.props.tokensBalances ;

        fr.filter(val =>{

            return val.address === selectedValue;

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

    // account: state.app.account,
    // tokenBalances: state.tokens.tokens,
      tokensBalances:state.balancesReducer.walletBalances,
      wallets:state.walletsReducer.wallets,

  };
}

const mapDispatchToProps = {
  loadTokenBalances,
};
//
// export default connect(mapStateToProps, mapDispatchToProps)(Send)



export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)( Send);