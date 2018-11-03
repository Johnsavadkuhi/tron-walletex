/*eslint-disable no-script-url*/
import React, {Component} from 'react';
import Redlogo from '../images/mainLogo.png';
import {withRouter , Link} from "react-router-dom";
import {setLanguage} from "../mainRedux/actions/actions";
import {connect} from "react-redux";
import {compose} from "redux";
import {withStyles} from '@material-ui/core/styles';
import {tu} from "../utils/i18n";
import { NavLink } from 'react-router-dom'


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


    handleClick = name => event => {


        switch ([name][0]) {
            case "myWallets":
                window.location = '#/account';
                break;
            case "addWallet":
                window.location = '#/AddWallet';
                break;
            // case "send":
            //     window.location = '#/send';
            //     break;
            // case "buyToken":
            //     window.location = '#/BuyToken';
            //     break;
            //
            // case "voting":
            //     window.location = '#/account/votes';
            //     break;
            //
            // case "createToken":
            //     window.location = '#/createToken';
            //     break;

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

                        <a className="uk-navbar-item uk-margin-left  " href="#">
                            <img src={Redlogo} className="logo" alt="TronWalletEx"/>
                        </a>

                        <a className="uk-navbar-item">


                            <ul className="uk-navbar-nav">

                                <NavLink to='account' activeStyle={{
                                    fontWeight: "bold",
                                    color: "red"
                                }}> <span className="uk-icon uk-margin-small-right" data-uk-icon="icon: info"> </span>
                                    {tu('myWallets')}</NavLink>
                                {/*<li onClick={this.handleClick("myWallets")}>*/}
                                        {/*<span className="uk-icon uk-margin-small-right"*/}
                                              {/*data-uk-icon="icon: info"> </span>*/}
                                        {/*{tu('myWallets')}*/}
                                {/*</li>*/}
                            </ul>
                        </a>
                        <a className="uk-navbar-item">

                            <ul className="uk-navbar-nav">

                                <Link to='addWallet' replace>
                                    <span className="uk-icon uk-margin-small-right"
                                          data-uk-icon="icon: plus-circle"> </span>
                                    {tu('addWallet')}

                                    </Link>

                                {/*<li onClick={this.handleClick("addWallet")}>*/}
                                        {/*<span className="uk-icon uk-margin-small-right"*/}
                                              {/*data-uk-icon="icon: plus-circle"> </span>*/}
                                        {/*{tu('addWallet')}*/}

                                {/*</li>*/}
                            </ul>

                        </a>

                    </div>


                    <div className="uk-navbar-right uk-margin-right ">

                        <div className="btn-group">
                            <button className="btn dropdown-toggle" type="button" id="buttonMenu1"
                                    data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                {activeLanguage.toUpperCase()}
                            </button>

                            <div className="dropdown-menu" aria-labelledby="buttonMenu1">

                                <ul className="uk-nav uk-navbar-dropdown-nav">
                                    {
                                        Object.keys(languages).map(language => (

                                                <a key={language}
                                                   className="dropdown-item "
                                                   href="javascript:;"
                                                   onClick={() => this.setLanguage(language)}>{languages[language]}</a>
                                        ))
                                    }

                                </ul>

                            </div>

                        </div>

                    </div>
                </nav>

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