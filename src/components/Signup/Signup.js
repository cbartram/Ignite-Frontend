import React, { Component } from "react";
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import LoaderButton from "../LoaderButton/LoaderButton";
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';
import "./Signup.css";
import Container from "../Container/Container";
import { loginRequest, loginSuccess, loginFailure, hideErrors } from "../../actions/actions";
import Log from '../../Log';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    // We can use the login request here to trigger a loading sequence within the App but its generic enough to be anything not just logging in!
    isFetching: (data) => dispatch(loginRequest(data)),
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    hideErrors: () => dispatch(hideErrors()),
});

/**
 * Presentational Component which shows the Signup form page
 */
class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    /**
     * Validates the users form input info is correct
     */
    validateForm() {
        const { email, password, confirmPassword } = this.state;
        return email.length > 0 && password.length > 0 && password === confirmPassword
    }
    /**
     * Validates the confirmation dialog box has input.
     */
    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    /**
     * Handles updating local state with form changes.
     */
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    /**
     * Handles the user submitting the form to register them with AWS Cognito
     */
    handleSubmit = async event => {
        event.preventDefault();
        this.props.isFetching();
        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });

            // This triggers the app to show the confirmation dialog box
            this.setState({ newUser });
        } catch (err) {
            Log.error('Error Signing up new user...', err);
            this.props.loginFailure(err);
        }
        this.props.isFetching(false);
    };

    /**
     * Handles the confirmation dialog being submitted.
     */
    handleConfirmationSubmit = async event => {
        event.preventDefault();
        this.props.isFetching();

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            const user = await Auth.signIn(this.state.email, this.state.password);

            this.props.loginSuccess(user);
            this.props.history.push('/');
        } catch (err) {
            Log.error('Error confirming user code or logging user in...', err);
            this.props.loginFailure(err)
        }
    };

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <HelpBlock>Please check your email for the confirmation code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.props.auth.isFetching}
                    text="Verify"
                    loadingText="Verifying…"
                />
            </form>
        );
    }

    renderForm() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup controlId="confirmPassword" bsSize="large">
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.props.auth.isFetching}
                        text="Signup"
                        loadingText="Signing up…"
                    />
                </form>
                <div className="d-flex flex-row justify-content-center">
                    <button className="btn btn-link" onClick={() => this.resendConfirmationCode()}>Re-send confirmation code.</button>
                </div>
            </div>
        );
    }

    resendConfirmationCode() {
        if(this.state.email.length === 0) {
            this.props.loginFailure({ code: 'InvalidEmailException', message: 'You must fill out your email first.'});
        } else {
            // New user must not be null this handles showing the confirmation dialog box
            this.setState({newUser: true}, async () => {
                try {
                    await Auth.resendSignUp(this.state.email);
                } catch (err) {
                    Log.error('Failed to re-send sign-up confirmation email');
                    this.props.loginFailure(err);
                }
            });
        }
    }

    render() {
        return (
            <Container>
                <div className="Signup">
                    {/* If there is an error alert the user */}
                    { (this.props.auth.error !== null && typeof this.props.auth.error !== 'undefined') &&
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <div className="alert alert-danger" role="alert">
                                <h4 className="alert-heading">Error Registering Account</h4>
                                <hr />
                                <p>
                                    { this.props.auth.error.code === 'UsernameExistsException' ?
                                        (
                                            <span>
                                                { this.props.auth.error.message }
                                                <button className="btn btn-link" onClick={() => this.resendConfirmationCode()}>Click here to re-send your confirmation code</button>
                                            </span>

                                        ) : this.props.auth.error.message
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    }
                    {
                        this.state.newUser === null
                        ? this.renderForm()
                        : this.renderConfirmationForm()
                    }
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);