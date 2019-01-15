import React from "react";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

class Panel extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            expanded: null

        }


    }

    handleChangeForExpand = panel => (event, expanded) => {

        console.log("panel" , panel );
        this.setState({

            expanded: expanded ? panel : false,

        });

    };

    render() {

        const {expanded} = this.state;
        const {classes} = this.props;

        return (  <React.Fragment>

            <ExpansionPanel expanded={expanded === this.props.panel}
                            onChange={this.handleChangeForExpand(this.props.panel)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography className={classes.secondaryHeading}> {this.props.title} </Typography>

                </ExpansionPanelSummary>

                <ExpansionPanelDetails>


                    {this.props.element}


                </ExpansionPanelDetails>
            </ExpansionPanel>


        </React.Fragment>)
    }


}

export default withStyles(styles)(Panel);