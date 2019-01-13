/**
 * This is an example reducer to show that redux is implemented in the Application
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case 'SIMPLE_ACTION':
            return {
                ...state,
                result: action.payload
            };
        default:
            return state
    }
}