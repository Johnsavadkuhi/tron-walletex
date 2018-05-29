import React, {Fragment} from "react";
import {ONE_TRX} from "../../constants";
// import {AddressLink} from "../common/Links";
import {getNotifyPermission, requestNotifyPermissions, sendNotification} from "../../services/notifications";
import SweetAlert from "react-bootstrap-sweetalert";
// import {channel} from "../../services/api";
import io from "socket.io-client";

function Notification({ account, notification }) {

    switch (notification.type) {
        case "transaction":

            let amount = notification.amount;
            if (notification.tokenName.toUpperCase() === "TRX") {
                amount = amount / ONE_TRX;
            }

            if (notification.transferFromAddress === account.address) {
                return (
                    <li key={notification.id} className="dropdown-item p-1">
                        <div className="media">
                            <i className="fa fa-sort-up fa-2x text-danger m-2" />
                            <div className="media-body">

                                <h6 className="m-0 text-danger">Send {amount} {notification.tokenName}</h6>
                                to  {notification.transferToAddress}
                                {/*<AddressLink address={notification.transferToAddress} truncate={false}/>*/}


                            </div>
                        </div>
                    </li>
                );
            } else if (notification.transferToAddress === account.address) {
                return (
                    <li key={notification.id} className="dropdown-item p-1">
                        <div className="media">
                            <i className="fa fa-sort-down fa-2x text-success m-2" />
                            <div className="media-body">
                                <h6 className="m-0 text-success">Received {amount} {notification.tokenName}</h6>
                                from
                                {/*<AddressLink address={notification.transferFromAddress} truncate={false}/>*/}
                                {notification.transferFromAddress}
                            </div>
                        </div>
                    </li>
                );
            }
            break;

        case "vote":

            return (
                <li key={notification.id} className="dropdown-item p-1">
                    <div className="media">
                        <i className="fa fa-bullhorn fa-2x text-primary m-2" />
                        <div className="media-body">
                            <h6 className="m-0 text-primary">Received {notification.votes} votes</h6>
                            from  {notification.voterAddress}
                            {/*<AddressLink address={notification.voterAddress} truncate={false}/>*/}

                        </div>
                    </div>
                </li>
            );

        default : return;

    }
}


export default class Notifications extends React.Component {

    constructor() {
        super();
        this.state = {
            modal: null,
            notifications: [],
        };
    }

    componentDidMount() {
        this.reconnect();
    }

    componentDidUpdate(prevProps) {

        // let {wallet} = this.props;
        // if (prevProps.wallet.current === null || wallet.current.address !== prevProps.wallet.current.address) {
        //     this.reconnect();
        // }


        if (prevProps.wallet === null || this.props.wallet.address !== prevProps.wallet.address) {
            this.reconnect();
        }


    }

    reconnect() {

        this.listener && this.listener.close();

        this.listener = io(process.env.API_URL + "/address-" + this.props.wallet.address);

        this.listener.on("transaction", trx => {

            let amount = trx.amount;

            if (trx.tokenName.toUpperCase() === "TRX") {

                amount = amount / ONE_TRX;

            }

            if (trx.transferToAddress === this.props.wallet.address) {

                sendNotification(`Received ${amount} ${trx.tokenName} from ${trx.transferFromAddress}`, {

                    icon: require("../../images/tron_logo.png")

                });
            }


            this.setState(state => ({

                notifications: [{

                    id: this.id++,

                    type: "transaction",

                    ...trx,

                }, ...state.notifications.slice(0, 9)]

            }));

        });


        this.listener.on("vote", vote => {

            if (vote.candidateAddress === this.props.wallet.address) {
                sendNotification(`Received ${vote.votes} votes from ${vote.voterAddress}`, {
                    icon: require("../../images/tron_logo.png")
                });
            }

            this.setState(state => ({
                notifications: [{
                    id: this.id++,
                    type: "vote",
                    ...vote,
                }, ...state.notifications.slice(0, 9)]
            }));
        });
    }

    componentWillUnmount() {
        this.listener && this.listener.close();
    }

    enableDesktopNotifications = async () => {
        if (await requestNotifyPermissions()) {
            this.setState({
                modal: (
                    <SweetAlert success title="Notifications Enabled" onConfirm={() => this.setState({ modal: null, })}>
                        Desktop Notifications Enabled!
                    </SweetAlert>
                )
            });
        }
    };

     shouldRequestForPermission() {
        return getNotifyPermission() === "default";
    }

    render() {

        let {modal, notifications = [] } = this.state;

        return (
            <span>
<div className="dropdown nav-item">
                {modal}

                <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:">
                    <i className="fa fa-bell mr-2"/>
                    {
                        notifications.length > 0 &&
                        <span className="badge badge-notify">{notifications.length}</span>
                    }
                </a>

                <ul className="dropdown-menu dropdown-menu-right">
                    {
                        notifications.length === 0 &&
                        <h6 className="dropdown-header text-center">No notifications</h6>
                    }
                    {
                        notifications.length > 0 &&
                        <Fragment>
                            {
                                notifications.map(notification => (
                                    <Notification key={notification.id} account={this.props.wallet} notification={notification} />
                                ))
                            }
                        </Fragment>
                    }
                    {
                       this.shouldRequestForPermission() &&
                        <a href='javascript:;' className="dropdown-item" onClick={this.enableDesktopNotifications}>
                            Enable Desktop Notifications
                        </a>
                    }
                </ul>
</div>
            </span>
        );
    }
}
