import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import * as Apollo from 'apollo-boost';
import {setContext} from "apollo-link-context";
import {ApolloClient} from 'apollo-client'
import {ApolloProvider} from "react-apollo";
import Amplify, {Auth} from 'aws-amplify';
import {CookiesProvider} from 'react-cookie';
import ReactGA from "react-ga";
import rootReducer from './reducers/rootReducer';
import * as constants from './constants'
import {AMPLIFY_CONFIG, API_KEY, DEV_URL, FB_APP_ID, IS_PROD, PROD_API_KEY, PROD_URL} from './constants'
import Router from './components/Router/Router'
import Log from './Log';
import {fetchVideos, loginSuccess} from './actions/actions';
import {Loader} from "semantic-ui-react";
import {Elements, StripeProvider} from 'react-stripe-elements';
import {dispatchProcess, dispatchProcessMiddleware} from './util';
import './index.css';

// Setup Redux middleware and store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk, dispatchProcessMiddleware)
));

// Configure federated identity providers (AWS Cognito)
Amplify.configure(AMPLIFY_CONFIG);

// Setup Logger
if (!IS_PROD || localStorage.getItem('FORCE_LOGS') === true) localStorage.setItem('debug', 'ignite:*');

ReactGA.initialize('UA-133319035-1');
ReactGA.pageview(window.location.pathname + window.location.search);

/**
 * Checks the cookies/local storage to see if the user has been authenticated recently/remembered and loads
 * necessary data from the user's profile such as their video and quiz progress.
 * @returns {Promise<void>}
 */
const load = async () => {
    Log.info('Checking User Authentication status...');

    // Load the Facebook SDK
    window.fbAsyncInit = function() {
        window.FB.init({
            appId: FB_APP_ID,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v3.1'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    try {
        const user = await Auth.currentSession();
        ReactGA.set({userId: user.idToken.payload['cognito:username']});
        Log.info(user.idToken.payload['cognito:username'], 'Found Authenticated user within a Cookie!');
        Log.info('Attempting to retrieve user videos...');

        // Using our custom middleware we can now wait for a async dispatch to complete
        // Fetch videos is misleading because it does not just fetch videos but also billing info and quiz data.
        // It basically loads up all the data for the user when the App loads.
        store.dispatch(loginSuccess(user));
        await dispatchProcess(fetchVideos(`user-${user.idToken.payload['cognito:username']}`), constants.VIDEOS_SUCCESS, constants.VIDEOS_FAILURE);
    }
    catch (e) {
        Log.warn('Could not find authenticated user.');
        // Check Cognito for an active session on the server
        if (e !== 'No current user') {
            Log.error(e);
        }
    }

    // Adds custom headers to graphQL requests
    const authLink = setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                Authorization: store.getState().auth.user === null ? '' : store.getState().auth.user.jwtToken,
                'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY,
            },
        }
    });

    // Setup GraphQL Client
    return new ApolloClient({
        link: authLink.concat(Apollo.HttpLink({uri: IS_PROD ? `${PROD_URL}/graphql` : `${DEV_URL}/graphql`})),
        cache: new Apollo.InMemoryCache()
    });
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
            <StripeProvider apiKey="pk_test_AIs6RYV3qrxG6baDpohxn1L7">
                <Elements>
                    <Loader active />
                </Elements>
            </StripeProvider>
        </Provider>,document.getElementById('root'));

    try {
        // Returns an ApolloClient Object
        const client = await load();
        // Now render the full page
        ReactDOM.render(
            <ApolloProvider client={client}>
                <CookiesProvider>
                    <Provider store={store}>
                        <StripeProvider apiKey="pk_test_AIs6RYV3qrxG6baDpohxn1L7">
                            <Elements>
                                <Router/>
                            </Elements>
                        </StripeProvider>
                    </Provider>
                </CookiesProvider>
            </ApolloProvider>
            , document.getElementById('root'));

        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: http://bit.ly/CRA-PWA
        serviceWorker.unregister();
    } catch(err) {
        Log.error(err);

        ReactDOM.render(
        <Provider store={store}>
            <StripeProvider apiKey="pk_test_AIs6RYV3qrxG6baDpohxn1L7">
                <Elements>
                    <Router error />
                </Elements>
            </StripeProvider>
        </Provider>, document.getElementById('root'));
    }
};

// Execute the App
render().then(() => {
    Log.info('Ignite Rendered Successfully.')
});

