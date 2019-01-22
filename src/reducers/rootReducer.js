import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import videoReducer from './VideoReducer';

export default combineReducers({
    auth: authReducer,
    videos: videoReducer,
});
