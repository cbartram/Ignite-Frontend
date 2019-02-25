import * as constants from '../constants';
/**
 * This is the Quiz reducer which handles updating state to reflect the user's current
 * quizz as well as associated data
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.QUIZZES_SUCCESS:
            return {
                ...state,
                quizList: action.payload, // Should be an [] of quiz objects
                isFetching: false,
            };
        default:
            return {
                ...state
            }
    }
}
