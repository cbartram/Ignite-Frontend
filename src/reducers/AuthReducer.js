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
        case constants.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
        case constants.LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };
        default:
            return state
    }
}