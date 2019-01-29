import * as constants from '../constants';
/**
 * This is the Video reducer which handles updating state to reflect the user's current
 * videos as well as associated data like which video comes next.
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
                videoList: [...action.payload],
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
