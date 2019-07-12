import React, {Component} from "react";
import {FormControl, FormGroup,} from "react-bootstrap";
import _ from 'lodash';
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import {connect} from 'react-redux';
import {Auth} from 'aws-amplify/lib/index';
import {Link, withRouter} from 'react-router-dom';
import {fetchVideos, hideErrors, loginFailure, loginRequest, loginSuccess} from "../../actions/actions";
import {USER_POOL_URL} from "../../constants";
import Log from '../../Log';
import './Signup.css';
import withContainer from "../../components/withContainer";
import FacebookButton from "../../components/FacebookButton/FacebookButton";

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    // We can use the login request here to trigger a loading sequence within the App but its generic enough to be anything not just logging in!
    isFetching: (data) => dispatch(loginRequest(data)),
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    hideErrors: () => dispatch(hideErrors()),
    fetchVideos: (username) => dispatch(fetchVideos(username))
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
            hasAuthenticated: false, // Flag to disable facebook button when users have already clicked it so they dont get confused
            newUser: null,
        };
    }

    /**
     * Parses query values like id/access token
     */
    async componentDidMount() {
        // Parses query values from the URL (specific when there is no ? and only a # to denote the start)
        const getQueryVariable = (variable) => {
            const query = window.location.href.substring(window.location.href.indexOf("#") + 1);
            const vars = query.split('&');
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) === variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            Log.info('Query variable %s not found', variable);
        };

        if(!_.isUndefined(getQueryVariable('access_token'))) {
            try {
                const facebookUser = await (await fetch(`${USER_POOL_URL}/oauth2/userInfo`, {
                    headers: {
                        Authorization: `Bearer ${getQueryVariable('access_token')}`
                    }
                })).json();

                // Update state to pre-populate fields from facebook.
                this.setState({
                    first_name: facebookUser.name,
                    last_name: facebookUser.family_name,
                    email: facebookUser.email,
                    hasAuthenticated: true,
                });
                this.props.pushAlert('success', 'Finish Signing Up', 'Complete your Ignite account\'s setup by creating a new password!');
            } catch (err) {
                Log.error(err.message);
                this.props.pushAlert('danger', 'There was an issue signing up', 'We ran into a snag singing up with Facebook. You can always sign up directly with an Ignite account.');
            }
        }
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
                    name: `${this.state.first_name} ${this.state.last_name}`,
                }
            });

            this.props.hideErrors();

            // This triggers the app to show the confirmation dialog box
            this.setState({ newUser });
        } catch (err) {
            Log.error('Error Signing up new user...', err);
            this.props.loginFailure(err);
            this.props.pushAlert('danger', 'Error Registering Account', err.message);
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

            Log.info('Sign-in successful!');
            this.props.loginSuccess(user);
            this.props.fetchVideos(`user-${user.username}`);
            this.props.history.push('/videos');
        } catch (err) {
            Log.error('Error confirming user code or logging user in...', err);
            this.props.loginFailure(err);
            this.props.pushAlert('danger', 'Error confirming user', err.message);
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
                <p className="mb-3">Note that it may take up to 15 minutes for the email to arrive in your inbox.</p>
                <FormGroup controlId="confirmationCode">
                    <label>Confirmation Code</label>
                    <FormControl
                        autoFocus
                        className="form-field-default"
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <small>Please check your email for the confirmation code.</small>
                </FormGroup>
                <LoaderButton
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
            <div className="mt-3">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="first_name">
                        <label>First Name</label>
                        <FormControl
                            className="form-field-default"
                            type="text"
                            value={this.state.first_name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="last_name">
                        <label>Last Name</label>
                        <FormControl
                            className="form-field-default"
                            type="text"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="email">
                        <label>Email</label>
                        <FormControl
                            className="form-field-default"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <label>Password</label>
                        <FormControl
                            className="form-field-default"
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup controlId="confirmPassword">
                        <label>Confirm Password</label>
                        <FormControl
                            className="form-field-default"
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        disabled={!this.validateForm()}
                        type="submit"
                        className="btn-block"
                        isLoading={this.props.auth.isFetching}
                        text="Signup"
                        loadingText="Signing up…"
                    />
                </form>
                <hr />
                <FacebookButton
                    hasAuthenticated={this.state.hasAuthenticated}
                    onLogin={() => {}}
                    onError={() => Log.error('Error with Facebook SSO')}
                />
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
            this.props.pushAlert('danger', 'Missing Email', '')
        } else {
            // New user must not be null this handles showing the confirmation dialog box
            try {
                await Auth.resendSignUp(this.state.email);
                this.props.hideErrors();
                this.setState({ newUser: true});
            } catch (err) {
                Log.error('Failed to re-send sign-up confirmation email');
                this.props.loginFailure(err);
                this.props.pushAlert('danger', 'Failed to re-send email', err.message)
            }
        }
    }

    render() {
        return (
            <div>
                <div className="stripes-container initial">
                    <div className="stripe s2"/>
                    <div className="stripe s3"/>
                    <div className="stripe s4"/>
                    <div className="stripe s5"/>
                    <div className="stripe s7"/>
                    <div className="stripe gradient"/>
                    <div className="stripe s1"/>
                    <div className="stripe s6"/>
                    <div className="left-dots-container"/>
                    <div className="light-dots-container"/>
                    <div className="dark-dots-container"/>
                    <div className="medium-dots-container"/>
                </div>
                <div className="row">

                    <div className="ml-auto mr-auto my-4" style={{textAlign: 'center', maxWidth: 680}}>
                        <div className="container-lg">
                            <h1 className="headline-text">Create an Ignite Account</h1>

                            <h2 className="common-IntroText">Fill out the form to create an Ignite account and learn end
                                to end full
                                stack development</h2>
                        </div>
                    </div>
                    <div
                        className="col-lg-4 offset-lg-4 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-xs-6 offset-xs-2">
                        <div className="Signup">
                            {
                                this.state.newUser === null
                                    ? this.renderForm()
                                    : this.renderConfirmationForm()
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(Signup)), { style: { backgroundColor: '#ffffff'}});
