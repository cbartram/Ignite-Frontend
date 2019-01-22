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
        case constants.REQUEST_VIDEOS:
            return {
                ...state,
                isFetching: action.payload,
            };
        case constants.VIDEOS_SUCCESS:
            return {
                ...state,
                ...action.payload,
                isFetching: false,
                error: null,
            };
        case constants.VIDEOS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}
