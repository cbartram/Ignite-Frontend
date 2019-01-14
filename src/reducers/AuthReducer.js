import * as constants from '../constants';
/**
 * This is the Authentication reducer which handles updating state to reflect if a user is
 * logged in/logged out.
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.LOGIN_REQUEST:
            console.log('Starting the request');
            return {
                ...state,
                isFetching: true,
            };
        case constants.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                isFetching: false,
                user: action.payload,
                error: null
            };
        case constants.LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                user: null,
                error: action.payload,
            };
        case constants.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                user: null,
                error: null,
            };
        default:
            return {
                ...state
            }
    }
}