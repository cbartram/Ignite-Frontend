import {
    QUESTION_FIND_POSTS_ERROR,
    FIND_ANSWER_REQUEST,
    FIND_ANSWER_SUCCESS,
    FIND_ANSWER_FAILURE,
    CREATE_ANSWER_REQUEST,
    CREATE_ANSWER_SUCCESS,
    CREATE_ANSWER_FAILURE,
    CREATE_QUESTION_REQUEST,
    FIND_QUESTION_REQUEST,
    QUESTION_CREATE_RESPONSE_SUCCESS,
    QUESTION_CREATE_RESPONSE_FAILURE,
    QUESTION_FIND_POSTS_SUCCESS
} from "../constants";


/**
 * This is the Posts reducer which handles updating state to reflect when a user posts a question or receives an
 * answer to one of their questions.
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case CREATE_QUESTION_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case FIND_QUESTION_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
                questions: {
                    [action.payload.video_id]: []
                },
            };
        case QUESTION_CREATE_RESPONSE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                questions: {
                    [action.payload.result.video_id]: [action.payload.result, ...state.questions[action.payload.result.video_id]]
                }
            };
        case QUESTION_CREATE_RESPONSE_FAILURE:
            return {
              ...state,
              isFetching: false,
              error: action.payload,
            };
        case QUESTION_FIND_POSTS_SUCCESS:
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
        case FIND_ANSWER_REQUEST:
            return {
                ...state,
                isFetching: true,
                answers: {
                    [action.payload.video_id]: []
                }
            };
        case FIND_ANSWER_SUCCESS:
            console.log(action.payload.result);
            return {
               ...state,
                isFetching: false,
                answers: {
                    [action.payload.result.video_id]: action.payload.result.Items
                }
            };
        case FIND_ANSWER_FAILURE:
            return {
                ...state,
                error: action.payload,
                isFetching: false,
            };

        case CREATE_ANSWER_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case CREATE_ANSWER_SUCCESS:
            console.log(action.payload.result);
            return {
                ...state,
                answers: {
                    [action.payload.result.question_id]: [action.payload.result, ...state.answers[action.payload.result.question_id]]
                }
            };
        case CREATE_ANSWER_FAILURE:
            return {
                ...state,
                error: action.payload,
                isFetching: false,
            };
        default:
            return {
                ...state
            }
    }
}
