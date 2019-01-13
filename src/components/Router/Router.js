import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import App from '../../App';
import Login from '../Login/Login';
import NotFound from '../NotFound/NotFound';

const mapStateToProps = state => ({
   auth: state.auth,
});

class Router extends Component {
    componentDidMount() {
        console.log(this.props.auth);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login} />
                    {/* Catch All unmatched paths with a 404 */}
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default connect(mapStateToProps)(Router);