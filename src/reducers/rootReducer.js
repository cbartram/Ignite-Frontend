import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import videoReducer from './VideoReducer';
import billingReducer from './BillingReducer';
import quizReducer from './QuizReducer';

export default combineReducers({
    auth: authReducer,
    videos: videoReducer,
    quizzes: quizReducer,
    billing: billingReducer,
});
