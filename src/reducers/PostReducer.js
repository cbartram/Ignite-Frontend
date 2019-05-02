import * as constants from '../constants';
import _ from 'lodash';

/**
 * This is the Posts reducer which handles updating state to reflect when a user posts a question or receives an
 * answer to one of their questions.
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.QUESTION_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
                questions: {}, // Default questions to {} it changes for each video the user loads
            };
        case constants.QUESTION_CREATE_RESPONSE_SUCCESS:
            // Get current questions for the video and chapter organied by video id (chapter.video)
            if(_.isUndefined(state[action.payload.result.video_id])) {
                // If it doesnt exist create the array
                return {
                    ...state,
                    isFetching: false,
                    [action.payload.result.video_id]: [action.payload.result]
                };
            } else {
                // If another question is created already append to the array
                return {
                    ...state,
                    isFetching: false,
                    [action.payload.result.video_id]: [...state[action.payload.result.video_id], action.payload.result]
                };
            }
        case constants.QUESTION_CREATE_RESPONSE_FAILURE:
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
