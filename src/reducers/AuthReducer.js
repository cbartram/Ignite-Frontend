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
            return {
                ...state,
                isFetching: action.payload,
            };
        case constants.LOGIN_SUCCESS:
            // Strangely the object is different for signup vs sign in from Cognito
            // This reducer straightens it out for our application to use a single coherent user object
            if(typeof action.payload.signInUserSession === 'undefined') {
                return {
                    ...state,
                    isAuthenticated: true,
                    isFetching: false,
                    user: action.payload.idToken.payload,
                    error: null
                };
            } else {
                return {
                    ...state,
                    isAuthenticated: true,
                    isFetching: false,
                    user: action.payload.signInUserSession.idToken.payload,
                    error: null
                }
            }
        case constants.LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                user: null,
                error: action.payload,
            };
        case constants.HIDE_ERRORS: {
            return {
                ...state,
                error: null,
            }
        }
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
