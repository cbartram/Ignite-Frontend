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
import { Link } from 'react-router-dom';
import Container from "../Container/Container";
import { loginRequest, loginSuccess, loginFailure, hideErrors, fetchVideos } from "../../actions/actions";
import Log from '../../Log';
import Alert from '../Alert/Alert';
import AlertContainer from '../AlertContainer/AlertContainer';
import './Signup.css';
import _ from 'lodash';
// import FacebookButton from "../FacebookButton/FacebookButton";

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    // We can use the login request here to trigger a loading sequence within the App but its generic enough to be anything not just logging in!
    isFetching: (data) => dispatch(loginRequest(data)),
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    hideErrors: () => dispatch(hideErrors()),
    fetchVideos: (email) => dispatch(fetchVideos(email))
});

/**
 * Presentational Component which shows the Signup form page
 */
class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            confirmPassword: '',
            confirmationCode: '',
            newUser: null,
            alerts: [],
        };
    }

    /**
     * Validates the users form input info is correct
     */
    validateForm() {
        const { email, password, confirmPassword, first_name, last_name } = this.state;
        return email.length > 0 && password.length > 0 && first_name.length > 0 && last_name.length > 0 && password === confirmPassword
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
            [event.target.id]: event.target.value.trim()
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
                password: this.state.password,
                attributes: {
                    'custom:first_name': this.state.first_name,
                    'custom:last_name': this.state.last_name,
                    'custom:profile_picture': 'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg', // Give them a default profile picture
                    'custom:customer_id': 'null',
                    'custom:plan_id': 'null',
                    'custom:subscription_id': 'null',
                    'custom:premium': 'false',
                    'custom:plan': 'none'
                }
            });

            this.props.hideErrors();

            // This triggers the app to show the confirmation dialog box
            this.setState({ newUser });
        } catch (err) {
            Log.error('Error Signing up new user...', err);
            this.props.loginFailure(err);
            this.pushAlert('danger', 'Error Registering Account', err.message);
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
            Log.info('Attempting to sign-in newly created user...');
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            const user = await Auth.signIn(this.state.email, this.state.password);

            this.props.loginSuccess(user);
            Log.info('Sign-in successful!');
            this.props.fetchVideos(this.state.email);
            this.props.history.push('/videos');
        } catch (err) {
            Log.error('Error confirming user code or logging user in...', err);
            this.props.loginFailure(err);
            this.pushAlert('danger', 'Error confirming user', err.message);
        }
    };

    /**
     * Renders the confirmation code form for users to input
     * the code sent to their email.
     * @returns {*}
     */
    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        className="form-field-default"
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
                    <FormGroup controlId="first_name" bsSize="large">
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl
                            className="form-field-default"
                            type="text"
                            value={this.state.first_name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="last_name" bsSize="large">
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl
                            className="form-field-default"
                            type="text"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            className="form-field-default"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            className="form-field-default"
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup controlId="confirmPassword" bsSize="large">
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            className="form-field-default"
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
                {/*<hr />*/}
                {/*<FacebookButton*/}
                    {/*onError={() => this.pushAlert('danger', 'Login Issue', 'Failed to login with facebook')}*/}
                    {/*onLogin={data => {*/}
                        {/*try {*/}
                            {/*this.props.fetchVideos(this.state.email);*/}
                            {/*this.props.loginSuccess(data);*/}
                        {/*} catch(err) {*/}
                            {/*Log.error(err);*/}
                            {/*this.pushAlert('danger', 'Login Issue', 'Failed to login with facebook')*/}
                        {/*}*/}
                    {/*}}*/}
                {/*/>*/}
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <button className="btn btn-link" onClick={() => this.resendConfirmationCode()}>Re-send confirmation code.</button>
                    <span className="text-muted">
                        or
                    </span>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        );
    }

    /**
     * Re-sends a user a confirmation code for their account.
     * If the user is already confirmed it will not re-send a new code.
     */
    async resendConfirmationCode() {
        if(this.state.email.length === 0) {
            this.props.loginFailure({ code: 'InvalidEmailException', message: 'You must fill out your email first.'});
            this.pushAlert('danger', 'Missing Email', '')
        } else {
            // New user must not be null this handles showing the confirmation dialog box
            try {
                await Auth.resendSignUp(this.state.email);
                this.props.hideErrors();
                this.setState({ newUser: true});
            } catch (err) {
                Log.error('Failed to re-send sign-up confirmation email');
                this.props.loginFailure(err);
                this.pushAlert('danger', 'Failed to resent sign-up email', err.message)
            }
        }
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
            <Container style={{backgroundColor: '#FFFFFF'}}>
                <AlertContainer>
                {
                    this.state.alerts.map((props, index) =>
                        <Alert onDismiss={() => this.removeAlert(props.id)} {...props} key={index}>
                            { props.message }
                            { this.props.auth.error.code === 'UsernameExistsException' ?
                                (
                                    <span>
                                        { this.props.auth.error.message }
                                        <button className="btn btn-link" onClick={() => this.resendConfirmationCode()}>Click here to re-send your confirmation code</button>
                                    </span>
                                ) : this.props.auth.error.message
                            }
                        </Alert>
                    )
                }
                </AlertContainer>
                <div className="row">
                    <div className="col-lg-4 offset-lg-4 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-xs-6 offset-xs-2">
                        <div className="Signup">
                            {
                                this.state.newUser === null
                                ? this.renderForm()
                                : this.renderConfirmationForm()
                            }
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
