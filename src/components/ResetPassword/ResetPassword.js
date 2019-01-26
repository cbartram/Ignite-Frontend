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
            isSendingCode: false
        };
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

    handleSendCodeClick = async event => {
        event.preventDefault();

        this.setState({ isSendingCode: true });

        try {
            await Auth.forgotPassword(this.state.email);
            this.setState({ codeSent: true });
        } catch (e) {
            this.props.loginFailure(e.message);
            this.setState({ isSendingCode: false });
        }
    };

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
        } catch (e) {
            this.setState({ isConfirming: false });
            this.props.loginFailure(e.message);
        }
    };

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

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmClick}>
                <FormGroup bsSize="large" controlId="code">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
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
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup bsSize="large" controlId="confirmPassword">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
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

    static renderSuccessMessage() {
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

    render() {
        return (
            <Container>
                {/* If there is an error alert the user */}
                { (this.props.auth.error !== null && typeof this.props.auth.error !== 'undefined') &&
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Oh No!</h4>
                            <hr />
                            <p>
                              { this.props.auth.error }
                            </p>
                        </div>
                    </div>
                </div>
                }
              <div className="ResetPassword">
                  {!this.state.codeSent
                      ? this.renderRequestCodeForm()
                      : !this.state.confirmed
                          ? this.renderConfirmationForm()
                          : ResetPassword.renderSuccessMessage()}
              </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
