import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from "./components/Container/Container";
import { Link } from 'react-router-dom'
import './App.css';

const mapStateToProps = state => ({
   auth: state.auth,
});

class App extends Component {
    render() {
    return (
      <Container noFooterMargin>
          <div className="header-hero">
              <div className="StripeBackground accelerated">
                  <div className="stripe s0" />
                  <div className="stripe s1" />
                  <div className="stripe s2" />
                  <div className="stripe s3" />
              </div>
              {/* Visual Bubbles Flow */}
              <div className="icon-container" />
          </div>
          <div className="d-flex flex-row justify-content-center">
              {/* Intro Column*/}
              <div className="col-md-8 offset-md-2">
                <span className="common-UppercaseTitle">
                    Welcome to Ignite
                </span>
                <h1 className="common-PageTitle">Learn to Code Quickly</h1>
                  <p className="common-IntroText">
                      Our course on full stack development will teach you all the core concepts necessary to have a firm
                      understanding of modern day development practices. We've designed a program that helps to accelerate
                      you through all the stages of software development from project planning to future maintenance.
                  </p>
              </div>
          </div>
          <section id="developers-section" className="py-4">
              <div className="row">
                  <div className="col-md-4 offset-md-3 col-sm-5 offset-sm-1 pl-3" id="flexible-learning">
                      <img src="https://stripe.com/img/v3/customers/section-icons/sharing.svg" width="66" height="66" alt="Network grid" />
                      <h2 className="common-UppercaseText mt-4">
                        Flexible Learning
                      </h2>
                      <p className="common-BodyText">
                          Learning a new skill doesn’t have to interrupt your busy schedule. Our on-demand videos and
                          interactive code challenges are there for you when you need them. Keep your day job while you
                          hone your development skills at your own pace.
                      </p>
                      <Link className="common-BodyText common-Link common-Link--arrow" to="/">
                          Learn about Ignite's products
                      </Link>
                  </div>
                  <div className="col-md-4 col-sm-5 pl-3">
                      <img src="https://stripe.com/img/v3/customers/section-icons/platforms.svg" width="66" height="66" alt="Stack of squares" />
                      <h2 className="common-UppercaseText mt-4">
                          Modern Stack
                      </h2>
                      <p className="common-BodyText">
                          Technology changes fast. Our course adapts to the constantly shifting technological landscape
                          and provides up to date information on how to develop modern full stack applications with a suite
                          of real world open source tools.
                      </p>
                      <Link className="common-BodyText common-Link common-Link--arrow" to="/">
                          Learn About Ignite
                      </Link>
                  </div>
              </div>
          </section>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(App);
