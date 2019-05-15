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
import Error from './pages/Error/Error';
import Log from './Log';
import { loginSuccess, fetchVideos } from './actions/actions';
import { AMPLIFY_CONFIG } from './constants';
import {IS_PROD} from "./constants";
import { Loader } from "semantic-ui-react";

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
if (!IS_PROD || localStorage.getItem('FORCE_LOGS') === true) localStorage.setItem('debug', 'ignite:*');

/**
 * Checks the cookies/local storage to see if the user has been authenticated recently/remembered and loads
 * necessary data from the user's profile such as their video and quiz progress.
 * @returns {Promise<void>}
 */
const load = async () => {
    Log.info('Checking User Authentication status...');
    try {
        const user = await Auth.currentSession();
        Log.info(user.idToken.payload.email, 'Found Authenticated user within a Cookie!');
        Log.info('Attempting to retrieve user videos...');

        // Using our custom middleware we can now wait for a async dispatch to complete
        // Fetch videos is misleading because it does not just fetch videos but also billing info and quiz data.
        await dispatchProcess(fetchVideos(user.idToken.payload.email), constants.VIDEOS_SUCCESS, constants.VIDEOS_FAILURE);
        store.dispatch(loginSuccess(user));
    }
    catch (e) {
        Log.warn('Could not find authenticated user.');
        console.log('No User found error caught.');
        if (e !== 'No current user') {
            Log.error(e);
        }
    }
};

/**
 * Render function renders the React app to the DOM and is simply a wrapper
 * to allow for async/await syntax
 * @returns {Promise<void>}
 */
const render = async () => {
    // Render a loading page immediately while we wait for our content to load
    ReactDOM.render(
        <Provider store={store}>
            <Loader active />
        </Provider>,document.getElementById('root'));

    try {
    await load();
    } catch(err) {
        Log.error(err.message);
        console.log(err);

        ReactDOM.render(
        <Provider store={store}>
            <Router error />
        </Provider>, document.getElementById('root'));
    }

    // Now render the full page
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

