import {Client} from "../../../Temp/api";
import {tu} from "../../../utils/i18n";
import React, {Fragment} from "react";
import {AddressLink, ExternalLink} from "../common/Links";
import {TimeAgo} from "react-timeago";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, find, isNaN, isNumber, last, sortBy, sumBy} from "lodash";
import Countdown from "react-countdown-now";
import {Sticky, StickyContainer} from "react-sticky";
import {connect} from "react-redux";
import {Alert} from "reactstrap";
import {TronLoader} from "../common/loaders";
import SweetAlert from "react-bootstrap-sweetalert";
import {ONE_TRX} from "../../../constants";
import {reloadWallet} from "../../../Temp/actions/wallet";
import {setHours, startOfHour} from "date-fns";
import {Link} from "react-router-dom";
import MediaQuery from "react-responsive";
import {WidgetIcon} from "../common/Icon";
import VoteStats from "../../../Temp/blockchain/Statistics/VoteStats";
import palette from "google-palette";


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

class VoteOverview extends React.Component {

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
            voteCycleTimes: [
                6, 12, 18, 24
            ],
            colors: palette('mpn65', 20),
        };
    }

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
        let {wallet} = this.props;
        let {votes} = this.state;

        let trxBalance = 0;

        if (wallet.isOpen) {
            trxBalance = wallet.current.frozenTrx / ONE_TRX;
        }

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

    componentDidUpdate(prevProps) {
        if (this.props.account.isLoggedIn && (this.props.account.address !== prevProps.account.address)) {
            this.loadCurrentVotes(this.props.account.address);
        }
    }

    componentDidMount() {
        let {account,} = this.props;
        if (account.isLoggedIn) {
            this.props.reloadWallet();
            this.loadCurrentVotes(account.address);
        }
        this.loadVotes();
    }

    loadVotes = async () => {

        this.setState({loading: true});
        let {candidates, total_votes} = await Client.getVotesForCurrentCycle();

        this.setState({
            loading: false,
            candidates,
            totalVotes: sumBy(candidates, c => c.votes)
        });
    };

    loadCurrentVotes = async (address) => {
        let {votes} = await Client.getAccountVotes(address);

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
        }

    }

    renderVotingBar() {
        let {votingEnabled, votesSubmitted} = this.state;
        let {account} = this.props;

        let {trxBalance} = this.getVoteStatus();

        if (!account.isLoggedIn) {
            return (
                <div className="text-center">
                    Open wallet to start voting
                </div>
            );
        }

        if (votesSubmitted) {
            return (
                <Alert color="success" className="text-center m-0">
                    Thanks for submitting your vote!
                </Alert>
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
                    <div className="ml-auto">
                        {this.renderVoteStatus()}
                    </div>
                    <button className="btn btn-warning ml-auto" onClick={this.resetVotes}>Reset</button>
                    <button className="btn btn-tron ml-1" onClick={this.submitVotes}>Submit Votes</button>
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

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    submitVotes = async () => {
        let {account} = this.props;
        let {votes} = this.state;

        let witnessVotes = {};

        for (let address of Object.keys(votes)) {
            witnessVotes[address] = parseInt(votes[address], 10);
        }

        let {success} = await Client.voteForWitnesses(account.address, witnessVotes)(account.key);

        if (success) {
            setTimeout(() => this.props.reloadWallet(), 1200);
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

    getNextCycle() {
        let {voteCycleTimes} = this.state;
        let hours = new Date().getUTCHours();
        let nextHour = find(voteCycleTimes, vct => vct > hours);
        if (typeof nextHour === 'undefined') {
            nextHour = 6;
        }
        return startOfHour(setHours(new Date(), nextHour));
    }

    render() {

        let {candidates, totalVotes, votingEnabled, votes, loading, modal, viewStats, colors} = this.state;
        let {wallet, flags} = this.props;

        candidates = sortBy(candidates, c => c.votes * -1);

        let biggestGainer = sortBy(candidates, c => c.change_hour * -1)[0] || {};
        let {trxBalance} = this.getVoteStatus();
        let biggestLoser = sortBy(candidates, c => c.change_hour)[0] || {};

        let voteSize = Math.ceil(trxBalance / 20);

        return (
            <main className="container header-overlap pb-3">
                {modal}
                {
                    viewStats &&
                    <div className="card">
                        {/*<h5 className="card-title text-center">Stats</h5>*/}
                        <VoteStats colors={colors} />
                    </div>
                }
                <div className="row mt-3">
                    <div className="col-md-6 mt-3 mt-md-0">
                        <div className="card h-100 text-center widget-icon">
                            <WidgetIcon className="fa fa-clock text-primary"  />
                            <div className="card-body">
                                <h3 className="text-primary">
                                    <Countdown date={this.getNextCycle()} daysInHours={true}/>
                                </h3>
                                Next Votecycle
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mt-3 mt-md-0 position-relative">
                        <div className="card h-100 widget-icon">
                            <WidgetIcon className="fa fa-check-circle text-secondary"  />
                            <div className="card-body text-center">
                                <h3 className="text-secondary">
                                    <FormattedNumber value={totalVotes}/>
                                </h3>
                                <a href="javascript:;" onClick={() => this.setState(state => ({ viewStats: !state.viewStats  }))}>Total Votes</a>
                            </div>
                        </div>
                    </div>

                    {/*<div className="col-md-3 mobile-pt">*/}
                    {/*<div className="card h-100">*/}
                    {/*<div className="card-body text-center">*/}
                    {/*<h3 className="text-success">*/}
                    {/*<VoteChange value={biggestGainer.change_hour} arrow={true}/>*/}
                    {/*</h3>*/}
                    {/*Most Ranks Gained<br/>*/}
                    {/*<div className="text-nowrap text-truncate">*/}
                    {/*{biggestGainer.address}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className="col-md-3 mobile-pt">*/}
                    {/*<div className="card h-100">*/}
                    {/*<div className="card-body text-center">*/}
                    {/*<h3 className="text-danger">*/}
                    {/*<VoteChange value={biggestLoser.change_hour} arrow={true}/>*/}
                    {/*</h3>*/}
                    {/*Most Ranks Lost*/}
                    {/*<div className="text-nowrap text-truncate">*/}
                    {/*{biggestLoser.address}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
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
                                            wallet.isOpen &&
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
                                            <thead className="thead-dark">
                                            <tr>
                                                <th className="d-none d-sm-table-cell" style={{width: 25}}>#</th>
                                                <th className="text-uppercase">{tu("url")}</th>
                                                <th className="text-uppercase">&nbsp;</th>
                                                {/*<th className="text-center d-none d-lg-table-cell" style={{width: 25}}>{tu("1h")}</th>*/}
                                                {/*<th className="text-center d-none d-lg-table-cell" style={{width: 75}}>{tu("24h")}</th>*/}
                                                <th className="" style={{width: 100}}>{tu("votes")}</th>
                                                {
                                                    votingEnabled && <th style={{width: 200}}>
                                                        {tu("your vote")}
                                                    </th>
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                candidates.map((candidate, index) => (
                                                    <tr key={candidate.address}>
                                                        {
                                                            viewStats ?
                                                                <th className="font-weight-bold d-none d-sm-table-cell pt-4" style={{backgroundColor: "#" + colors[index]}}>
                                                                    {index + 1}
                                                                </th> :
                                                                <th className="font-weight-bold d-none d-sm-table-cell pt-4">
                                                                    {index + 1}
                                                                </th>
                                                        }
                                                        <td>
                                                            <MediaQuery maxWidth={768}>
                                                                <div className="show-mobile">
                                                                    <div className="text-nowrap text-truncate font-weight-bold" style={{maxWidth: 130}}>
                                                                        <ExternalLink url={candidate.url}/>
                                                                    </div>
                                                                    <div className="text-nowrap text-truncate" style={{maxWidth: 130}}>
                                                                        <AddressLink className="small text-muted" address={candidate.address}/>
                                                                    </div>
                                                                </div>
                                                            </MediaQuery>
                                                            <MediaQuery minWidth={769}>
                                                                <div className="text-nowrap text-truncate font-weight-bold" style={{maxWidth: 500}}>
                                                                    <ExternalLink url={candidate.url}/>
                                                                </div>
                                                                <div className="text-nowrap text-truncate" style={{maxWidth: 400}}>
                                                                    <AddressLink className="small text-muted" address={candidate.address}/>
                                                                </div>
                                                            </MediaQuery>
                                                        </td>
                                                        <td className="text-right">
                                                            {
                                                                candidate.hasPage && <Fragment>
                                                                    <Link className="btn btn-lg btn-outline-secondary mt-1" to={`/representative/${candidate.address}`}>
                                                                        {tu("Open Team Page")}
                                                                        <i className="fas fa-users ml-2"/>
                                                                    </Link>
                                                                </Fragment>
                                                            }
                                                        </td>
                                                        {/*<td className="text-center d-none d-lg-table-cell">*/}
                                                        {/*<VoteChange value={candidate.change_hour}/>*/}
                                                        {/*</td>*/}
                                                        {/*<td className="text-center d-none d-lg-table-cell">*/}
                                                        {/*<VoteChange value={candidate.change_day}/>*/}
                                                        {/*</td>*/}
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
        );
    }
}


function mapStateToProps(state) {

    return {
        account: state.app.account,
        tokenBalances: state.account.tokens,
        wallet: state.wallet,
        flags: state.app.flags,
    };
}

const mapDispatchToProps = {
    reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VoteOverview))
