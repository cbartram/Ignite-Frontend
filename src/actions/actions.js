/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import {getVideos, sendVideoData, storeQuiz } from '../util';


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
 * @param email String the email of the user to retrieve videos, billing and quiz data for
 * @returns {Function}
 */
export const fetchVideos = email => async dispatch => {
    dispatch({
        type: constants.REQUEST_VIDEOS,
        payload: true // Sets isFetching to true (useful for unit testing redux)
    });

    const response = await getVideos(email);

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
    } else if(response.status > 200 || typeof response.status === 'undefined') {
        // An error occurred
        dispatch({
            type: constants.VIDEOS_FAILURE,
            payload: { message: `Failed to retrieve billing/video data from API: ${JSON.stringify(response)}`}
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
 * @param videoName String video's name
 * @returns {Function}
 */
export const updateActiveVideo = (videoName) => dispatch => {
  dispatch({
      type: constants.UPDATE_ACTIVE_VIDEO,
      payload: videoName
  })
};

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const ping = (payload) => async dispatch => {
    dispatch({
        type: constants.PING_REQUEST,
        payload: true // Sets isFetching to true (useful for unit testing redux)
    });

    const response = await sendVideoData(payload);

    if(response.status === 200) {
        // Dispatch information about the users video progress
        dispatch({
            type: constants.PING_RESPONSE_SUCCESS,
            payload: response.body.videos, // Must be an array of chapter objects
        });
    } else if(response.status > 200 || typeof response.status === 'undefined') {
        // An error occurred
        dispatch({
            type: constants.PING_RESPONSE_FAILURE,
            payload: { message: `Failed to retrieve billing data from API: ${JSON.stringify(response)}`}
        });
    }
};

/**
 * Retrieves billing information from the API and stores it in redux.
 * @param email String the users email to retrieve billing details
 * @returns {Function}
 */
export const fetchBilling = email => async dispatch => {
    dispatch({
        type: constants.REQUEST_BILLING,
        payload: true // Sets isFetching to true (useful for unit testing redux)
    });

    const response = await getVideos(email);

    if(response.status === 200) {
        // Dispatch information about billing
        dispatch({
            type: constants.BILLING_SUCCESS,
            payload: response.body.user,
        });
    } else if(response.status > 200 || typeof response.status === 'undefined') {
        // An error occurred
        dispatch({
            type: constants.BILLING_FAILURE,
            payload: { message: `Failed to retrieve billing data from API: ${JSON.stringify(response)}`}
        });
    }
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
 * @param email String the users email address
 * @param quiz Object the quiz object to grade.
 * @returns {Function}
 */
export const submitQuiz = (email, quiz) => async dispatch => {
    dispatch({
        type: constants.SUBMIT_QUIZ_REQUEST,
        payload: true,
    });

    const response = await storeQuiz(email, quiz);

    if(response.status === 200) {
        // Dispatch information about billing
        dispatch({
            type: constants.UPDATE_QUIZ,
            payload: response.body.quiz,
        });
    } else if(response.status > 200 || typeof response.status === 'undefined') {
        // An error occurred
        dispatch({
            type: constants.SUBMIT_QUIZ_FAILURE,
            payload: { message: `Failed to grade the quiz: ${JSON.stringify(response)}`}
        });
    }
};


/**
 * Dispatches an action updating redux store that
 * something has gone wrong retrieving the billing data from DynamoDB/API
 * @param code String error code
 * @param message String the error message to be displayed
 * @returns {Function}
 */
export const billingFailure = (code, message) => dispatch => {
  dispatch({
      type: constants.BILLING_FAILURE,
      payload: {
          code,
          message
      }
  });
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
