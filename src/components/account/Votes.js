
import {Client} from "@tronscan/client";
import {tu} from "../../utils/i18n";
import React, {Fragment} from "react";
import {AddressLink} from "../common/Links";
// import {TimeAgo} from "react-timeago";
import {filter, isNaN, sortBy, sumBy, trim} from "lodash";
import {FormattedNumber, /*injectIntl*/} from "react-intl";
import Countdown from "react-countdown-now";
import {Sticky, StickyContainer} from "react-sticky";
import {connect} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {ONE_TRX} from "../../constants";
import {Link, /*withRouter*/} from "react-router-dom";
import palette from "google-palette";
import TronLoader from "../tronwalletexloader/TronLoader" ;
import {compose} from "redux"   ;
import {loadVoteList, loadVoteTimer  ,loadTokenBalances } from "../../mainRedux/actions/actions";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {decryptString} from "../../services/encryption_js";
import VoteStats from "../votes/VoteStats";
import {WidgetIcon} from "../common/Icon" ;
import {Truncate} from "../text/Text";



function VoteChange({value, arrow = false}) {
    if (value > 0) {
        return (

            <span className="text-success">

                <span className="mr-1">+{value}</span>
                { arrow && <i className="fa fa-arrow-up" /> }

                </span>
        )
    }

    if (value < 0) {
        return (
            <span className="text-danger">
        <span className="mr-1">{value}</span>
                { arrow && <i className="fa fa-arrow-down" /> }
      </span>
        )
    }

    return (
        <span>
      -
    </span>
    )
}




class vote extends React.Component {

    constructor() {
        super();
        this.state = {
            candidates: [],
            totalVotes: 0,
            votingEnabled: false,
            votesSubmitted: false,
            loading: true,
            votes: {},
            modal: null,
            viewStats: false,

            colors: palette('mpn65', 20),
            selectedWallet:"Select your Wallet",
            modal1:null ,
            modal2:null ,
            modal3:null ,
            alertModal:null ,
            privateKey : "",
            searchCriteria: "",

        };
    }


    handleChange= event=>{

        this.setState({ selectedWallet: event.target.value });

        if(event.target.value !=="Select your Wallet") {

            this.setState({modal1:(

                    <SweetAlert
                        confirmBtnText="Decrypt"
                        input
                        inputType="password"
                        cancelBtnBsStyle="default"
                        title={ <small>Enter your wallet password</small>}
                        required
                        onConfirm={this.onConfirm}
                        validationMsg="You must enter your password!"
                    />
                )

            });

            this.props.loadTokenBalances(event.target.value);
            this.loadCurrentVotes(event.target.value) ;
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


    onConfirm = event =>{

        let { selectedWallet } = this.state;

        const obj =  this.props.wallets.filter(val => {

            return selectedWallet === val.address;

        });

        const pKey = decryptString(event , obj[0].key);



        if( this.isValidDecryptedPKey(selectedWallet , pKey) )
        {

            this.setState({modal1:null , privateKey:pKey});

            this.setState({modal2:(<SweetAlert  success title="Success" onConfirm={this.hideAlert1}>

                    the private key was decrypted successfully

                </SweetAlert> ) , privateKey:pKey});

        }else {

            this.setState({modal1:null});

            this.setState({modal3: (

                    <SweetAlert danger title="Wrong Password" confirmBtnText="Try again" onConfirm={this.hideAlert2 } >

                        you entered a wrong password! Try again

                    </SweetAlert>

                ) })

        }

    };


    hideAlert1 =()=>{

        this.setState({modal2:null });

    };


    hideAlert2=()=>{

        this.setState({modal3:null, privateKey:""});
        this.setState({modal1:(

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
    hideAlertModal = () =>{

        this.setState({alertModal:null});
        document.getElementById("selectedWalletId").focus() ;
    };


    onSearchChange = (searchCriteria) => {
        this.setState({
            searchCriteria: trim(searchCriteria),
        });
    };

    setVote = (address, numberOfVotes) => {


        let {votes} = this.state;

        if (numberOfVotes !== "") {

            numberOfVotes = parseInt(numberOfVotes, 10);
            numberOfVotes = isNaN(numberOfVotes) ? "" : numberOfVotes;

            if (numberOfVotes < 0) {
                numberOfVotes = 0;
            }
        }

        let {votesAvailable} = this.getVoteStatus();
        votesAvailable += votes[address] || 0;

        if (numberOfVotes > votesAvailable) {
            numberOfVotes = votesAvailable;
        }

        votes[address] = numberOfVotes;

        this.setState({
            votes,
        });
    };

    getVoteStatus = () => {

        let {votes} = this.state;



     // if (wallet.isOpen) {

        let  trxBalance = this.getTheWalletInfo().frozen.total / ONE_TRX;

           // }

        let votesSpend = sumBy(Object.values(votes), vote => parseInt(vote, 10) || 0);

        let votesAvailable = trxBalance - votesSpend;
        let spendAll = (votesSpend > 0 && votesAvailable === 0);

        let voteState = 0;

        if (votesAvailable > 0) {
            voteState = 1;
        } else if (votesAvailable < 0) {
            voteState = -1;
        }

        if (trxBalance === 0) {
            voteState = -2;
        }

        return {
            trxBalance,
            votesSpend,
            votesAvailable,
            spendAll,
            voteState,
            votePercentage: (votesSpend / trxBalance) * 100,
        };
    };

    enableVoting = () => {
        this.setState({
            votingEnabled: true,
        })
    };


    componentDidMount() {

        this.loadVotes();
        this.loadVoteTimer();


        this.setState({alertModal: (

                <SweetAlert info title="Select your Wallet" confirmBtnText="Ok" onConfirm={this.hideAlertModal } >

                  in this page for voting you should select your wallet

                </SweetAlert>

            ) })


    }

    loadVoteTimer = async () => {
        this.props.loadVoteTimer();
    };


    loadVotes = async () => {

        let {voteList} = this.props;
        if (voteList.length === 0) {
            this.setState({ loading: true });
        }

        await this.props.loadVoteList();
        this.setState({ loading: false });
    };

    loadCurrentVotes = async (address) => {

        const client = new Client();
        let {votes} = await client.getAccountVotes(address);

        this.setState({
            votes,
        });
    };

    renderVoteStatus() {

        let {votesAvailable, voteState} = this.getVoteStatus();

        switch (voteState) {
            case 0:
                return (
                    <span className="text-success">
            All votes are used!
          </span>
                );

            case 1:
                return (
                    <span>
            Votes Remaining:&nbsp;<b><FormattedNumber value={votesAvailable}/></b>
          </span>
                );

            case -1:
                return (
                    <span className="text-danger">
            You spend to much votes!
          </span>
                );

            case -2:
                return (
                    <span className="text-danger">
            You need at least 1 TRX to be able to vote
          </span>
                );
            default :
                return ;
        }

    }

    renderVotingBar() {

        let {votingEnabled, votesSubmitted , selectedWallet } = this.state;

        let {trxBalance} = this.getVoteStatus();

        console.log("selectedWallet length : ",selectedWallet.length);

        if(document.getElementById("selectedWalletId").length ===1 )
        {
            return <div className="text-center">you have not added any wallet. <Link to={'/AddWallet'}>Add Wallet</Link> </div>
        }
        if (selectedWallet==="Select your Wallet") {
            return (
                <div className="text-center">
                    Select your wallet to start voting
                </div>
            );
        }

        if (votesSubmitted) {
            return (
                <div  className="text-center m-0 text-success">
                    Thanks for submitting your vote!
                </div>
            );
        }


        if (trxBalance <= 0) {
            return (
                <div className="text-center">
                    At least 1 Tron Power is required to start voting. Tron Power is gained by freezing TRX on the{' '}
                    <Link to="/account" className="text-primary">Account Page</Link>
                </div>
            );
        }

        if (votingEnabled) {
            return (
                <div className="d-flex" style={{lineHeight: '36px'}}>
                    <div>
                        <input type="text"
                               className="form-control"
                               placeholder="Search..."
                               onChange={(ev) => this.onSearchChange(ev.target.value)} />
                    </div>
                    <div className="ml-auto">
                        {this.renderVoteStatus()}
                    </div>
                    <button className="btn-raised btn btn-primary ml-auto" onClick={this.cancelVotes}>Cancel</button>
                    <button className="btn-raised btn btn-warning ml-1" onClick={this.resetVotes}>Reset</button>
                    <button className="btn-raised btn btn-success ml-1" onClick={this.submitVotes}>Submit Votes</button>
                </div>
            );
        }

        return (

            <div>
                <button className="btn btn-tron btn-block" onClick={this.enableVoting}>
                    Start Voting
                </button>
            </div>
        );
    }

    resetVotes = () => {
        this.setState({
            votes: {},
        });
    };

    cancelVotes = () => {
        this.setState({
            votingEnabled: false,
            searchCriteria: "",
        });
    };

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    submitVotes = async () => {

        let client = new Client() ;

        let myAddress  = this.state.selectedWallet ;

        console.log("address SubmitVotes :" , myAddress) ;

        let {votes} = this.state;

        let witnessVotes = {};

        for (let address of Object.keys(votes)) {
            witnessVotes[address] = parseInt(votes[address], 10);
        }

        let {success} = await client.voteForWitnesses(myAddress , witnessVotes)(this.state.privateKey);

        console.log("myAdress line 479: " , myAddress);

        if (success) {
            setTimeout(() =>this.props.loadTokenBalances(myAddress), 1200);
            setTimeout(() => this.setState({ votesSubmitted: false, }), 5000);

            this.setState({
                votesSubmitted: true,
                votingEnabled: false,
                modal: (
                    <SweetAlert success title="Thank you for voting!" onConfirm={this.hideModal}>
                        Your votes are successfully submitted, they will take effect when the next voting cycle starts.<br/>
                        You may redistribute your votes anytime you like
                    </SweetAlert>
                )
            });
        } else {
            this.setState({
                modal: (
                    <SweetAlert danger title="Error" onConfirm={this.hideModal}>
                        Something went wrong while submitting your votes. Please try again later.
                    </SweetAlert>
                )
            });
        }





    };


    getTheWalletInfo =()=>{

        let balance = {
            address:"" ,
            name: "" ,
            representative: {allowance:0 , enabled:false  , lastWithDrawTime:0, url:null} ,
            balance: 0,
            frozen:{total:0 , balances:[]},
            entropy:0 ,
            allowance: 0,
            balances: []
        };


        this.props.balancesReducer.filter(val => (
            val.address === this.state.selectedWallet)
        ).map(obj=>(balance= obj));


        return balance  ;
    };

    getNextCycle() {
        let {voteTimer} = this.props;
        return voteTimer;
    }

    renderSelectWallet=(selectedWallet)=>{
        return (

            <div className="row mt-4 mb-3">


                <div className="col-md-3"> </div>
                <div className="col-md-6">

                    <label>{tu("wallet")}</label>

                    <div className="input-group mb-3">

                        <select
                            id="selectedWalletId"
                            className="form-control"
                            onChange={this.handleChange}
                            value={selectedWallet}>

                            <option  name="Select your Wallet">Select your Wallet</option>
                            {
                                this.props.wallets.map((wallet)=>(
                                    <option key ={wallet.address} value={wallet.address} >
                                        {wallet.name + ' : ' +wallet.address}
                                    </option>

                                ))
                            }

                        </select>


                    </div>
                </div>
                <div className="col-md-3"> </div>



            </div>

        )
    };



    render() {

        let {votingEnabled, votes, loading, modal, modal1 , modal2 , modal3 ,alertModal,
            viewStats, colors, searchCriteria , selectedWallet } = this.state;
        let { voteList: candidates} = this.props;

        candidates = sortBy(candidates, c => c.votes * -1).map((c, index) => ({
            ...c,
            rank: index,
        }));

        let filteredCandidates = candidates;

        if (searchCriteria !== "") {
            filteredCandidates = filter(candidates, c => {
                if (trim(c.url.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1) {
                    return true;
                }

                return c.name.length > 0 && trim(c.name.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1;

            });
        }

        let totalVotes = sumBy(candidates, c => c.votes);

        let biggestGainer = sortBy(candidates, c => c.change_cycle * -1)[0] || {};
        let {trxBalance} = this.getVoteStatus();

        let voteSize = Math.ceil(trxBalance / 20);



        return(


            <main className="container header-overlap mt-4">
                {modal }
                {modal1 }
                {modal2 }
                {modal3 }
                {alertModal}

                {this.renderSelectWallet(selectedWallet)}

                {
                    viewStats &&
                    <div className="card mb-3 mt-3">
                        {/*<h5 className="card-title text-center">Stats</h5>*/}
                        <VoteStats colors={colors} />
                    </div>
                }
                <div className="row">
                    <div className="col-md-4 mt-3 mt-md-0">
                        <div className="card h-100 text-center widget-icon">
                            <WidgetIcon className="fa fa-clock text-primary"  />
                            <div className="card-body">
                                <h3 className="text-primary">
                                    <Countdown date={this.getNextCycle()} daysInHours={true} onComplete={() => {
                                        this.loadVotes();
                                        this.loadVoteTimer();
                                    }}/>
                                </h3>
                                {tu("next_round")}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mt-3 mt-md-0 position-relative">
                        <div className="card h-100 widget-icon">
                            <WidgetIcon className="fa fa-check-circle text-secondary"  />
                            <div className="card-body text-center">
                                <h3 className="text-secondary">
                                    <FormattedNumber value={totalVotes}/>
                                </h3>
                                <a href="javascript:" onClick={() => this.setState(state => ({ viewStats: !state.viewStats  }))}>{tu("total_votes")}</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mt-3 mt-md-0">
                        <div className="card h-100 widget-icon">
                            <WidgetIcon className="fa fa-arrow-up text-success" style={{right:0}}  />
                            <div className="card-body text-center">
                                <h3 className="text-success">
                                    <VoteChange value={biggestGainer.change_cycle} arrow={true}/>
                                </h3>
                                {tu("most_ranks")}<br/>
                                <div className="text-nowrap text-truncate">
                                    <AddressLink address={biggestGainer.address}>
                                        {biggestGainer.name || biggestGainer.url}
                                    </AddressLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <a target="_blank"  rel="noopener noreferrer" href="https://tronscan.org/#/votes-live" className="btn-raised btn btn-secondary btn-block mt-3 font-weight-bold">
                    {tu("view_live_ranking")}
                </a>

                {
                    loading ? <div className="card mt-2">
                            <TronLoader>
                                Loading Super Representatives
                            </TronLoader>
                        </div> :
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <StickyContainer>
                                    <div className="card mt-1">
                                        {
                                            selectedWallet &&
                                            <Sticky>
                                                {
                                                    ({style}) => (
                                                        <div style={{zIndex: 100, ...style}} className="card-body bg-white p-2 border-bottom">
                                                            {this.renderVotingBar()}
                                                        </div>
                                                    )
                                                }
                                            </Sticky>
                                        }
                                        <table className="table vote-table table-hover table-striped m-0">
                                            <thead className="thead-dark ">
                                            <tr>
                                                <th className="d-none d-sm-table-cell font-weight-bold" style={{width: 25}}>#</th>
                                                <th className="font-weight-bold">{tu("name")}</th>
                                                <th className="text-center d-none d-lg-table-cell font-weight-bold" style={{width: 75}}>{tu("24h")}</th>
                                                <th className="text-center d-none d-lg-table-cell font-weight-bold" style={{width: 25}}>{tu("6h")}</th>
                                                <th className="font-weight-bold" style={{width: 100}}>{tu("votes")}</th>
                                                {
                                                    votingEnabled && <th className="font-weight-bold" style={{width: 200}}>
                                                        {tu("your vote")}
                                                    </th>
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                (searchCriteria.length > 0 && filteredCandidates.length === 0) &&
                                                <tr>
                                                    <td colSpan="6" className="p-3 text-center">
                                                        No Super Representatives found for <b>{searchCriteria}</b>
                                                    </td>
                                                </tr>
                                            }
                                            {
                                                filteredCandidates.map(candidate => (
                                                    <tr key={candidate.address}>
                                                        {
                                                            viewStats ?
                                                                <th className="font-weight-bold d-none d-sm-table-cell pt-4" style={{backgroundColor: "#" + colors[candidate.rank]}}>
                                                                    {candidate.rank + 1}
                                                                </th> :
                                                                <th className="font-weight-bold d-none d-sm-table-cell pt-4">
                                                                    {candidate.rank + 1}
                                                                </th>
                                                        }
                                                        <td className="d-flex flex-column flex-sm-row ">
                                                            <div className="text-center text-sm-left">
                                                                <Truncate>
                                                                    <AddressLink address={candidate.address} className="font-weight-bold">{candidate.name || candidate.url}</AddressLink>
                                                                </Truncate>
                                                                <AddressLink className="small text-muted" address={candidate.address}/>
                                                            </div>
                                                            {
                                                                candidate.hasPage && <div className="ml-0 ml-sm-auto">
                                                                    <a className="btn btn-sm btn-block btn-outline-info mt-1" target="_blank" rel="noopener noreferrer" href={`https://tronscan.org/#/representative/${candidate.address}`}>
                                                                        {tu("open_team_page")}
                                                                        <i className="fas fa-users ml-2"/>
                                                                    </a>
                                                                </div>
                                                            }
                                                        </td>
                                                        <td className="text-center d-none d-lg-table-cell">
                                                            <VoteChange value={candidate.change_day}/>
                                                        </td>
                                                        <td className="text-center d-none d-lg-table-cell">
                                                            <VoteChange value={candidate.change_cycle}/>
                                                        </td>
                                                        <td className="small text-center">
                                                            {
                                                                totalVotes > 0 &&
                                                                <Fragment>
                                                                    <FormattedNumber value={candidate.votes}/><br/>
                                                                    <div className="progress position-relative mt-1">
                                                                        <div className="progress-bar"
                                                                             style={{width: Math.round((candidate.votes / totalVotes) * 100) + '%'}}>
                                                                        </div>
                                                                        <span className="ml-auto mr-1 progress-bar-percentage">
                                  <FormattedNumber
                                      minimumFractionDigits={2}
                                      maximumFractionDigits={2}
                                      value={(candidate.votes / totalVotes) * 100}/>%
                                   </span>
                                                                    </div>
                                                                </Fragment>
                                                            }
                                                        </td>
                                                        {
                                                            votingEnabled && <td className="vote-input-field">
                                                                <div className="input-group">
                                                                    <div className="input-group-prepend">
                                                                        <button className="btn btn-outline-danger"
                                                                                onClick={() => this.setVote(candidate.address, (votes[candidate.address] || 0) - voteSize)}
                                                                                type="button">-
                                                                        </button>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={votes[candidate.address] || ""}
                                                                        className="form-control form-control-sm text-center"
                                                                        onChange={(ev) => this.setVote(candidate.address, ev.target.value)}/>
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-outline-success"
                                                                                onClick={() => this.setVote(candidate.address, (votes[candidate.address] || 0) + voteSize)}
                                                                                type="button">+
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        }
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </StickyContainer>
                            </div>
                        </div>
                }

            </main>



        )

    }
}


function mapStateToProps(state) {


    return {

        balancesReducer: state.balancesReducer.walletBalances,
        wallets:state.walletsReducer.wallets,
        voteList: state.votes.voteList,
        voteTimer: state.votes.voteTimer,
    };
}

const mapDispatchToProps = {

    loadVoteList,
    loadVoteTimer,
    loadTokenBalances
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(vote)