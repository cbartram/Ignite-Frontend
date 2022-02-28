import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import {
    FormGroup,
    FormControl,
} from 'react-bootstrap';
import LoaderButton from '../LoaderButton/LoaderButton';
import {
    loginFailure,
    loginRequest,
    loginSuccess,
    hideErrors
} from '../../actions/actions';
import './ResetPassword.css';
import withContainer from "../withContainer";

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
            this.props.pushAlert('danger', 'Oh No!', this.props.auth.error.message)
        }
    };

    /**
     * Function called when the user is submitting the form to reset their password.
     * @param event Object Javascript event object
     * @returns {Promise<void>}
     */
    handleConfirmClick = async event => {
        event.preventDefault();

        this.setState({ isConfirming: true });

        try {
            await Auth.forgotPasswordSubmit(
                this.state.email,
                this.state.code,
                this.state.password
            );
            this.props.hideErrors();
            this.setState({ confirmed: true });
        } catch (err) {
            this.setState({ isConfirming: false });
            this.props.loginFailure(err);
            this.props.pushAlert('danger', 'Oh No!', this.props.auth.error.message)

        }
    };

    /**
     * Renders the UI for asking the user for their email
     * in order to reset their password.
     */
    renderRequestCodeForm() {
        return (
            <form onSubmit={this.handleSendCodeClick}>
                <FormGroup controlId="email">
                    <label>Email</label>
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
                <FormGroup controlId="code">
                    <label>Confirmation Code</label>
                    <FormControl
                        autoFocus
                        className="form-field-default"
                        type="tel"
                        value={this.state.code}
                        onChange={this.handleChange}
                    />
                    <small>
                        Please check your email ({this.state.email}) for the confirmation
                        code.
                    </small>
                </FormGroup>
                <hr />
                <FormGroup controlId="password">
                    <label>New Password</label>
                    <FormControl
                        className="form-field-default"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword">
                    <label>Confirm Password</label>
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
                    text="Confirm"
                    loadingText="Confirm…"
                    isLoading={this.state.isConfirming}
                    disabled={!this.validateResetForm()}
                />
            </form>
        );
    }

    renderSuccessMessage() {
        this.props.pushAlert('success', 'Success', 'Your password has been reset successfully!');
        return (
            <div className="success">
                <p>Your password has been reset.</p>
                <p>
                    <Link to="/login">
                        Click here to login with your new credentials.
                    </Link>
                </p>
            </div>
        );
    }

    render() {
        return (
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
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(ResetPassword), { style: { backgroundColor: '#ffffff' }});
