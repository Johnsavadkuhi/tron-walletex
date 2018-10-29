import * as React from "react";
import Paper from "@material-ui/core/Paper/Paper";
import Stepper from "@material-ui/core/Stepper/Stepper";
import Step from "@material-ui/core/Step/Step";
import StepLabel from "@material-ui/core/StepLabel/StepLabel";
import StepContent from "@material-ui/core/StepContent/StepContent";
import Button from "@material-ui/core/Button/Button";
import {tu} from "../../../utils/i18n";
import Typography from "@material-ui/core/Typography/Typography";


export default  class Register extends React.Component{

    render()
    {
        return (

            <div className="row p-4">
                <div className="col-md-12">
                    <Paper className="p-4">

                        <Stepper activeStep={this.props.activeStep} orientation="vertical">

                            {this.props.steps.map((label, index) => {

                                return (

                                    <Step key={index}>

                                        <StepLabel>{label}</StepLabel>

                                        <StepContent>

                                            <div>{this.getStepContent(index)}</div>

                                            {/*start div */}

                                            <div className=" mt-2 mb-2">
                                                <div>

                                                    <Button

                                                        disabled={this.props.activeStep === 0}
                                                        onClick={this.handleBack}
                                                        className="btn btn-secondary btn-sm font-weight-normal">
                                                        {tu('back')}

                                                    </Button>

                                                    <Button
                                                        // disabled={ !((isPassValid ===false ) && (nameLengthIsOk===false))}
                                                        disabled={!(this.props.isPassValid && this.props.nameLengthIsOk)}
                                                        className="btn btn-info btn-sm font-weight-normal"
                                                        variant="contained"
                                                        onClick={this.handleNext}>


                                                        {this.props.activeStep === this.props.steps.length - 1 ? tu('finish') : tu('next')}

                                                    </Button>

                                                    {/*{activeStep===2 ? <button className="btn btn-info btn-sm font-weight-normal"> Print</button> : null}*/}

                                                </div>
                                            </div>

                                            {/*end div */}

                                        </StepContent>
                                    </Step>
                                );
                            })}

                        </Stepper>

                        {this.props.activeStep === this.props.steps.length &&

                        (
                            <Paper className="text-center" square elevation={0}>

                                <Typography className="text-primary text-center mb-3">All steps completed</Typography>


                                <Button onClick={this.handleReset}
                                        className="btn btn-primary btn-sm font-weight-normal">
                                    {tu('reset')}
                                </Button>

                                <Button onClick={this.handleChange("nextAfterRegister")}

                                        className="btn btn-success btn-sm font-weight-normal">

                                    {tu('enter')}

                                </Button>

                            </Paper>
                        )}

                    </Paper>
                </div>
            </div>
        );
    }





}

