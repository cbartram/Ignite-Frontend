import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import Amplify, { Auth } from 'aws-amplify';
import * as constants from './constants'
import config from './config';
import Router from './components/Router/Router'
import Log from './Log';
import { loginSuccess } from './actions/actions';

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

// Setup Logger
if (process.env.NODE_ENV !== 'production') {
    localStorage.setItem('debug', 'ignite:*');
}

// Checks the cookies/local storage to see if the user has been authenticated recently/remembered.
const checkAuthStatus = async () => {
    Log.info('Checking User Authentication status...');
    try {
        Auth.currentSession().then(user => {
            Log.info(user.idToken.payload.email, 'Found Authenticated user within a Cookie!');
            store.dispatch(loginSuccess(user))
        }).catch(err => {
            Log.warn('Could not find authenticated user.', err)
        });
    }
    catch (e) {
        if (e !== 'No current user')
           Log.error(e);
    }
};

const render = async () => {
    await checkAuthStatus();
    ReactDOM.render(
        <Provider store={store}>
            <Router />
        </Provider>
        , document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
};

// Execute the App
render().then(() => {
    Log.info('Ignite Rendered Successfully.')
});

