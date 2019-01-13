/**
 * This file defines actions which trigger switch statements in the reducer
 * to update the global store.
 * @returns {Function}
 */
export const simpleAction = (payload) => dispatch => {
    dispatch({
        type: 'SIMPLE_ACTION',
        payload
    })
};