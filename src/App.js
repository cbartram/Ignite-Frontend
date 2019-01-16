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

          <div className="row">
              {/* Intro Column*/}
              <div className="col-md-6">
                <span className="common-UppercaseTitle">
                    Welcome to Ignite
                </span>
              </div>
              {/* Visual Column */}
              <div className="col-md-6">
              </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
              <h1>Welcome to Ignite!</h1>
              {/* Render the Login form if the user is logged in */}
              {
                  this.props.auth.user === null ?
                  <div>
                      <Link to="/login">
                          <button className="common-Button mr-2">
                            Login <i className="fas fa-sign-in-alt" />
                          </button>
                      </Link>
                      <Link to="/signup">
                          <button className="common-Button common-Button--default">
                              Sign Up <i className="fas fa-plus" />
                          </button>
                      </Link>
                  </div> :
                  <p>Welcome thanks for logging in!</p>
              }
          </div>
          <div className="common-StripeGrid anchorBottom">
              <div className="backgroundContainer">
                  <div className="grid">
                      <div className="background" />
                  </div>
              </div>
              <div className="stripeContainer">
                  <div className="grid">
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />
                      <div className="stripe" />

                  </div>
              </div>
          </div>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(App);
