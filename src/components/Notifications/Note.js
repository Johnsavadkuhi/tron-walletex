import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SendIcon from '@material-ui/icons/Send';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import AddIcon from '@material-ui/icons/Add';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';


import {Col, Row} from "react-bootstrap";


const styles = theme => ({
    root: {
        overflow: 'hidden',
        padding: `0 ${theme.spacing.unit * 3}px`,
    },
    wrapper: {
        maxWidth: 400,
    },
    paper: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit * 2,
    },
});

function returnContent(props , content , icon) {
    const { classes } = props;

    return(<div >
        <div >

            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={0}>
                    <Grid item>

                        <Avatar> {icon} </Avatar>

                    </Grid>

                    <Grid item xs>

                        <Typography> {content} </Typography>

                    </Grid>
                </Grid>
            </Paper>
        </div>
    </div>)


}

function AutoGridNoWrap(props) {


    return (


        <div className="content m-4 p-4">

            <Grid>

                <div className="card">

                    <div className="header  pt-4 text-center">

                        <h4>About TronWalletEx 0.0.3-beta.4 version </h4>

                    </div>

                    <div className="content mt-4 text-center">

                        <Row>

                            <Col  md={6} >

                                { returnContent(props , "you can create multiple wallets" , <AddIcon />)}
                                { returnContent(props , "you can add wallet with private Key" , <AccountBalanceWalletIcon/>)}
                                { returnContent(props , "you can Create Token" , <MoneyOffIcon/>)}


                            </Col>

                            <Col  md={6} >
                                { returnContent(props , "you can Send TRX and other Tokens" , <SendIcon/>)}
                                { returnContent(props , "you can buy Tokens" , <small>TRX</small>)}
                                { returnContent(props , "you can vote for every Token" ,<AllInclusiveIcon/> )}


                            </Col>


                        </Row>


                    </div>
                </div>
            </Grid>
        </div>










    );
}

AutoGridNoWrap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AutoGridNoWrap);


