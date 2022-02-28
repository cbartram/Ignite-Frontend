/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import Log from './Log';
import {
    API_KEY,
    API_FIND_ALL_USERS,
    IS_PROD,
    PROD_API_KEY,
    API_PING_VIDEO,
    getRequestUrl,
} from './constants';

/**
 * Gets data about the user's videos including: scrub duration, the next video in the queue,
 * @param email String the user's email to retrieve videos from
 * @param jwt JWT token representing a user who is signed into a session and authenticated.
 * @returns {Promise<void>}
 */
export const getVideos = async (email, jwt) => {
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
            'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY
        },
        // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
        body: JSON.stringify({
            headers: {},
            method: 'POST',
            path: API_FIND_ALL_USERS,
            parameters: {}, // Query params
            body: { username: email }
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
