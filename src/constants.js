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
    videos: {},
    billing: {}
};

/**
 * Helper variable to determine if the App is in the production environment. This decides which API call to make.
 * @type {boolean} True if the application is running in prod and false otherwise.
 */
export const IS_PROD = window.location.hostname !== 'localhost' || process.env.REACT_APP_NODE_ENV === 'production';

/**
 * Helper function which determines the correct API to hit (prod,dev) and the correct region to use.
 * Note: this defaults to the east region if the REACT_APP_API_REGION is not declared.
 * @param endpointURI String URI of the endpoint requested starting with '/' and ending without a '/'
 * i.e. (/users/find)
 * @returns {string}
 */
export const getRequestUrl = (endpointURI) => {
  let url = '';

  // Attempt to use prod
  if(IS_PROD)
      url = `${PROD_URL}${endpointURI}`;
  else
      url = `${DEV_URL}${endpointURI}`;

  return url;
};

// API Parameters
export const API_FIND_ALL_USERS = '/users/find';
export const API_FETCH_SIGNED_URL = '/security/signed-url/create';
export const API_CREATE_SUBSCRIPTION = '/billing/subscription/create';

// Prod API Params
export const PROD_URL = 'https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Production';

// Dev API Params
export const DEV_URL = 'https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Development';

// Configuration Params
export const API_KEY = 'pgS8gGvkv53xFg4BdgECn38C4CDNZXKj8EqFtQdW';

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
export const BILLING_SUCCESS = 'BILLING_SUCCESS';
export const BILLING_FAILURE = 'BILLING_FAILURE';
