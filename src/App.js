import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
  simpleAction
} from './actions/simpleAction';
import Container from "./components/Container/Container";
import { Link } from 'react-router-dom'

const mapStateToProps = state => ({
    data: state.testReducer.result
});

const mapDispatchToProps = dispatch => ({
   update: (data) => dispatch(simpleAction(data))
});

class App extends Component {
  render() {
    return (
      <Container>
          <div className="d-flex flex-column justify-content-center align-items-center">
              <h1>Welcome to Ignite!</h1>
              <Link to="/login">
                  <button className="btn btn-primary mb-3">
                    Login <i className="fas fa-sign-in-alt" />
                  </button>
              </Link>
              <Link to="/register">
                  <button className="btn btn-secondary">
                      Sign Up <i className="fas fa-plus" />
                  </button>
              </Link>
          </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
