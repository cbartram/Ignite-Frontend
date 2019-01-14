import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import App from '../../App';
import Login from '../Login/Login';
import NotFound from '../NotFound/NotFound';
import Signup from '../Signup/Signup';
import Tracks from '../Tracks/Tracks';
import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute';

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
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <AuthenticatedRoute exact path="/tracks" component={Tracks} isAuthenticated={this.props.auth.user !== null} />
                    {/* Catch All unmatched paths with a 404 */}
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default connect(mapStateToProps)(Router);
