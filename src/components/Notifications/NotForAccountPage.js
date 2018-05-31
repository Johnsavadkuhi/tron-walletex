import React, {Component} from "react";
import {Col, Grid, Row} from "react-bootstrap";
import {withRouter} from "react-router-dom";

class NotBeforeAddWallet extends Component {


    render() {

        return (
            <div className="content m-4 p-4">

                <Grid fluid>

                    <div className="card">

                        <div className="header  pt-4 text-center">

                            <h4>About TRonWalletEx 0.0.1 version </h4>

                        </div>

                        <div className="content">

                            <Row>

                                <Col md={12}>


                                    <div className="container">

                                        <div className="row">

                                        <div className="col-md-6">

                                            <div role="alert" className="alert-with-icon alert alert-info m-4 text-center" >
                                        <span data-notify="message" >

                                            <h6> you can create multiple wallets </h6>

                                            </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div role="alert" className="alert-with-icon alert alert-info m-4 text-center" >
                                        <span data-notify="message" >

                                            <h6> you can add wallet with private key in this version</h6>

                                            </span>

                                            </div>


                                        </div>


                                        <div className="col-md-6">

                                            <div role="alert" className="alert-with-icon alert alert-info m-4 text-center" >

                                                <span data-notify="message" >

                                            <h6> you can Send TRX and other tokens </h6>

                                            </span>

                                            </div>


                                        </div>

                                        <div className="col-md-6 ">

                                            <div role="alert" className="alert-with-icon alert alert-info m-4 text-center" >

                                                <span data-notify="message" >

                                                 <h6>  you can Buy Tokens </h6>

                                            </span>

                                            </div>


                                        </div>

                                            <div className="col-md-12 ">

                                                <div role="alert" className="alert-with-icon alert alert-info m-4 text-center p-4" >

                                                <span data-notify="message" >

                                            <h6> you can create your Own Tokens  </h6>

                                            </span>

                                                </div>


                                            </div>




                                        </div>

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

export default withRouter(NotBeforeAddWallet);
