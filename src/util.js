/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import React from 'react';
import isNil from 'lodash/isNil';
import Log from './Log';
import {API_FIND_ALL_USERS, API_KEY, getRequestUrl, IS_PROD, PROD_API_KEY,} from './constants';
import md5 from "md5";

/**
 * Parses the query string from the URL.
 * @param name String name of the query param to parse
 * @param url String url to parse from
 * @returns {*}
 */
export const queryString = (name = null, url = window.location.href) => {
    let question = url.indexOf("?");
    let hash = url.indexOf("#");
    if(hash=== -1 && question === -1) return {};
    if(hash === -1) hash = url.length;
    let query = question === -1 || hash === question+1 ? url.substring(hash) : url.substring(question + 1, hash);
    let result = {};
    query.split("&").forEach((part) => {
        if(!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        let eq = part.indexOf("=");
        let key = eq > -1 ? part.substr(0,eq) : part;
        let val = eq > -1 ? decodeURIComponent(part.substr(eq+1)) : "";
        let from = key.indexOf("[");
        if(from === -1) {
            result[decodeURIComponent(key)] = val;
        } else {
            let to = key.indexOf("]",from);
            let index = decodeURIComponent(key.substring(from+1,to));
            key = decodeURIComponent(key.substring(0,from));
            if(!result[key]) result[key] = [];
            if(!index) result[key].push(val);
            else result[key][index] = val;
        }
    });

    if(name) {
        return result[name];
    }

    return result;
};

let currentStore;
// Object holding action types as keys and promises as values which need resolutions
const typeResolvers = {};

/**
 * Custom Redux middleware which wraps the action being dispatched
 * in a promise which can be resolved or rejected before continuing
 * @param store Object redux store
 * @returns {function(*): Function}
 */
export const dispatchProcessMiddleware = (store) => {
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
export const dispatchProcess = (requestAction, successActionType, failureActionType = undefined) => {
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

/**
 * Highlights the search query text that is found within an element to show users
 * exactly how their search found the results
 * @param query String the the query text the user has typed in
 * @param element String the full text to search for the query within. i.e. if the query is "ank" the full text might be "Banker"
 * and "ank" would be highlighted in the word "Banker"
 * @param green Boolean true if the highlighted color should be green and false otherwise (it will default to blue)
 */
export const matchSearchQuery = (query, element, green = false) => {
    if(query.length === 0) return <p className="mb-1 text-truncate muted">{ element }</p>;
    const idx = element.toUpperCase().search(query.toUpperCase());

    // The query appears within the element
    if(idx > -1) {
        const firstPart = element.substring(0, idx);
        const highlightedPart = element.substring(idx, idx + query.length);
        const endPart = element.substring(idx + query.length, element.length);
        return <p className="mb-1 text-truncate muted">{firstPart}<span
            className={green ? 'search-highlight-green' : 'search-highlight'}>{highlightedPart}</span>{endPart}</p>
    }

    // The query is not found simply return the full element
    return <p className="mb-1 text-truncate muted">{element}</p>
};

/**
 * Returns a users gravatar image and defaults to the normal
 * blank user image if none is found
 * @param email String users email address
 * @returns {string}
 */
export const getAvatar = (email, retro = false) => {
    if (retro) return `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}?d=identicon`;
    return `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}?d=${encodeURI('https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg')}`
};

/**
 * Makes a generic POST request to the API to retrieve, insert, or update
 * data and dispatches actions to redux to update application state based on the response.
 * @param body Object the body to be included in the post request
 * @param path String the API path to POST to. This should begin with a /
 * @param requestType String the redux dispatch type for making the API request
 * @param successType String the redux dispatch type when the request is successful
 * @param failureType String the redux dispatch type when the request has failed.
 * @param dispatch Function redux dispatch function
 * @param getState function returns the current state of the application as an object from the redux store
 * @param debug Boolean true if we should print the http response and false otherwise. Defaults to false
 * @returns {Promise<*|Promise<any>|undefined>}
 */
export const post = async (body, path, requestType, successType, failureType, dispatch, getState, debug = true) => {
    //If we don't need redux for the action we can just skip the dispatch by setting the actions to null
    let doDispatch = true;
    if (isNil(requestType) || isNil(successType) || isNil(failureType)) doDispatch = false;

    doDispatch &&
    dispatch({
        type: requestType,
        payload: body // Sets isFetching to true (useful for unit testing redux)
    });

    try {
        const params = {
            method: 'POST',
            headers: {
                Authorization: getState().auth.user.jwtToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY,
            },
            body: JSON.stringify(body),
        };

        const response = await (await fetch(getRequestUrl(path), params)).json();
        debug && console.log('[DEBUG] Post Response: ', response);

        return new Promise((resolve, reject) => {
            if (response.statusCode === 200) {
                doDispatch &&
                dispatch({
                    type: successType,
                    payload: response,
                });

                resolve(response);
            } else if (response.statusCode > 200 || typeof response.statusCode === 'undefined') {
                // An error occurred
                doDispatch &&
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(response)}`}
                });

                reject(response);
            }
        });
    } catch(err) {
        Log.error('[ERROR] Error receiving response from API', err);
        doDispatch &&
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};

/**
 * Gets data about the user's videos including: scrub duration, the next video in the queue,
 * @param username String the user's username to retrieve the user profile for
 * @param token Authorization token used to authenticate the user with the API
 * @returns {Promise<void>}
 */
export const getVideos = async (username, token) => {
    const params = {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY
        },
        // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
        body: JSON.stringify({username}),
    };

    try {
        return await (await fetch(getRequestUrl(API_FIND_ALL_USERS), params)).json();
    } catch(err) {
        Log.error('Failed to retrieve videos from API...', err);
    }
};
