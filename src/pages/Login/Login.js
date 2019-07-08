import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { Auth } from 'aws-amplify/lib/index';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import './Login.css';
import Log from '../../Log';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import {
    loginFailure,
    loginSuccess,
    loginRequest,
    fetchVideos,
    updateVideosSync,
} from '../../actions/actions';
import withContainer from "../../components/withContainer";
import { dispatchProcess } from "../../util";
import * as constants from "../../constants";

const mapStateToProps = state => ({
    auth: state.auth,
    billing: state.billing,
});

const mapDispatchToProps = dispatch => ({
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    loginRequest: () => dispatch(loginRequest()),
    fetchVideos: (username) => dispatch(fetchVideos(username)),
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
        // Show alert if there is a ?redirect= query param
        // if(this.props.location.search) {
        //     const pageName = this.props.location.search.substring(this.props.location.search.indexOf('=') + 2, this.props.location.search.length);
        //     this.props.pushAlert('info', 'Login', `You need to login before you can access the ${pageName} page.`);
        // }
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
            // Fetches both user videos and user billing information
            // using the same API route
            await dispatchProcess(fetchVideos(`user-${res.username}`), constants.VIDEOS_SUCCESS, constants.VIDEOS_FAILURE);
            this.props.loginSuccess(res);
        } catch (err) {
            if(err.code === 'NotAuthorizedException')
                Log.warn(err.message);
            else
                Log.error('Login Failed!', err);

            // Their device key is messed up
            if(err.message.includes('device') || err.message.includes('key')) {
                Log.warn('Device Key not recognized re-authenticating');
                localStorage.clear();
                const res = await Auth.signIn(this.state.email, this.state.password);
                Log.info('Login Success!', res);
                await dispatchProcess(fetchVideos(`user-${res.username}`), constants.VIDEOS_SUCCESS, constants.VIDEOS_FAILURE);
                this.props.loginSuccess(res);
            } else {
                this.props.loginFailure(err);
                this.props.pushAlert('danger', 'Login Failed', err.message);
            }
        }
    };

    render() {
        return (
                <div className="row">
                    <div className="col-lg-5 offset-lg-4 col-md-5 offset-md-4 col-sm-3 offset-sm-4 col-xs-3">
                        <div className="Login">
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <label>Email</label>
                                    <FormControl
                                        autoFocus
                                        id="email"
                                        className="form-field-default"
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Password</label>
                                    <FormControl
                                        id="password"
                                        className="form-field-default"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        type="password"
                                    />
                                </FormGroup>
                                <LoaderButton
                                    disabled={!this.validateForm()}
                                    type="submit"
                                    isLoading={this.props.auth.isFetching}
                                    text="Login"
                                    style={{marginBottom: 20}}
                                    loadingText="Logging in…"
                                    className="btn-block"
                                />
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
