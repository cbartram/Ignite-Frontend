/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import Log from './Log';
import {
    IS_PROD,
    API_KEY,
    PROD_API_KEY,
    API_FIND_ALL_USERS,
    API_PING_VIDEO,
    API_SEND_EMAIL,
    getRequestUrl, API_SUBMIT_QUIZ,
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
       if(typeof values[keyId] !== 'undefined') {
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
 * Gets data about the user's videos including: scrub duration, the next video in the queue,
 * @param email String the user's email to retrieve videos from
 * @returns {Promise<void>}
 */
export const getVideos = async (email) => {
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
            body: { email }
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
