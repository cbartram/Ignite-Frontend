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
            videos: {}
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
           videos: {}
       };
       // Update the state with an action
       store.dispatch(loginFailure({ message: 'Bad unit test' }));
       console.log(store.getState());
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

});
