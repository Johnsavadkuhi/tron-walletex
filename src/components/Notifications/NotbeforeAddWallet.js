import React, {Component} from "react";
import {Col, Grid, Row} from "react-bootstrap";

class NotBeforeAddWallet extends Component {


    render() {

        return (
            <div className="content">

                <Grid fluid>

                    <div className="card">
                        <div className="header  pt-4 text-center">

                            Please Read the following first

                        </div>

                        <div className="content">


                            <Row>
                                <Col md={12}>

                                    <div role="alert" className="alert-with-icon alert alert-info m-4 text-center" >
                                        {/*<span data-notify="icon" className="pe-7s-bell"> </span>*/}
                                        <span
                                        data-notify="message" >

                                         We don't Save your Private Key or Password in our Servers

                                    </span>

                                    </div>

                                    <div role="alert" className="alert-with-icon alert alert-info m-4 text-center">
                                        {/*<span data-notify="icon" className="pe-7s-bell"> </span><span*/}

                                        <span> We don't provide a way you to restore your private Key or Password </span>

                                    </div>

                                    <div role="alert" className="alert-with-icon alert alert-warning m-4 text-center">
                                        {/*<span data-notify="icon" className="pe-7s-bell"> </span>*/}
                                        <span
                                            data-notify="message">

                                            Don't forget your Private Key or Password

                                    </span>

                                    </div>
                                    <div role="alert" className="alert-with-icon alert alert-danger m-4 text-center">
                                        {/*<span data-notify="icon" className="pe-7s-bell"> </span>*/}
                                        <span
                                            data-notify="message">

                                            Keep safe your Private key and don't allow anyone to see it


                                    </span>

                                    </div>

                                </Col>

                            </Row>


                        </div>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default NotBeforeAddWallet;
