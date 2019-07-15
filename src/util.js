/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import React from 'react';
import Log from './Log';
import {
    API_FIND_ALL_USERS,
    API_KEY,
    API_POST_FIND_QUESTIONS,
    API_SEND_EMAIL,
    getRequestUrl,
    IS_PROD,
    PROD_API_KEY,
} from './constants';

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
 * Makes a generic POST request to the API to retrieve, insert, or update
 * data and dispatches actions to redux to update application state based on the response.
 * @param body Object the body to be included in the post request
 * @param path String the API path to POST to. This should begin with a /
 * @param requestType String the redux dispatch type for making the API request
 * @param successType String the redux dispatch type when the request is successful
 * @param failureType String the redux dispatch type when the request has failed.
 * @param dispatch Function redux dispatch function
 * @returns {Promise<*|Promise<any>|undefined>}
 */
export const post = async (body, path, requestType, successType, failureType, dispatch, debug = false) => {
    dispatch({
        type: requestType,
        payload: body // Sets isFetching to true (useful for unit testing redux)
    });

    try {
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY,
            },
            body: JSON.stringify({
                headers: {},
                method: 'POST',
                path,
                parameters: {},
                body
            }),
        };

        const response = await (await fetch(getRequestUrl(path), params)).json();

        debug && console.log('[DEBUG] Post Response: ', response);

        return new Promise((resolve, reject) => {
            if (response.status === 200) {
                dispatch({
                    type: successType,
                    payload: response.body,
                });

                resolve(response);
            } else if (response.status > 200 || typeof response.status === 'undefined') {
                // An error occurred
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(response)}`}
                });

                reject(response);
            }
        });
    } catch(err) {
        Log.error('[ERROR] Error receiving response from API', err);
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};

/**
 * Sends an API request to the backend to process and send an email
 * using AWS SES.
 * @param from String who this email is from (emails are sent using no-reply@ignitecode.net) but this is the users email
 * @param subject String the subject line of the email
 * @param message String the body/message of the email.
 */
export const sendEmail = async (from, subject = '', message = '') => {
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY
        },
        // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
        body: JSON.stringify({
            headers: {},
            method: 'POST',
            path: API_SEND_EMAIL,
            parameters: {}, // Query params
            body: {
                from,
                subject,
                message,
            }
        }),
    };

    try {
        return await (await fetch(getRequestUrl(API_SEND_EMAIL), params)).json();
    } catch(err) {
        Log.error('Failed to retrieve videos from API...', err);
    }
};

/**
 * Retrieves all questions for a video given the video_id
 * @param video_id String video id: should be videoChapter.videoNumber ex 9.6
 * @returns {Promise<any>}
 */
export const findQuestions = async (video_id) => {
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY,
        },
        body: JSON.stringify({
            headers: {},
            method: 'POST',
            path: API_POST_FIND_QUESTIONS,
            parameters: {},
            body: { video_id }
        }),
    };

    try {
        return await (await fetch(getRequestUrl(API_POST_FIND_QUESTIONS), params)).json();
    } catch(err) {
        Log.error('Failed to retrieve post questions...', err);
    }
};

/**
 * Gets data about the user's videos including: scrub duration, the next video in the queue,
 * @param username String the user's username to retrieve the user profile for
 * @returns {Promise<void>}
 */
export const getVideos = async (username) => {
    const params = {
        method: 'POST',
        headers: {
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
