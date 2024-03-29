import findIndex from 'lodash/findIndex';
import {
    QUESTION_FIND_POSTS_ERROR,
    CREATE_ANSWER_REQUEST,
    CREATE_ANSWER_SUCCESS,
    CREATE_ANSWER_FAILURE,
    CREATE_QUESTION_REQUEST,
    FIND_QUESTION_REQUEST,
    QUESTION_CREATE_RESPONSE_SUCCESS,
    QUESTION_CREATE_RESPONSE_FAILURE,
    QUESTION_FIND_POSTS_SUCCESS, UPDATE_POST_REQUEST, UPDATE_POST_FAILURE, UPDATE_POST_SUCCESS
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
        case UPDATE_POST_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case UPDATE_POST_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case UPDATE_POST_SUCCESS: {
            // Find the index where the answers question id matches the sort id of the question (aka find the question this answer belongs too)
            const idx = findIndex(state.questions[action.payload.result.pid], ({ sid }) => sid === action.payload.result.question_id);
            // find the index in the answers where our payload answerId matches their answer id
            const answerIdx = findIndex(state.questions[action.payload.result.pid][idx].answers, ({sid}) => sid === action.payload.result.sid);
            return {
                ...state,
                questions: {
                    ...state.questions,
                    [action.payload.result.pid]: state.questions[action.payload.result.pid].map((q, i) => {
                        if(i === idx) {
                            // We want to replace our answer with their answer
                            return {
                                ...q,
                                // Also update the correct answer in the array
                                answers: q.answers.map((a, aIdx) => {
                                    if(aIdx === answerIdx)
                                        return action.payload.result;
                                    return a;
                                })
                            };
                        }
                        return q;
                    })
                }
            }
        }
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
                    [action.payload.result.pid]: [action.payload.result, ...state.questions[action.payload.result.pid]]
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
        case CREATE_ANSWER_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case CREATE_ANSWER_SUCCESS:
            // Find the index where the answers question id matches the sort id of the question (aka find the question this answer belongs too)
            const idx = findIndex(state.questions[action.payload.result.pid], ({ sid }) => sid === action.payload.result.question_id);
            return {
                ...state,
                isFetching: false,
                questions: {
                    ...state.questions,
                    // Return a new array of all the questions with the added answer to 1 of the questions
                    [action.payload.result.pid]: state.questions[action.payload.result.pid].map((q, i) => {
                            if(i === idx)
                                return {
                                    ...q,
                                    answers: [action.payload.result, ...q.answers]
                                };
                            return q;
                        })
                },
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
