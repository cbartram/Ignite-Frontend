/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';


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
        type: constants.LOGIN_REQUEST,
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
 * Handles removing the user's login session from the browser.
 * @returns {Function}
 */
export const logout = () => dispatch => {
    dispatch({
        type: constants.LOGOUT,
        payload: {} // We don't need any information to update the logout state
    });
};