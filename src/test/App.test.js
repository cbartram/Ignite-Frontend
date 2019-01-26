import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from '../reducers/rootReducer';
import * as constants from '../constants';
import thunk from 'redux-thunk';
import { BrowserRouter  }from 'react-router-dom';

import Login from '../components/Login/Login'
import App from '../App';
import Navbar from '../components/Navbar/Navbar';
import Router from '../components/Router/Router';
import NotFound from '../components/NotFound/NotFound';
import Container from '../components/Container/Container';
import Watch from '../components/Watch/Watch';
import ResetPassword from '../components/ResetPassword/ResetPassword';
import Pricing from '../components/Pricing/Pricing';
import PaymentModal from '../components/PaymentModal/PaymentModal';
import Footer from '../components/Footer/Footer';
import Card from '../components/Card/Card';
import Alert from '../components/Alert/Alert';

// Create store used throughout the unit tests
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk)
));

it('<App /> Component renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('<Container /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Container />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Login /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Navbar /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Router /> (Custom) Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <Router/>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<NotFound /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
              <NotFound />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Watch /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Watch />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<ResetPassword /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <ResetPassword />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Pricing /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Pricing/>
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<PaymentModal /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <PaymentModal />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Footer /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Card /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Card />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Alert /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Alert />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});
