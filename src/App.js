import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from "./components/Container/Container";
import { Link } from 'react-router-dom'
import './App.css';

const mapStateToProps = state => ({
   auth: state.auth,
});

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          xTranslations: [0, 10, 290, 30, 40, 50, 60, 70],
          xTranslationDefault: [0, 10, 290, 30, 40, 50, 60, 70],
          yTranslations: [65, 274, 359, 98, 314, 122, 310, 149], // Mutated y translations
          yTranslationDefault: [65, 274, 359, 98, 314, 122, 310, 149] // Static default y translations used for reference
      }
  }

  componentDidMount() {
      const speed = 1.5; // How fast each of the bubbles move (negative value changes direction)
      setInterval(() => {
          let { xTranslations, yTranslations } = this.state;

          xTranslations = xTranslations.map((translation, i) => {
              // if translation > screen width set to its default
              if(translation > window.innerWidth + 200) {
                  return this.state.xTranslationDefault[i]
              }
              translation += speed;

              return translation;
          });

          yTranslations = yTranslations.map((translation, i) => {
              let maxY = this.state.yTranslationDefault[i] + 10; // The max is + 10 pixels
              let minY  = this.state.yTranslationDefault[i] - 10; // The min is -10 pixels
              if(translation >= minY) {
                  translation -= 1;
              }
              if(translation <= maxY) {
                  translation += 1;
              } else {
                  console.log('foo');
              }

              return translation;
          });


          this.setState({
              xTranslations,
              yTranslations,
          })
      }, 100);
  }

    render() {
    return (
      <Container>
          {/* Visual Flow */}
          <div className="icon-container" />
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
          <div className="d-flex flex-column justify-content-center align-items-center">
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
          {/*<div className="common-StripeGrid anchorBottom">*/}
              {/*<div className="backgroundContainer">*/}
                  {/*<div className="grid">*/}
                      {/*<div className="background" />*/}
                  {/*</div>*/}
              {/*</div>*/}
              {/*<div className="stripeContainer" style={{ height: '36%', zIndex: -1}}>*/}
                  {/*<div className="grid">*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                      {/*<div className="stripe" />*/}
                  {/*</div>*/}
              {/*</div>*/}
          {/*</div>*/}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(App);
