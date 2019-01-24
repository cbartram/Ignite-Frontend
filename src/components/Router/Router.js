import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import App from '../../App';
import Login from '../Login/Login';
import NotFound from '../NotFound/NotFound';
import Signup from '../Signup/Signup';
import Tracks from '../Tracks/Tracks';
import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute';
import Avenue from '../Avenue/Avenue';
import Pricing from '../Pricing/Pricing';
import Watch from '../Watch/Watch';
import ResetPassword from '../ResetPassword/ResetPassword';
import Profile from '../Profile/Profile';

const mapStateToProps = state => ({
   auth: state.auth,
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {/* Avenue's are only able to be accessed by un-authenticated users while <Route /> is accessible by everyone */}
                    <Avenue exact path="/" component={App} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue exact path="/login" component={Login} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue exact path="/login/reset" component={ResetPassword} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue path="/signup" component={Signup} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute exact path="/videos" component={Tracks} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute path="/watch" component={Watch} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute path="/profile" component={Profile} isAuthenticated={this.props.auth.user !== null} />
                    <Route path="/pricing" component={Pricing} />
                    {/* Catch All unmatched paths with a 404 */}
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default connect(mapStateToProps)(Router);
