/**
 * This file defines constants used throughout the frontend portion of the application.
 * Constants as the name suggests are constant and never change regardless of state changes.
 * @type {{}}
 */
export const INITIAL_STATE = {
    auth: {
        isAuthenticated: false,
        isFetching: false,
        user: null,
        error: null,
    },
    videos: {}
};

// Redux Action/Reducer Constants
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const HIDE_ERRORS = 'HIDE_ERRORS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER_ATTRIBUTES = 'UPDATE_USER_ATTRIBUTES';
export const REQUEST_VIDEOS = 'REQUEST_VIDEOS';
export const VIDEOS_SUCCESS = 'VIDEOS_SUCCESS';
export const VIDEOS_FAILURE = 'VIDEOS_FAILURE';
