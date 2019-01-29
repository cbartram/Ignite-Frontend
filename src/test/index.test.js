import { expect } from 'chai';
import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from '../reducers/rootReducer';
import * as constants from '../constants';
import thunk from 'redux-thunk';
import {
    loginSuccess,
    loginFailure,
    logout,
    updateUserAttributes,
    hideErrors,
} from '../actions/actions';

describe('Redux Unit Tests', () => {

   it('Updates state for LOGIN_SUCCESS action', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        const updatedState = {
            auth:
                {
                    isAuthenticated: true,
                    isFetching: false,
                    user: {
                        username: 'Foo',
                        jwtToken: 'abc',
                        refreshToken: 'refreshabc',
                        deviceKey: 'devicekey'
                    },
                    error: null },
            videos: {},
            billing: {},
        };

        const payload = {
            deviceKey: 'devicekey',
            signInUserSession: {
                idToken: {
                    payload: {
                        username: 'Foo'
                    },
                    jwtToken: 'abc',
                },
                refreshToken: {
                    token: 'refreshabc'
                }
            }
        };

        // Update the state with an action
       store.dispatch(loginSuccess(payload));
       expect(store.getState()).to.be.a('object').that.deep.equals(updatedState);
       done();
   });

   it('Updates state for LOGIN_FAILURE action', done => {
       const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
       const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
           applyMiddleware(thunk)
       ));

       expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
       const updatedState = {
           auth: {
               error: {
                   message: 'Bad unit test'
               },
               isAuthenticated: false,
               isFetching: false,
               user: null
           },
           billing: {},
           videos: {}
       };
       // Update the state with an action
       store.dispatch(loginFailure({ message: 'Bad unit test' }));
       expect(store.getState()).to.be.a('object').that.deep.equals(updatedState);
       done();
   });

   it('Updates state for LOGOUT action', done => {
       const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
       const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
           applyMiddleware(thunk)
       ));

       expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
       store.dispatch(logout());
       expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE); // Nothing should change
       done();
   });

    it('Updates state for HIDE_ERRORS action', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        store.dispatch(loginFailure({ message: 'Bad unit test'}));
        store.dispatch(hideErrors());
        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE); // Nothing should change
        done();
    });

    it('Update state for UPDATE_USER_ATTRIBUTES action', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        const updatedState = {
            auth: {
                error: null,
                isAuthenticated: false,
                isFetching: false,
                user: {
                    firstName: 'Foo',
                    lastName: 'bar'
                }
            },
            billing: {},
            videos: {}
        };

        const payload = {
            firstName: 'Foo',
            lastName: 'bar'
        };

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        store.dispatch(updateUserAttributes(payload));
        expect(store.getState()).to.be.a('object').that.deep.equals(updatedState); // Nothing should change
        done();
    });

    it('Updates state when the VIDEO_FAILURE action is dispatched', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        const updatedState = {
            auth: {
                    isAuthenticated: false,
                    isFetching: false,
                    user: null,
                    error: null
                },
            billing: {},
            videos: {
                    isFetching: false,
                    error: {
                        message: 'Failed to retrieve videos from API'
                    }
                }
        };

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        store.dispatch({
            type: constants.VIDEOS_FAILURE,
            payload: { message: 'Failed to retrieve videos from API' }
        });
        expect(store.getState()).to.be.a('object').that.deep.equals(updatedState);
        done();
    });

    it('Updates state when the VIDEOS_SUCCESS action is dispatched', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        const updatedState = {
            auth: {
                isAuthenticated: false,
                isFetching: false,
                user: null,
                error: null
            },
            billing: {},
            videos: {
                videoList: [{
                    message: 'hi'
                }, {
                    message: 'test'
                }],
                isFetching: false,
                error: null
            }
        };

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        store.dispatch({
            type: constants.VIDEOS_SUCCESS,
            payload: [{ message: 'hi' }, { message: 'test' } ]
        });
        expect(store.getState()).to.be.a('object').that.deep.equals(updatedState);
        done();
    });

    it('Updates state when the BILLING_SUCCESS action is dispatched', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        const updatedState = {
            auth: {
                isAuthenticated: false,
                isFetching: false,
                user: null,
                error: null
            },
            videos: {},
            billing: {
                error: null,
                isFetching:false,
                customer_id: 1,
                next_invoice_amount: 2000,
                invoice_status: 'success',
                payment_card_type: 'Visa',
                payment_last_four: 4242,
                subscription_active: 'active',
                next_invoice_date: 152938177,
                invoice_date: 152938127,
                invoice_amount: 2000,
                premium: 'true',
                plan: 'Basic Plan',
                plan_id: 'pl_x1jdha8s7ahD',
                subscription_id: 'sub_asdjkJA9sd7A'
            }
        };

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        store.dispatch({
            type: constants.BILLING_SUCCESS,
            payload: {
                customer_id: 1,
                next_invoice_amount: 2000,
                invoice_status: 'success',
                payment_card_type: 'Visa',
                payment_last_four: 4242,
                subscription_active: 'active',
                next_invoice_date: 152938177,
                invoice_date: 152938127,
                invoice_amount: 2000,
                premium: 'true',
                plan: 'Basic Plan',
                plan_id: 'pl_x1jdha8s7ahD',
                subscription_id: 'sub_asdjkJA9sd7A'
            }
        });
        expect(store.getState()).to.be.a('object').that.deep.equals(updatedState);
        done();
    });

});
