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
                    user: {
                        ...action.payload.idToken.payload,
                        jwtToken: action.payload.idToken.jwtToken,
                        refreshToken: action.payload.refreshToken.token,
                        deviceKey: action.payload.accessToken.payload.device_key,
                    },
                    error: null
                };
            } else {
                return {
                    ...state,
                    isAuthenticated: true,
                    isFetching: false,
                    user: {
                        ...action.payload.signInUserSession.idToken.payload,
                        jwtToken: action.payload.signInUserSession.idToken.jwtToken,
                        refreshToken: action.payload.signInUserSession.refreshToken.token,
                        deviceKey: action.payload.deviceKey,
                    },
                    error: null
                }
            }
        case constants.UPDATE_USER_ATTRIBUTES:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            };
        case constants.CREATE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case constants.CREATE_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case constants.CREATE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload.user,
                    'custom:at_period_end': 'false',
                    'custom:unsub_timestamp': 'null'
                }
            };
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
