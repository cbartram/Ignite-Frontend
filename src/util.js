/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import Log from './Log';

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
            'x-api-key': 'pgS8gGvkv53xFg4BdgECn38C4CDNZXKj8EqFtQdW'
        },
        // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
        body: JSON.stringify({
            headers: {},
            method: 'POST',
            path: '/users/find',
            parameters: {}, // Query params
            body: { email }
        }),
    };

    try {
        return await (await fetch('https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Development/users/find', params)).json();
    } catch(err) {
        Log.error('Failed to retrieve videos from API...', err);
    }
};
