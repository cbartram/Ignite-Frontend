import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import rootReducer from './reducers/rootReducer';
import  Amplify from 'aws-amplify';
import * as constants from './constants'
import config from './config';

// Import Page Components
import App from './App';
import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';

// Setup Redux middleware and store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk)
));

// Configure federated identity providers (AWS Cognito)
Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
        region: config.s3.REGION,
        bucket: config.s3.development.BUCKET, // TODO change this to prod before deployment
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
        endpoints: [
            {
                name: "Ignite API", // The name of our API in API Gateway in case we want to use more
                endpoint: config.apiGateway.development.URL, // TODO change this to prod before deployment
                region: config.apiGateway.REGION
            },
        ]
    }
});

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                {/* Catch All unmatched paths with a 404 */}
                <Route component={NotFound} />
            </Switch>
        </Router>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
