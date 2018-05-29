import React, { Component } from "react";
import { Grid, Row, Col, Alert } from "react-bootstrap";

import Button from "../../components/CustomButton/CustomButton";

import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";


class Notifications extends Component {


    constructor(){
        super();

        this.handleClick = this.handleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            _notificationSystem: null
        };

    }
    componentDidMount(){
        this.setState({_notificationSystem: this.refs.notificationSystem})
    }

    handleClick(position){

        var level = 'warning'; // 'success', 'warning', 'error' or 'info'
        this.state._notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-gift"></span>),
            message: (
                <div>
                    the name length have to be <br/> more than 8 characters
                </div>
            ),
            level: level,
            position: position,
            autoDismiss: 15,
        });
    }





    render() {

        return (<div>



            <div className="row">
                <div className="col-md-2">
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <input className="text" onChange={this.handleClick.bind(this,'tr')}/>
                </div>
            </div>
            {/*<span onChange={this.handleClick.bind(this,'tr')}/>*/}

        </div>)



    }
}

export default Notifications;
