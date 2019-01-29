import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import videoReducer from './VideoReducer';
import billingReducer from './BillingReducer';
export default combineReducers({
    auth: authReducer,
    videos: videoReducer,
    billing: billingReducer,
});
