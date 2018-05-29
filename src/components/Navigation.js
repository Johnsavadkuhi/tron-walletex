/*eslint-disable no-script-url*/
import React, {Component} from 'react';
// import logo from '../../images/tron_logo.png';
import Whitelogo from '../images/tron_logo.png' ;
import Redlogo from '../images/logo.png' ;

// import {routes} from "../../routes";
import {/*Link ,NavLink,*/ withRouter} from "react-router-dom";
// import {filter} from "lodash";
import {tu} from "../utils/i18n";
import {setLanguage} from "../mainRedux/actions/actions";
import {connect} from "react-redux";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import {compose} from "redux";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SendIcon from '@material-ui/icons/Send';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import AddIcon from '@material-ui/icons/Add';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';


 import {Redirect} from "react-router-dom";







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
        };

    }

    componentWillMount() {
        if (this.state.value !== 0) {
            this.setState({value: 0});
        }
    }

// componentWillUpdate(nexProps)
// {
//     if(this.state.value !== 0 && nexProps)
//     {
//         this.setState({value: 0});
//     }
//
// }
//
     handleDelete = ()=> {
        // alert('You clicked the delete icon.'); // eslint-disable-line no-alert
    }

     handleClick = name => event  => {



switch ([name][0])
{
    case "myWallets":
        window.location = '#/account';
        break ;
    case "addWallet":
        window.location = '#/AddWallet';
        break ;
        case "send":
            window.location = '#/send';
    break ;
    case "tokens":
        window.location = '#/tokens';
        break ;

    case "voting":
        window.location = '#/account/votes';
        break ;

    default:
        return ;

}
    };




    // handleChange = (event, value) => {
    //
    //     this.setState({value: value});
    //
    // };

    setLanguage = (language) => {
        this.props.setLanguage(language);
    };


    render() {

        const {classes} = this.props;

        let {languages, activeLanguage} = this.props;

        const {value} = this.state;

        return (

            <div>

                <nav className="navbar navbar-expand-md navbar-dark bg-white">
                <div className="container">

                <button className="navbar-toggler btn bmd-btn-fab dropdown-toggle bg-inverse"
                type="button" data-toggle="collapse" data-target="#navbar-top">
                <span className="navbar-toggler-icon text-dark"/>
                </button>

                <div className="d-md-none pull-right">
                <img src={Redlogo} className="logo" alt="TronWalletEx"/>
                </div>

                <div className="collapse navbar-collapse" id="navbar-top">
                <ul className="navbar-nav mr-auto ">
                <li className="nav-item d-none d-md-block">
                <img src={Redlogo} className="logo" alt="Tron"/>
                </li>



                </ul>

                <ul className="navbar-nav navbar-right">

                <li className="nav-item dropdown navbar-right mr-4">

                <a className="nav-link dropdown-toggle dropdown-menu-right font-weight-bold text-dark "
                data-toggle="dropdown" href="javascript:;">{activeLanguage.toUpperCase()}</a>

                <div className="dropdown-menu bg-light mr-4 pr-4">

                {
                Object.keys(languages).map(language => (
                <a key={language}
                className="dropdown-item font-weight-bold text-dark"
                href="javascript:;"
                onClick={() => this.setLanguage(language)}>{languages[language]}</a>
                ))
                }
                </div>
                </li>
                </ul>
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
                        deleteIcon={<DoneIcon />}

                    />


                    <Chip

                        avatar={<Avatar><AddIcon/></Avatar>}
                        label="Add Wallet"
                        onClick={this.handleClick("addWallet")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon />}
                    />

                    <Chip

                        avatar={<Avatar><SendIcon/></Avatar>}
                        label="Send"
                        onClick={this.handleClick("send")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon />}
                    />

                    <Chip

                        avatar={<Avatar><MoneyOffIcon/> </Avatar>}
                        label="Tokens"
                        onClick={this.handleClick("tokens")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon />}
                    />

                    <Chip

                        avatar={<Avatar><AllInclusiveIcon/></Avatar>}
                        label="Voting"
                        onClick={this.handleClick("voting")}
                        onDelete={this.handleDelete}
                        className="text-white m-2"
                        deleteIcon={<DoneIcon />}
                    />

                </div>

                {/*<Paper className="mr-4 ml-4 ">*/}

                    {/*<div className={classes.root}>*/}
                        {/*<AppBar position={"sticky"} color="inherit">*/}
                            {/*<Tabs*/}
                                {/*fullWidth*/}
                                {/*className="text-center small"*/}
                                {/*value={value}*/}
                                {/*onChange={this.handleChange}*/}
                                {/*scrollable*/}
                                {/*scrollButtons="on"*/}
                                {/*textColor="primary">*/}

                                {/*<Tab href="#/account" label={tu('wallet')}/>*/}
                                {/*<Tab href="#/AddWallet" label={tu('add')}/>*/}
                                {/*<Tab href="#/Send" label={tu('send')}/>*/}
                                {/*<Tab href="#/tokens/view" label="tokens"/>*/}
                                {/*<Tab href="#/account/votes" label="Votes"/>*/}

                            {/*</Tabs>*/}

                        {/*</AppBar>*/}

                    {/*</div>*/}

                {/*</Paper>*/}

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