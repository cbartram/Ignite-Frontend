/**
 * This file defines actions which trigger switch statements in the reducer
 */
import _ from 'lodash';
import * as constants from '../constants';
import Log from '../Log';
import {getVideos, post,} from '../util';

/**
 * Updates a users attributes within redux
 * Note: This should only be used after the attributes have been successfully updated in Cognito in order to keep
 * them in sync.
 * @param payload Object Items to update { ['custom:first_name'] : 'Foo'...}
 * @returns {Function}
 */
export const updateUserAttributes = (payload) => dispatch => {
    dispatch({
        type: constants.UPDATE_USER_ATTRIBUTES,
        payload
    });
};


/**
 * This is used to update the isFetching property on the videos reducer
 * without actually modifying any type of video data. Its used when we only want the
 * loading icons on the frontend and this basically shuts them off.
 * @returns {Function}
 */
export const videosFetched = () => dispatch => {
    dispatch({
        type: constants.VIDEOS_FETCHED,
    })
};

/**
 * Updates the store to notify the user that the request has been sent and the data is loading.
 * @returns {Function}
 */
export const loginRequest = (payload = true) => dispatch => {
    dispatch({
        type: constants.LOGIN_REQUEST,
        payload
    });
};

/**
 * Updates the store to hide any outstanding error messages that are no longer needed.
 * @returns {Function}
 */
export const hideErrors = () => dispatch => {
    dispatch({
        type: constants.HIDE_ERRORS,
    });
};

/**
 * The login action updated the user state when a login item has occurred
 * and also validates if it was successful or not
 * @param payload Object AWS Cognito Login Success object
 * @returns {Function}
 */
export const loginSuccess = (payload) => dispatch => {
    dispatch({
        type: constants.LOGIN_SUCCESS,
        payload
    });
};

/**
 * Updates the redux store when a user has failed to authenticate usually for a bad username or password
 * combination
 * @param payload Object AWS Cognito Error object describing the issue
 * @returns {Function}
 */
export const loginFailure = payload => dispatch => {
    dispatch({
        type: constants.LOGIN_FAILURE,
        payload
    });
};

/**
 * Handles making the Async API call to retrieve the videos, quiz data and billing information for the authenticated user.
 * It will dispatch a success or failure event depending on the status of the API call.
 * Note: that this action updates the videos, quiz data and billing information for a user. If you want to just update the billing
 * information it would be better to use fetchBilling()
 * @param username String the username of the user to retrieve videos, billing, general info and quiz data for
 * @returns {Function}
 */
export const fetchVideos = username => async dispatch => {
    dispatch({
        type: constants.REQUEST_VIDEOS,
        payload: true // Sets isFetching to true (useful for unit testing redux)
    });

    try {
        const response = await getVideos(username);
        if(response.status === 200) {
            // Dispatch information about billing
            dispatch({
                type: constants.BILLING_SUCCESS,
                payload: response.body.user,
            });

            dispatch({
                type: constants.QUIZZES_SUCCESS,
                payload: response.body.user.quizzes
            });

            // Dispatch information about videos
            dispatch({
                type: constants.VIDEOS_SUCCESS,
                payload: response.body.user.videos,
            });

            if(!_.isUndefined(response.body.user.active_video))
                dispatch({
                    type: constants.UPDATE_ACTIVE_VIDEO,
                    payload: response.body.user.active_video,
                });

            // Remove Quizzes and videos from user (these are stored elsewhere in redux)
            const userMinusVideos = { ...response.body.user };
            delete userMinusVideos.videos;
            delete userMinusVideos.quizzes;

            dispatch({
                type: constants.UPDATE_USER_ATTRIBUTES,
                payload: userMinusVideos
            });
        } else if(response.status > 200 || _.isUndefined(response.status)) {
            // An error occurred
            dispatch({
                type: constants.VIDEOS_FAILURE,
                payload: { message: `Failed to retrieve billing/video data from API: ${JSON.stringify(response)}`}
            });
        }
    } catch(err) {
        Log.error('Failed to load user data from actions.js API call.', err);
        // An error occurred
        dispatch({
            type: constants.VIDEOS_FAILURE,
            payload: { message: `Failed to retrieve initial user data from API`, error: err }
        });
    }
};

/**
 * Synchronously dispatches an action which sets the isFetching property to true in the billing reducer
 * This will automatically trigger the loading page in most instances.
 * @returns {Function}
 */
export const requestVideos = () => dispatch => {
  dispatch({
      type: constants.REQUEST_VIDEOS,
      payload: true,
  });
};

/**
 * Updates the name of the video the user is currently
 * watching
 * @param video Object the video object to make active
 * @returns {Function}
 */
export const updateActiveVideo = (video) => dispatch => {
  dispatch({
      type: constants.UPDATE_ACTIVE_VIDEO,
      payload: video
  });
};

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const ping = (payload) => async dispatch => {
    await post(payload, constants.API_PING_VIDEO, constants.PING_REQUEST, constants.PING_RESPONSE_SUCCESS, constants.PING_RESPONSE_FAILURE, dispatch);
};

/**
 * Makes a POST request to the server to create a new question about a video
 * @param payload Object the payload includes the question title, video id, user who posted, and question contents.
 * @returns {Function}
 */
export const askQuestion = (payload) => async dispatch => {
    await post(payload, constants.API_POST_QUESTION, constants.CREATE_QUESTION_REQUEST, constants.QUESTION_CREATE_RESPONSE_SUCCESS, constants.QUESTION_CREATE_RESPONSE_FAILURE, dispatch);
};

/**
 * Retrieves a list of questions for a particular video
 * @param payload Object { video_id: '9.6' }
 * @returns {Function}
 */
export const findQuestions = (payload) => async dispatch => {
    await post({ video_id: payload }, constants.API_POST_FIND_QUESTIONS, constants.FIND_QUESTION_REQUEST, constants.QUESTION_FIND_POSTS_SUCCESS, constants.QUESTION_FIND_POSTS_ERROR, dispatch);
};

/**
 * Creates a new answer and ties it to a question being asked
 * @param payload Object
 * @returns {Function}
 */
export const answerQuestion = (payload) => async dispatch => {
    await post(payload, constants.API_ANSWER_CREATE, constants.CREATE_ANSWER_REQUEST, constants.CREATE_ANSWER_SUCCESS, constants.CREATE_ANSWER_FAILURE, dispatch);
};

/**
 * Creates a signed url for accessing protected video resources on amazon S3.
 * @param payload Object { resourceUrl, jwtToken }
 * @returns {Function}
 */
export const getSignedUrl = (payload) => async dispatch => {
    await post(payload, constants.API_FETCH_SIGNED_URL, constants.GET_SIGNED_URL_REQUEST, constants.GET_SIGNED_URL_SUCCESS, constants.GET_SIGNED_URL_FAILURE, dispatch);
};

/**
 * Handles processing a users payment given a valid Stripe
 * token representing the users credit card details
 * @param payload Object payload
 * @returns {Function}
 */
export const processPayment = (payload) => async dispatch => {
  await post(payload, constants.API_CREATE_SUBSCRIPTION, constants.CREATE_SUBSCRIPTION_REQUEST, constants.CREATE_SUBSCRIPTION_SUCCESS, constants.CREATE_SUBSCRIPTION_FAILURE, dispatch);
};

/**
 * Handles un subscribing a user from their current plan.
 * @param payload Object payload containing the cognito username, refreshToken and accessKey
 * @returns {Function}
 */
export const unsubscribe = (payload) => async dispatch => {
    await post(payload, constants.API_DELETE_SUBSCRIPTION, constants.UNSUBSCRIBE_REQUEST, constants.UNSUBSCRIBE_SUCCESS, constants.UNSUBSCRIBE_FAILURE, dispatch);
};

/**
 * Retrieves stripe events for a customer
 * @param payload Object payload containing the users stripe customer id
 * @returns {Function}
 */
export const getEvents = (payload) => async dispatch => {
    await post(payload, constants.API_FIND_EVENTS, constants.GET_EVENTS_REQUEST, constants.GET_EVENTS_SUCCESS, constants.GET_EVENTS_FAILURE, dispatch);
};

/**
 * Handles updating a question or answer with
 * additional information such as up-votes, down-votes or
 * if it is being accepted
 * @param payload
 * @returns {Function}
 */
export const updatePost = (payload) => async dispatch => {
    await post(payload, constants.API_POST_UPDATE, constants.UPDATE_POST_REQUEST, constants.UPDATE_POST_SUCCESS, constants.UPDATE_POST_FAILURE, dispatch);
};

/**
 * Updates billing details for a user synchronously (without making an additional API call)
 * @param payload Object user billing attributes.
 * @returns {Function}
 */
export const updateBillingSync = (payload) => dispatch => {
    dispatch({
        type: constants.BILLING_SUCCESS,
        payload,
    })
};


/**
 * Updates the videos list in redux synchronously (without making and additional API call)
 * @param videos Array List of video objects.
 * @returns {Function}
 */
export const updateVideosSync = (videos) => dispatch => {
    dispatch({
        type: constants.VIDEOS_SUCCESS,
        payload: videos,
    })
};

/**
 * Synchronously updates a completed quiz in redux.
 * This will eventually be retrieved from redux and sent to the server for storage.
 * @param quiz Object quiz object
 * @returns {Function}
 */
export const updateQuiz = (quiz) => dispatch => {
  dispatch({
      type: constants.UPDATE_QUIZ,
      payload: quiz,
  })
};


/**
 * Sends the quiz to the server for processing and storage before being returned to the client.
 * @param username String the users username given by cognito and prefixed with "user-<COGNITO_ID>"
 * @param quiz Object the quiz object to grade.
 * @returns {Function}
 */
export const submitQuiz = (username, quiz) => async dispatch => {
    await post({ username, quiz }, constants.API_SUBMIT_QUIZ, constants.SUBMIT_QUIZ_REQUEST, constants.UPDATE_QUIZ, constants.SUBMIT_QUIZ_FAILURE, dispatch);
};

/**
 * Handles removing the user's login session from the browser.
 * @returns {Function}
 */
export const logout = () => dispatch => {
    dispatch({
        type: constants.LOGOUT,
        payload: {} // We don't need any information to update the logout state
    });
};
