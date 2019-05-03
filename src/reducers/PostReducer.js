import * as constants from '../constants';
import _ from 'lodash';
import {QUESTION_FIND_POSTS_ERROR} from "../constants";

/**
 * This is the Posts reducer which handles updating state to reflect when a user posts a question or receives an
 * answer to one of their questions.
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.CREATE_QUESTION_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case constants.FIND_QUESTION_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
                questions: {
                    [action.payload.video_id]: []
                },
            };
        case constants.QUESTION_CREATE_RESPONSE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                questions: {
                    [action.payload.result.video_id]: [action.payload.result, ...state.questions[action.payload.result.video_id]]
                }
            };
        case constants.QUESTION_CREATE_RESPONSE_FAILURE:
            return {
              ...state,
              isFetching: false,
              error: action.payload,
            };
        case constants.QUESTION_FIND_POSTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                questions: {
                    [action.payload.result.video_id]: action.payload.result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                }
            };
        case QUESTION_FIND_POSTS_ERROR:
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
