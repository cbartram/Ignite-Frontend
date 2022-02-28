import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import {
    HelpBlock,
    FormGroup,
    Glyphicon,
    FormControl,
    ControlLabel
} from 'react-bootstrap';
import LoaderButton from '../LoaderButton/LoaderButton';
import Container from '../Container/Container';
import {
    loginFailure,
    loginRequest,
    loginSuccess,
    hideErrors
} from '../../actions/actions';
import './ResetPassword.css';
import Alert from '../Alert/Alert';
import AlertContainer from '../AlertContainer/AlertContainer';
import _ from "lodash";

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    loginRequest: () => dispatch(loginRequest()),
    hideErrors: () => dispatch(hideErrors()),
});

/**
 * Handles re-setting a user's password
 */
class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "",
            email: "",
            password: "",
            codeSent: false,
            confirmed: false,
            confirmPassword: "",
            isConfirming: false,
            isSendingCode: false,
            alerts: []
        };
    }

    componentDidMount() {
        // Hide any errors from user's entering in previous (unknown) passwords
        this.props.hideErrors();
    }

    validateCodeForm() {
        return this.state.email.length > 0;
    }

    validateResetForm() {
        return (
            this.state.code.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };


    /**
     * Function called when a user clicks the button to send them a code
     * @param event
     * @returns {Promise<void>}
     */
    handleSendCodeClick = async event => {
        event.preventDefault();

        this.setState({ isSendingCode: true });

        try {
            await Auth.forgotPassword(this.state.email);
            this.setState({ codeSent: true });
        } catch (err) {
            this.props.loginFailure(err);
            this.setState({ isSendingCode: false });
            this.pushAlert('danger', 'Oh No!', this.props.auth.error.message)
        }
    };

    /**
     * Function called when the user is submitting the form to reset their password.
     * @param event Object Javascript event object
     * @returns {Promise<void>}
     */
    handleConfirmClick = async event => {
        event.preventDefault();
        try {
            await Auth.forgotPasswordSubmit(
                this.state.email,
                this.state.code,
                this.state.password
            );
            this.props.hideErrors();
            this.setState({ confirmed: true });
        } catch (err) {
            console.log("Error occurred while attempting to reset password: ", err)
            this.props.loginFailure(err);
        }
    };

    /**
     * Renders the UI for asking the user for their email
     * in order to reset their password.
     */
    renderRequestCodeForm() {
        return (
            <form onSubmit={this.handleSendCodeClick}>
                <FormGroup bsSize="large" controlId="email">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        className="form-field-default"
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    loadingText="Sending…"
                    text="Send Confirmation"
                    isLoading={this.state.isSendingCode}
                    disabled={!this.validateCodeForm()}
                />
            </form>
        );
    }

    /**
     * Handles rendering the confirmation dialog for the user
     * after they have submitted their email.
     */
    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmClick}>
                <FormGroup bsSize="large" controlId="code">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        className="form-field-default"
                        type="tel"
                        value={this.state.code}
                        onChange={this.handleChange}
                    />
                    <HelpBlock>
                        Please check your email ({this.state.email}) for the confirmation
                        code.
                    </HelpBlock>
                </FormGroup>
                <hr />
                <FormGroup bsSize="large" controlId="password">
                    <ControlLabel>New Password</ControlLabel>
                    <FormControl
                        className="form-field-default"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup bsSize="large" controlId="confirmPassword">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        className="form-field-default"
                        type="password"
                        onChange={this.handleChange}
                        value={this.state.confirmPassword}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    text="Confirm"
                    loadingText="Confirm…"
                    isLoading={this.state.isConfirming}
                    disabled={!this.validateResetForm()}
                />
            </form>
        );
    }

    renderSuccessMessage() {
        // this.pushAlert('success', 'Success', 'Your password has been reset successfully!');
        return (
            <div className="success">
                <Glyphicon glyph="ok" />
                <p>Your password has been reset.</p>
                <p>
                    <Link to="/login">
                        Click here to login with your new credentials.
                    </Link>
                </p>
            </div>
        );
    }

    /**
     * Pushes an alert onto the stack to be
     * visible by users
     */
    pushAlert(type, title, message, id = _.uniqueId()) {
        const { alerts } = this.state;
        // Push an object of props to be passed to the <Alert /> Component
        alerts.push({
            type,
            title,
            id,
            message,
        });

        this.setState({ alerts });
    }

    /**
     * Removes an alert from the stack so that
     * it is no longer rendered on the page
     * @param id Integer the unique alert id
     */
    removeAlert(id) {
        const { alerts } = this.state;
        const newAlerts = [
            ...alerts.filter(alert => alert.id !== id)
        ];

        this.setState({ alerts: newAlerts });
    }

    render() {
        return (
            <Container style={{backgroundColor: '#ffffff'}}>
                <AlertContainer>
                    {
                        this.state.alerts.map((props, index) =>
                            <Alert onDismiss={() => this.removeAlert(props.id)} {...props} key={index}>
                                { props.message }
                            </Alert>
                        )
                    }
                </AlertContainer>
                <div className="row">
                    <div className="col-lg-5 offset-lg-4 col-md-5 offset-md-4 col-sm-3 offset-sm-3 col-xs-3 offset-xs-3">
                        <div className="ResetPassword">
                            {!this.state.codeSent
                                ? this.renderRequestCodeForm()
                                : !this.state.confirmed
                                    ? this.renderConfirmationForm()
                                    : this.renderSuccessMessage()}
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
