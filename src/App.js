import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Container from "./components/Container/Container";
import { Link } from 'react-router-dom'

const mapStateToProps = state => ({
   auth: state.auth,
});

class App extends Component {
  constructor() {
      super();

      this.state = {
          rotations: [100, 400, 180, 360, 130, 250],
          layerRotation: 100,
      }
  }

  componentDidMount() {
      let { rotations, layerRotation } = this.state;
      setInterval(() => {
          this.setState({
              rotations: [rotations[0] += 0.65, rotations[1] += 0.25, rotations[2] += 0.55, rotations[3] += 0.15, rotations[4] += 0.39, rotations[5] += 0.75],
              layerRotation: layerRotation -= Math.random(),
          })
      }, 50);
  }

    // Object(h.b)(0).then(function() {
    //     return t.__createLogo(1, 4e3)
    // }),
    // Object(h.b)(500).then(function() {
    //     return t.__createLogo(2, 90, 4500)
    // }),
    // Object(h.b)(1e3).then(function() {
    //     return t.__createLogo(3, 180, 5e3)
    // }),
    // Object(h.b)(1500).then(function() {
    //     return t.__createLogo(3, 360, 5500)
    // }),
    // Object(h.b)(2e3).then(function() {
    //     return t.__createLogo(4, 130, 6e3)
    // }),
    // Object(h.b)(2500).then(function() {
    //     return t.__createLogo(4, 250, 6500)
    // }),
    // Object(h.b)(3e3).then(function() {
    //     return t.__createLogo(4, 320, 7e3)
    // });

    render() {
    return (
      <Container>

          <div className="row" style={{marginTop: 90}}>
              {/* Intro Column*/}
              <div className="col-md-4 offset-md-2">
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
              {/* Visual Column */}
              <div className="col-md-5">
                  <div className="intro-visual">
                      <div className="intro-visual-container intro-visual--measured" id="js-intro-visual">
                          <div className="layer" style={{opacity: 0.3, transform: 'scale(1)',}} />
                          <div className="layer" style={{ opacity: 0.45, transform: 'scale(0.7799)' }} />
                          <div className="layer" style={{ opacity: 0.6, transform: 'scale(0.5598)' }} />
                          <div className="layer" style={{ opacity: 0.75, transform: 'scale(0.3397)' }} />
                          <div className="layer layer--stripe" style={{ opacity: 0.9, transform: `scale(0.1196)` }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 250 250">
                                  <defs>
                                      <circle id="stripe-intro-visual-a" cx="125" cy="125" r="125" />
                                      <circle id="stripe-intro-visual-c" cx="125" cy="125" r="125" />
                                  </defs>
                                  <g fill="none" fillRule="evenodd">
                                      <circle cx="125" cy="125" r="125" fill="#FFF" fillRule="nonzero" />
                                      <mask id="stripe-intro-visual-b" fill="#fff">
                                          <use  />
                                      </mask>
                                      <path fill="#E6EBF1" fillRule="nonzero"
                                            d="M63.6165089,233.891895 C46.8556811,224.435235 32.3108821,211.155406 21.3650589,194.950502 L127.104082,172.474979 C139.765395,169.783734 152.211102,177.86607 154.902347,190.527383 C157.593592,203.188696 149.511255,215.634403 136.849943,218.325647 L63.6165089,233.891895 Z M2.73154991,150.988961 C-0.714912672,134.77463 -0.848523339,118.626596 1.87333791,103.249165 L153.46303,71.0277807 C166.124343,68.3365359 178.570049,76.4188724 181.261295,89.0801849 C183.95254,101.741497 175.870203,114.187205 163.208891,116.878449 L2.73154991,150.988961 Z"
                                            mask="url(#stripe-intro-visual-b)" />
                                      <g>
                                          <mask id="stripe-intro-visual-d" fill="#fff">
                                              <use />
                                          </mask>
                                          <path fill="#CFD7DF" fillRule="nonzero"
                                                d="M186.383491,16.1081054 C203.144319,25.5647647 217.689118,38.8445943 228.634941,55.0494979 L138.179474,74.276401 C125.518161,76.9676458 113.072454,68.8853094 110.381209,56.2239969 C107.689964,43.5626843 115.772301,31.1169772 128.433614,28.4257322 L186.383491,16.1081054 Z M247.26845,99.0110385 C250.714912,115.22537 250.848523,131.373404 248.126662,146.750835 L96.5369698,178.972219 C83.8756573,181.663464 71.4299505,173.581128 68.7387052,160.919815 C66.0474599,148.258503 74.1297969,135.812795 86.7911094,133.121551 L247.26845,99.0110385 Z"
                                                mask="url(#stripe-intro-visual-d)" />
                                      </g>
                                  </g>
                              </svg>

                          </div>
                          <div className="logo-rotator" style={{ transform: `rotate(${this.state.rotations[0]}deg)` }}>
                              <div className="logo-scaler" style={{transform: 'scale(0.99142)', left: '238.296px' }}>
                                  <div className="logo HeaderVisualLogo HeaderVisualLogo-img1" />
                              </div>
                          </div>
                          <div className="logo-rotator" style={{ transform: `rotate(${this.state.rotations[1]}deg)` }}>
                              <div className="logo-scaler" style={{ transform: 'scale(0.99142)', left: '238.296px' }}>
                                  <div className="logo HeaderVisualLogo HeaderVisualLogo-img2" />
                              </div>
                          </div>
                          <div className="logo-rotator" style={{transform: `rotate(${this.state.rotations[2]}deg)`}}>
                              <div className="logo-scaler" style={{transform: 'scale(0.99142)', left: '205.547px'}}>
                                  <div className="logo HeaderVisualLogo HeaderVisualLogo-img3" />
                              </div>
                          </div>
                          <div className="logo-rotator" style={{transform: `rotate(${this.state.rotations[3]}deg)`}}>
                              <div className="logo-scaler" style={{transform: 'scale(0.99142)', left: '105.547px'}}>
                                  <div className="logo HeaderVisualLogo HeaderVisualLogo-img4" />
                              </div>
                          </div>
                          <div className="logo-rotator" style={{transform: `rotate(${this.state.rotations[4]}deg)`}}>
                              <div className="logo-scaler" style={{transform: 'scale(0.99142)', left: '50.547px'}}>
                                  <div className="logo HeaderVisualLogo HeaderVisualLogo-img5" />
                              </div>
                          </div>
                          <div className="logo-rotator" style={{transform: `rotate(${this.state.rotations[5]}deg)`}}>
                              <div className="logo-scaler" style={{transform: 'scale(0.99142)', left: '31.547px'}}>
                                  <div className="logo HeaderVisualLogo HeaderVisualLogo-img6" />
                              </div>
                          </div>
                      </div>
                  </div>
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
