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
import { AMPLIFY_CONFIG } from './constants';
import {IS_PROD} from "./constants";


// Object holding action types as keys and promises as values which need resolutions
const typeResolvers = {};
let currentStore;

/**
 * Custom Redux middleware which wraps the action being dispatched
 * in a promise which can be resolved or rejected before continuing
 * @param store Object redux store
 * @returns {function(*): Function}
 */
const dispatchProcessMiddleware = (store) => {
    currentStore = store;
    return next => (action) => {
        const resolvers = typeResolvers[action.type];
        if (resolvers && resolvers.length > 0) {
            resolvers.forEach(resolve => resolve());
        }
        next(action);
    };
};

/**
 * Unique Dispatch which can use promises to wait for async dispatch
 * actions to complete successfully or fail gracefully.
 * @param requestAction Function the action being dispatched (called as a function)
 * @param successActionType String the action type if the async action was successful
 * @param failureActionType String the action type if the async action was un-successful
 * @returns {Promise<any>}
 */
const dispatchProcess = (requestAction, successActionType, failureActionType = undefined) => {
    if (!currentStore) {
        throw new Error('dispatchProcess middleware must be registered');
    }

    if (!successActionType) {
        throw new Error('At least one action to resolve process is required');
    }


    const promise = new Promise((resolve, reject) => {
        typeResolvers[successActionType] = typeResolvers[successActionType] || [];
        typeResolvers[successActionType].push(resolve);
        if (failureActionType) {
            typeResolvers[failureActionType] = typeResolvers[failureActionType] || [];
            typeResolvers[failureActionType].push(reject);
        }
    });

    currentStore.dispatch(requestAction);

    return promise;
};


// Setup Redux middleware and store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk, dispatchProcessMiddleware)
));

// Configure federated identity providers (AWS Cognito)
Amplify.configure(AMPLIFY_CONFIG);

// Setup Logger
if (!IS_PROD || localStorage.getItem('FORCE_LOGS') === true) {
    localStorage.setItem('debug', 'ignite:*');
}

// Checks the cookies/local storage to see if the user has been authenticated recently/remembered.
const checkAuthStatus = async () => {
    Log.info('Checking User Authentication status...');
    try {
        const user = await Auth.currentSession();
        Log.info(user.idToken.payload.email, 'Found Authenticated user within a Cookie!');
        Log.info('Attempting to retrieve user videos...');

        // Using our custom middleware we can now wait for a async dispatch to complete
        await dispatchProcess(fetchVideos(user.idToken.payload.email), constants.VIDEOS_SUCCESS, constants.VIDEOS_FAILURE);
        // TODO set the active video to the last video in the series that the user was last watching (started: true, completed: false, scrubDuration > 0)

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

