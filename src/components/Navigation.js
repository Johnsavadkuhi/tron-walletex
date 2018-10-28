/*eslint-disable no-script-url*/
import React, {Component} from 'react';
import Redlogo from '../images/mainLogo.png';
import {withRouter} from "react-router-dom";
import {setLanguage} from "../mainRedux/actions/actions";
import {connect} from "react-redux";
import {compose} from "redux";
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SendIcon from '@material-ui/icons/Send';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import AddIcon from '@material-ui/icons/Add';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const styles = theme => ({
    root: {
        flexGrow: 2,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});


class Navigation extends Component {

    constructor() {
        super();

        this.state = {
            value: 0,
            age: '',
            labelWidth: 0
        };

    }

    // componentDidMount() {
    //     this.setState({
    //         labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    //     });
    // }
    componentWillMount() {
        if (this.state.value !== 0) {
            this.setState({value: 0});
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleDelete = () => {
    }

    handleClick = name => event => {


        switch ([name][0]) {
            case "myWallets":
                window.location = '#/account';
                break;
            case "addWallet":
                window.location = '#/AddWallet';
                break;
            case "send":
                window.location = '#/send';
                break;
            case "buyToken":
                window.location = '#/BuyToken';
                break;

            case "voting":
                window.location = '#/account/votes';
                break;

            case "createToken":
                window.location = '#/createToken';
                break;

            default:
                return;

        }
    };

    setLanguage = (language) => {
        this.props.setLanguage(language);
    };


    render() {


        let {languages, activeLanguage} = this.props;

        return (

            <div>





                <nav data-uk-navbar className="uk-navbar-container uk-navbar">
                    <div className="uk-navbar-left">

                        <a className="uk-navbar-item uk-margin-left uk-background-blend-color " href="#">
                            <img src={Redlogo} className="logo" alt="TronWalletEx"/>
                        </a>

                        <div className="btn-group">
                            <button className="btn dropdown-toggle" type="button" id="buttonMenu1" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                {activeLanguage.toUpperCase()}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="buttonMenu1">

                                <ul className="uk-nav uk-navbar-dropdown-nav">
                                    {
                                        Object.keys(languages).map(language => (
                                            <li className="uk-active">

                                                <a key={language}
                                                   className="dropdown-item "
                                                   href="javascript:;"
                                                   onClick={() => this.setLanguage(language)}>{languages[language]}</a></li>
                                        ))
                                    }


                                </ul>

                            </div>
                        </div>

                    </div>


    </nav>

                <div className="text-center mt-4">

                    <Chip

                        avatar={<Avatar><AccountBalanceWalletIcon/></Avatar>}
                        label="My Wallets"
                        onClick={this.handleClick("myWallets")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon/>}

                    />

                    <Chip

                        avatar={<Avatar><AddIcon/></Avatar>}
                        label="Add Wallet"
                        onClick={this.handleClick("addWallet")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon/>}
                    />

                    <Chip

                        avatar={<Avatar><SendIcon/></Avatar>}
                        label="Send"
                        onClick={this.handleClick("send")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon/>}
                    />

                    <Chip
                        avatar={<Avatar> <AttachMoneyIcon/> </Avatar>}
                        label="Buy Tokens"
                        onClick={this.handleClick("buyToken")}
                        onDelete={this.handleDelete}
                        className="text-white mr-2 ml-2 mb-2 "
                        deleteIcon={<DoneIcon/>}
                    />

                    <Chip
                        avatar={<Avatar><MoneyOffIcon/> </Avatar>}
                        label="Create Token"
                        onClick={this.handleClick("createToken")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon/>}
                    />

                    <Chip

                        avatar={<Avatar><AllInclusiveIcon/></Avatar>}
                        label="Voting"
                        onClick={this.handleClick("voting")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon/>}
                    />

                </div>

            </div>

        );


    }
}

function mapStateToProps(state) {

    return {
        activeLanguage: state.app.activeLanguage,
        languages: state.app.availableLanguages,
    };

}

const mapDispatchToProps = {
    setLanguage,

};


export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps, null, {pure: false})
)(withRouter(Navigation));