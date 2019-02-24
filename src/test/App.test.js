import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from '../reducers/rootReducer';
import * as constants from '../constants';
import thunk from 'redux-thunk';
import { BrowserRouter  }from 'react-router-dom';
import { updateActiveVideo, loginSuccess } from "../actions/actions";

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
import QuoteCard from "../components/QuoteCard/QuoteCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Legal from "../components/Legal/Legal";
import CookiePolicy from "../components/Legal/CookiePolicy";
import Terms from "../components/Legal/Terms";
import Support from "../components/Support/Support";
import FacebookButton from "../components/FacebookButton/FacebookButton";
import LoaderButton from '../components/LoaderButton/LoaderButton';
import Signup from "../components/Signup/Signup";
import Videos from "../components/Videos/Videos";
import Profile from "../components/Profile/Profile";
import withContainer from "../components/withContainer";

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
                <Alert type="success" id={19238} onDismiss={() => console.log('Dismissed')} message="Foo" title="Foo" />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<QuoteCard /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <QuoteCard />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Sidebar /> Component renders without crashing', () => {
    const div = document.createElement('div');
    store.dispatch(updateActiveVideo({ name: 'Foo'}));
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Legal /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Legal />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<CookiePolicy /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <CookiePolicy />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Terms /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Terms />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Support /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Support />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<FacebookButton /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <FacebookButton />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<LoaderButton /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <LoaderButton />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<ResetPassword /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <ResetPassword/>
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<SignUp /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Videos /> Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Videos />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('<Profile /> Component renders without crashing', () => {
    const div = document.createElement('div');
    const userData = {
        'custom:first_name': 'Foo',
        'custom:last_name': 'bar',
        refreshToken: {
            token: 'foo'
        },
        accessToken: {
            payload: {
                device_key: 'foo'
            }
        },
        idToken: {
            jwtToken: 'foo',
            payload: {
                foo: 'bar',
            }
        }
    };
    store.dispatch(loginSuccess(userData));
    store.dispatch(updateActiveVideo({
        description: 'Discover Flexbox and learn how it can help you create amazing page layout with minimal CSS code',
        chapter: 3,
        completed: false,
        started: false,
        length: '18:20',
        s3Name: 'Flexbox',
        name: 'Flexbox',
        scrubDuration: 0,
        sortKey: 4, }));

    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('withContainer() HOC renders a wrapped <Container /> component', () => {
    const div = document.createElement('div');
    const Item = withContainer(class foo extends React.Component { render() { return (<div />)}});

    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Item />
            </BrowserRouter>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});










