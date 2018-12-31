import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = {
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
    },
    checked: {},
};

class CheckBox extends React.Component {

    state = {

        checkedG: false,
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        const { classes } = this.props;

        return (

            <FormGroup row>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.checkedG}
                            onChange={this.handleChange('checkedG')}
                            value="checkedG"
                            classes={{
                                root: classes.root,
                                checked: classes.checked,
                            }}
                        />
                    }
                    label="TDNS"
                />

            </FormGroup>
        );
    }
}

CheckBox.propTypes = {

    classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(CheckBox);
