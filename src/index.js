import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Amplify, { Auth } from 'aws-amplify';
import rootReducer from './reducers/rootReducer';
import * as constants from './constants'
import Router from './components/Router/Router'
import Log from './Log';
import { loginSuccess, fetchVideos} from './actions/actions';
import { AMPLIFY_CONFIG, erika } from "./constants";

// Setup Redux middleware and store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk)
));

// Configure federated identity providers (AWS Cognito)
Amplify.configure(AMPLIFY_CONFIG);

// Setup Logger
if (process.env.NODE_ENV !== 'production') {
    localStorage.setItem('debug', 'ignite:*');
}

// Checks the cookies/local storage to see if the user has been authenticated recently/remembered.
const checkAuthStatus = async () => {
    Log.info('Checking User Authentication status...');
    try {
        const user = await Auth.currentSession();
        Log.info(user.idToken.payload.email, 'Found Authenticated user within a Cookie!');
        Log.info('Attempting to retrieve user videos...');
        store.dispatch(fetchVideos(user.idToken.payload.email));
        store.dispatch(loginSuccess(user));
    }
    catch (e) {
        Log.warn('Could not find authenticated user.');
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

