import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import App from '../../App';
import Login from '../../pages/Login/Login';
import NotFound from '../../pages/NotFound/NotFound';
import Signup from '../../pages/Signup/Signup';
import Videos from '../../pages/Videos/Videos';
import Error from '../../pages/Error/Error';
import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute';
import Avenue from '../Avenue/Avenue';
import Pricing from '../../pages/Pricing/Pricing';
import Watch from '../../pages/Watch/Watch';
import ResetPassword from '../ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import Legal from '../../pages/Legal/Legal';
import CookiePolicy from '../../pages/Legal/CookiePolicy';
import Terms from '../../pages/Legal/Terms';
import Support from '../../pages/Support/Support';
import Quiz from '../../pages/Quiz/Quiz';
import QuizResults from "../../pages/QuizResults/QuizResults";

const mapStateToProps = state => ({
   auth: state.auth,
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Router extends Component {
    render() {
        console.log(this.props);
        if(this.props.error)
            return (
                <BrowserRouter>
                    <Switch>
                        <Avenue component={Error} />
                    </Switch>
                </BrowserRouter>
            );


        return (
            <BrowserRouter>
                <Switch>
                    {/* Avenue's are only able to be accessed by un-authenticated users while <Route /> is accessible by everyone */}
                    <Avenue exact path="/" component={App} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue exact path="/login" component={Login} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue exact path="/login/reset" component={ResetPassword} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue path="/signup" component={Signup} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute exact path="/videos" component={Videos} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute path="/profile" component={Profile} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute path="/support" component={Support} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute path="/watch" component={Watch} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute exact path="/quiz" component={Quiz} isAuthenticated={this.props.auth.user !== null} />
                    <AuthenticatedRoute path="/quiz/results" component={QuizResults} isAuthenticated={this.props.auth.user !== null} />
                    <Avenue path="/pricing" component={Pricing} />
                    <Avenue path="/legal" component={Legal} />
                    <Avenue path="/cookie" component={CookiePolicy} />
                    <Avenue path="/terms" component={Terms} />
                    {/* Catch All unmatched paths with a 404 */}
                    <Route path="/sitemap.xml" onEnter={() => window.location.reload()} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default connect(mapStateToProps)(Router);
