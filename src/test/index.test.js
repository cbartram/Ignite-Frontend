import { expect } from 'chai';
import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from '../reducers/rootReducer';
import * as constants from '../constants';
import thunk from 'redux-thunk';
import {
    loginSuccess,
    loginFailure,
    logout,
} from '../actions/actions';

describe('Redux Unit Tests', () => {

   it('Updates state for LOGIN_SUCCESS action', done => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
            applyMiddleware(thunk)
        ));

        expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
        const updatedState = {
            auth: {
                error: null,
                isAuthenticated: true,
                user: {
                    username: 'Foo'
                }
            }
        };
        // Update the state with an action
       store.dispatch(loginSuccess({ username: 'Foo' }));
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
               user: null
           }
       };
       // Update the state with an action
       store.dispatch(loginFailure({ message: 'Bad unit test' }));
       expect(store.getState()).to.be.a('object').that.deep.equals(updatedState);
       done();
   });

   it('Update state for LOGOUT action', done => {
       const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
       const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
           applyMiddleware(thunk)
       ));

       expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE);
       store.dispatch(logout());
       expect(store.getState()).to.be.a('object').that.deep.equals(constants.INITIAL_STATE); // Nothing should change
       done();
   });

});