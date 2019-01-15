import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {deleteWallet} from "../../mainRedux/actions/actions";
import {compose} from "redux";
import {connect} from "react-redux";
import Swal from 'sweetalert2';

const styles = theme => ({
    root: {
        height: 10,
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 3,
    },
});

const actions = [
    {icon: <FileCopyIcon/>, name: 'Copy'},
    {icon: <SaveIcon/>, name: 'Save'},
    {icon: <PrintIcon/>, name: 'Print'},
    {icon: <ShareIcon/>, name: 'Share'},
    {icon: <DeleteIcon/>, name: 'Delete'},
];

class OpenIconSpeedDial extends React.Component {
    state = {
        open: false,
        // hidden: false,
    };

    handleVisibility = () => {
        this.setState(state => ({
            open: false,
        }));
    };

    handleClick = p => () => {

        switch (p) {
            case "Copy":
                console.log("copy");

                break;
            case "Save":
                console.log("save");

                break;

            case "Delete":

                Swal({

                    title: 'Remove this Wallet ',
                    type: 'warning',
                    text: 'Are you sure to remove this Wallet ? ',
                    showCancelButton: true,
                    cancelButtonText: 'No',

                    preConfirm: () => {
                        let {deleteWallet} = this.props;
                        console.log("address : ", this.props.walletinfo);
                        deleteWallet(this.props.walletinfo);


                    }

                }).then(value => {


                    if (value) {
                        Swal({

                            type: 'success',
                            title: 'Wallet Deleted'

                        })

                    }

                });


                break;
            default:
                break;


        }


    };

    handleOpen = () => {
        if (!this.state.hidden) {
            this.setState({
                open: true,
            });
        }
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        const {classes} = this.props;
        const {open, hidden} = this.state;

        return (
            <div className={classes.root}>
                <SpeedDial
                    ariaLabel="SpeedDial openIcon"
                    className={classes.speedDial}
                    hidden={hidden}
                    icon={<SpeedDialIcon openIcon={<EditIcon/>}/>}
                    onBlur={this.handleClose}
                    onClick={this.handleClick}
                    onClose={this.handleClose}
                    onFocus={this.handleOpen}
                    onMouseEnter={this.handleOpen}
                    onMouseLeave={this.handleClose}
                    open={open}
                    direction={"left"}
                >
                    {actions.map(action => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={this.handleClick(action.name)}

                        />
                    ))}
                </SpeedDial>
            </div>
        );
    }
}

function mapStateToProps(state) {

    return {}

}

const mapDispatchToProps = {


    deleteWallet

};


export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(OpenIconSpeedDial);