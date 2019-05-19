/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import _ from 'lodash';
import Log from './Log';
import {
    IS_PROD,
    API_KEY,
    PROD_API_KEY,
    API_FIND_ALL_USERS,
    API_PING_VIDEO,
    API_SEND_EMAIL,
    API_POST_QUESTION,
    getRequestUrl, API_SUBMIT_QUIZ, API_POST_FIND_QUESTIONS, default as constants,
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
export const post = async (body, path, requestType, successType, failureType, dispatch) => {
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
 * Updates the keys in the local storage cache so that
 * they match the updated values in AWS Cognito.
 * @param values Object the key of each property in this object must be one of the following values
 * [idToken, accessToken, refreshToken, deviceKey, deviceGroupKey, userData]
 * This object provides the new values that should replace each of the respective items in local storage.
 */
export const updateCache = (values) => {
    const keys = Object.keys(localStorage);
    keys.map(key => {
       let keyId = key.substring(key.lastIndexOf('.') + 1, key.length);

       // Only update what was provided in the values object nothing more nothing less
       if(!_.isUndefined(values[keyId])) {
           switch (keyId) {
               case 'accessToken':
                   localStorage.setItem(key, values['accessToken']);
                   break;
               case 'userData':
                   localStorage.setItem(key, values['userData']);
                   break;
               case 'deviceGroupKey':
                   localStorage.setItem(key, values['deviceGroupKey']);
                   break;
               case 'idToken':
                   localStorage.setItem(key, values['idToken']);
                   break;
               case 'deviceKey':
                   localStorage.setItem(key, values['deviceKey']);
                   break;
               case 'refreshToken':
                   localStorage.setItem(key, values['refreshToken']);
                   break;
               default:
                   break;
           }
       }
    });
};

/**
 * Handles submitting the quiz results to the server for grading and storage.
 * @param email String Users email address
 * @param quiz Object quiz object for processing
 * @returns {Promise<any>}
 */
export const storeQuiz = async (email, quiz) => {
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
            path: API_SUBMIT_QUIZ,
            parameters: {}, // Query params
            body: { email, quiz }
        }),
    };

    try {
        return await (await fetch(getRequestUrl(API_SUBMIT_QUIZ), params)).json();
    } catch(err) {
        Log.error('Failed to store quiz results...', err);
    }
};

/**
 * Creates the fetch() call used to create a new forum question about a video
 * @param body Object the body of the request. This should include the user id, video id, title of
 * the post, and body of the post (not to be confused with the body of the request).
 * @returns {Promise<any>}
 */
export const postQuestion = async (body) => {
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
            path: API_POST_QUESTION,
            parameters: {}, // Query params
            body
        }),
    };

    try {
        return await (await fetch(getRequestUrl(API_POST_QUESTION), params)).json();
    } catch(err) {
        Log.error('Failed to post question...', err);
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
        body: JSON.stringify({
            headers: {},
            method: 'POST',
            path: API_FIND_ALL_USERS,
            parameters: {}, // Query params
            body: { username }
        }),
    };

    try {
        return await (await fetch(getRequestUrl(API_FIND_ALL_USERS), params)).json();
    } catch(err) {
        Log.error('Failed to retrieve videos from API...', err);
    }
};

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @param data Object video data to send
 * @returns {Function}
 */
export const sendVideoData = async (data) => {
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
            path: API_PING_VIDEO,
            parameters: {}, // Query params
            body: data,
        }),
    };

    try {
        return await (await fetch(getRequestUrl(API_PING_VIDEO), params)).json();
    } catch(err) {
        Log.error('Failed to ping video data from API...', err);
    }
};
