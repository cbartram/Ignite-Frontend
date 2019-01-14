import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Container from "./components/Container/Container";
import { Link } from 'react-router-dom'

const mapStateToProps = state => ({
   auth: state.auth,
});

class App extends Component {
  render() {
    return (
      <Container>
          <div className="d-flex flex-column justify-content-center align-items-center">
              <h1>Welcome to Ignite!</h1>
              {/* Render the Login form if the user is logged in */}
              {
                  this.props.auth.user === null ?
                  <div>
                      <Link to="/login">
                          <button className="btn btn-primary mr-2">
                            Login <i className="fas fa-sign-in-alt" />
                          </button>
                      </Link>
                      <Link to="/signup">
                          <button className="btn btn-secondary">
                              Sign Up <i className="fas fa-plus" />
                          </button>
                      </Link>
                  </div> :
                  <p>Welcome thanks for logging in!</p>
              }
          </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(App);
