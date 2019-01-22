/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import {getVideos} from "../util";


/**
 * Updates a users attributes within redux
 * Note: This should only be used after the attributes have been successfully updated in Cognito in order to keep
 * them in sync.
 * @param payload Object Items to update { ['custom:first_name'] : 'Foo'...}
 * @returns {Function}
 */
export const updateUserAttributes = (payload) => dispatch => {
    dispatch({
        type: constants.UPDATE_USER_ATTRIBUTES,
        payload
    });
};

/**
 * Updates the store to notify the user that the request has been sent and the data is loading.
 * @returns {Function}
 */
export const loginRequest = (payload = true) => dispatch => {
    dispatch({
        type: constants.LOGIN_REQUEST,
        payload
    });
};

/**
 * Updates the store to hide any outstanding error messages that are no longer needed.
 * @returns {Function}
 */
export const hideErrors = () => dispatch => {
    dispatch({
        type: constants.HIDE_ERRORS,
    });
};

/**
 * The login action updated the user state when a login item has occurred
 * and also validates if it was successful or not
 * @param payload Object AWS Cognito Login Success object
 * @returns {Function}
 */
export const loginSuccess = (payload) => dispatch => {
    dispatch({
        type: constants.LOGIN_SUCCESS,
        payload
    });
};

/**
 * Updates the redux store when a user has failed to authenticate usually for a bad username or password
 * combination
 * @param payload Object AWS Cognito Error object describing the issue
 * @returns {Function}
 */
export const loginFailure = payload => dispatch => {
    dispatch({
        type: constants.LOGIN_FAILURE,
        payload
    });
};

/**
 * Handles making the Async API call to retrieve the videos. It will dispatch a success or failure event
 * depending on the status of the API call.
 * @param email String the email of the user to retrieve videos for
 * @returns {Function}
 */
export const fetchVideos = email => async dispatch => {
    dispatch({
        type: constants.REQUEST_VIDEOS,
        payload: true // Sets isFetching to true
    });

    const videos = await getVideos(email);

    if(videos.status === 200) {
        dispatch({
            type: constants.VIDEOS_SUCCESS,
            payload: videos,
        });
    } else if(videos.status > 200 || typeof videos.status === 'undefined') {
        // An error occurred
        dispatch({
            type: constants.VIDEOS_FAILURE,
            payload: 'Failed to retrieve videos from the API.'
        });
    }
};

/**
 * Handles removing the user's login session from the browser.
 * @returns {Function}
 */
export const logout = () => dispatch => {
    dispatch({
        type: constants.LOGOUT,
        payload: {} // We don't need any information to update the logout state
    });
};
