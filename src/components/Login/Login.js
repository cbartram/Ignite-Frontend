import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import './Login.css';
import Log from '../../Log';
import LoaderButton from '../LoaderButton/LoaderButton';
import {
    loginFailure,
    loginSuccess,
    loginRequest,
    fetchVideos,
    updateVideosSync,
} from '../../actions/actions';
import withContainer from "../withContainer";
// import FacebookButton from "../FacebookButton/FacebookButton";

const mapStateToProps = state => ({
    auth: state.auth,
    billing: state.billing,
});

const mapDispatchToProps = dispatch => ({
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    loginRequest: () => dispatch(loginRequest()),
    fetchVideos: (email) => dispatch(fetchVideos(email)),
    updateVideosSync: (videos) => dispatch(updateVideosSync(videos)),
});

/**
 * Login Component showing the email and password form fields.
 */
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isLoading: false,
        };
    }

    componentDidMount() {
        // this.loadFacebookSDK();
        // Show alert if there is a ?redirect= query param
        if(this.props.location.search) {
            const pageName = this.props.location.search.substring(this.props.location.search.indexOf('=') + 2, this.props.location.search.length);
            this.props.pushAlert('info', 'Login', `You need to login before you can access the ${pageName} page.`);
        }
    }

    /**
     * Ensures both form fields are filled out and valid
     * @returns {boolean} True if they are valid and false otherwise
     */
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    /**
     * Updates our local state with the user's email/password combo using the id attribute
     * from each JSX form field element
     * @param event Object JS event object.
     */
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    /**
     * Handles using AWS Amplify to submit our Authentication request to Cognito User pool.
     * @param event
     * @returns {Promise<void>}
     */
    handleSubmit = async event => {
        Log.info('Logging in...');
        event.preventDefault();
        // Dispatch the isFetching redux
        this.props.loginRequest();

        try {
            const res = await Auth.signIn(this.state.email, this.state.password);
            Log.info('Login Success!', res);
            // Fetches both user videos and user billing information
            // using the same API route
            this.props.fetchVideos(this.state.email);
            this.props.loginSuccess(res);
        } catch (err) {
            if(err.code === 'NotAuthorizedException')
                Log.warn(err.message);
            else
                Log.error('Login Failed!', err);

            this.props.loginFailure(err);
            this.props.pushAlert('danger', 'Login Failed', err.message);
        }
    };

    /**
     * Loads the Facebook SDK into the page
     */
    // loadFacebookSDK() {
    //     window.fbAsyncInit = function() {
    //         window.FB.init({
    //             appId: constants.FB_APP_ID,
    //             autoLogAppEvents: true,
    //             xfbml: true,
    //             version: 'v3.1'
    //         });
    //     };
    //
    //     (function(d, s, id){
    //         let js, fjs = d.getElementsByTagName(s)[0];
    //         if (d.getElementById(id)) {return;}
    //         js = d.createElement(s); js.id = id;
    //         js.src = "https://connect.facebook.net/en_US/sdk.js";
    //         fjs.parentNode.insertBefore(js, fjs);
    //     }(document, 'script', 'facebook-jssdk'));
    // }

    render() {
        return (
                <div className="row">
                    <div className="col-lg-5 offset-lg-4 col-md-5 offset-md-4 col-sm-3 offset-sm-4 col-xs-3">
                        <div className="Login">
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup controlId="email" bsSize="large">
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl
                                        autoFocus
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
                                <LoaderButton
                                    block
                                    bsSize="large"
                                    disabled={!this.validateForm()}
                                    type="submit"
                                    isLoading={this.props.auth.isFetching}
                                    text="Login"
                                    style={{marginBottom: 20}}
                                    loadingText="Logging in…"
                                />
                                {/*<hr/>*/}
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
                                <div className="d-flex flex-row justify-content-between">
                                    <Link to="/login/reset" className="text-muted">Forgot your password?</Link>
                                    <Link to="/signup" className="text-muted">Resend Confirmation</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(Login)), { style: { backgroundColor: '#ffffff'}});
