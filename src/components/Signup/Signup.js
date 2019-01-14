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
import { loginRequest, loginSuccess, loginFailure } from "../../actions/actions";
import Log from '../../Log';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    // We can use the login request here to trigger a loading sequence within the App but its generic enough to be anything not just logging in!
    isFetching: (data) => dispatch(loginRequest(data)),
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data))
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

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.props.isFetching();

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });

            this.setState({ newUser });
        } catch (e) {
            Log.error('Error Signing up new user...', e)
        }


        this.props.isFetching(false);
    };

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
        );
    }

    render() {
        return (
            <Container>
                <div className="Signup">
                    {this.state.newUser === null
                        ? this.renderForm()
                        : this.renderConfirmationForm()}
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);