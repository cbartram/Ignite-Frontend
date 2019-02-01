/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import Log from './Log';
import {API_KEY, getRequestUrl, API_FIND_ALL_USERS, IS_PROD, PROD_API_KEY} from './constants';

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
