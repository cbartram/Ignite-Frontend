import * as constants from '../constants';
import _ from 'lodash';
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
        case constants.UPDATE_QUIZ:
            let quizIndex = _.findIndex(state.quizList, quiz => quiz.id === action.payload.id);
            const quizListCopy = [...state.quizList];
            quizListCopy[quizIndex] = action.payload;
            return {
                ...state,
                quizList: quizListCopy
            };
        case constants.SUBMIT_QUIZ_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case constants.SUBMIT_QUIZ_FAILURE: {
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            }
        }
        default:
            return {
                ...state
            }
    }
}
