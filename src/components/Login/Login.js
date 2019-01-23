import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Login.css';
import Log from '../../Log';
import Container from '../Container/Container';
import LoaderButton from '../LoaderButton/LoaderButton';
import {
    loginFailure,
    loginSuccess,
    loginRequest,
    fetchVideos,
} from '../../actions/actions';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    loginSuccess: (data) => dispatch(loginSuccess(data)),
    loginFailure: (data) => dispatch(loginFailure(data)),
    loginRequest: () => dispatch(loginRequest()),
    fetchVideos: (email) => dispatch(fetchVideos(email)),
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
            Log.info('Login Success!');
            this.props.fetchVideos(this.state.email);
            this.props.loginSuccess(res);
        } catch (err) {
            console.log(err);
            if(err.code === 'NotAuthorizedException')
                Log.warn(err.message);
            else
                Log.error('Login Failed!', err);

            this.props.loginFailure(err);
        }
    };

    render() {
        return (
            <Container>
                <div className="Login">
                    {/* If there is an error alert the user */}
                    { (this.props.auth.error !== null && typeof this.props.auth.error !== 'undefined') &&
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <div className="alert alert-danger" role="alert">
                                <h4 className="alert-heading">Invalid Email or Password</h4>
                                <hr />
                                <p>The email or password you entered does not match what we have on record. You can try again or &nbsp;
                                    <Link to="/login/reset">reset your password.</Link> if you forgot.
                                </p>
                            </div>
                        </div>
                    </div>
                    }
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
                        <LoaderButton
                            block
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.props.auth.isFetching}
                            text="Login"
                            loadingText="Logging in…"
                        />
                        <Link to="/login/reset" className="text-muted">Forgot your password?</Link>
                    </form>
                </div>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
