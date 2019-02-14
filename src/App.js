import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from "./components/Container/Container";
import { Link } from 'react-router-dom'
import './App.css';
import Card from "./components/Card/Card";
import QuoteCard from "./components/QuoteCard/QuoteCard";

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
          <section id="our-mission">
            <div className="row">
                <div className="col-md-3 offset-md-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mission-svg" width="73" height="73" viewBox="0 0 73 73">
                        <g fill="none" transform="translate(.5 .736)">
                            <path fill="#C4F0FF" d="M36,0 C55.882,0 72,16.117 72,36 C72,55.882 55.882,72 36,72 C16.118,72 0,55.882 0,36 C0,16.116 16.118,0 36,0 Z" />
                            <path fill="#87BBFD" d="M18.5,54 C17.6715729,54 17,53.3284271 17,52.5 L17,30.5 C17,29.6715729 17.6715729,29 18.5,29 L37,29 L37,54 L18.5,54 Z M25,33 C25,32.4477153 24.5522847,32 24,32 L21,32 C20.4477153,32 20,32.4477153 20,33 L20,36 C20,36.5522847 20.4477153,37 21,37 L24,37 C24.5522847,37 25,36.5522847 25,36 L25,33 Z M25,41 C25,40.4477153 24.5522847,40 24,40 L21,40 C20.4477153,40 20,40.4477153 20,41 L20,44 C20,44.5522847 20.4477153,45 21,45 L24,45 C24.5522847,45 25,44.5522847 25,44 L25,41 Z M32,33 C32,32.4477153 31.5522847,32 31,32 L28,32 C27.4477153,32 27,32.4477153 27,33 L27,36 C27,36.5522847 27.4477153,37 28,37 L31,37 C31.5522847,37 32,36.5522847 32,36 L32,33 Z" />
                            <path fill="#6772E5" d="M51.5,54 L47,54 L47,46 C47,45.4477153 46.5522847,45 46,45 L42,45 C41.4477153,45 41,45.4477153 41,46 L41,54 L35,54 L35,17.5 C35,16.6715729 35.6715729,16 36.5,16 L51.5,16 C52.3284271,16 53,16.6715729 53,17.5 L53,52.5 C53,53.3284271 52.3284271,54 51.5,54 Z M43,29 C43,28.4477153 42.5522847,28 42,28 L39,28 C38.4477153,28 38,28.4477153 38,29 L38,32 C38,32.5522847 38.4477153,33 39,33 L42,33 C42.5522847,33 43,32.5522847 43,32 L43,29 Z M43,37 C43,36.4477153 42.5522847,36 42,36 L39,36 C38.4477153,36 38,36.4477153 38,37 L38,40 C38,40.5522847 38.4477153,41 39,41 L42,41 C42.5522847,41 43,40.5522847 43,40 L43,37 Z M50,37 C50,36.4477153 49.5522847,36 49,36 L46,36 C45.4477153,36 45,36.4477153 45,37 L45,40 C45,40.5522847 45.4477153,41 46,41 L49,41 C49.5522847,41 50,40.5522847 50,40 L50,37 Z" />
                            <path fill="#87BBFD" d="M49,33 L46,33 C45.4477153,33 45,32.5522847 45,32 L45,29 C45,28.4477153 45.4477153,28 46,28 L49,28 C49.5522847,28 50,28.4477153 50,29 L50,32 C50,32.5522847 49.5522847,33 49,33 Z M49,25 L46,25 C45.4477153,25 45,24.5522847 45,24 L45,21 C45,20.4477153 45.4477153,20 46,20 L49,20 C49.5522847,20 50,20.4477153 50,21 L50,24 C50,24.5522847 49.5522847,25 49,25 Z M42,25 L39,25 C38.4477153,25 38,24.5522847 38,24 L38,21 C38,20.4477153 38.4477153,20 39,20 L42,20 C42.5522847,20 43,20.4477153 43,21 L43,24 C43,24.5522847 42.5522847,25 42,25 Z M40,52 L48,52 C48.5522847,52 49,52.4477153 49,53 L49,54 L39,54 L39,53 C39,52.4477153 39.4477153,52 40,52 Z" />
                        </g>
                    </svg>
                    <h1 className="common-UppercaseTitle">
                        Our Mission
                    </h1>
                    <p className="common-BodyText">
                        At Ignite our missions is to bring affordable technology education to everyone. Full stack development
                        is hard. There is a plethora of information and mis-information out there on the right way to develop modern
                        web applications. In our current age we demand that apps be more reliable, resilient, available, and responsive
                        then ever before. Ignite's courses teach you how to code, create, deploy, and maintain modern day full stack
                        applications in production.
                    </p>
                </div>
                <div className="col-md-6">
                    <div className="laptop">
                        <span className="shadow" />
                        <span className="lid" />
                        <span className="camera" />
                        <div className="screen">
                            {/* Laptop content goes here */}
                        </div>
                        <span className="chassis">
                        <span className="keyboard" />
                        <span className="trackpad" />
                      </span>
                    </div>
                </div>
            </div>
          </section>
          <section id="course-overview">
                <div className="row">
                    <div className="col-md-4 offset-md-2">
                        <Card badgeText="Full Stack" style={{minWidth: 100, paddingLeft: 0, transform: 'none' }}>
                            <ul className="course-overview-list">
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    Git & Github
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    Terminal & Command Line
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    HTML & CSS
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    Mobile First Responsive Design
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    Javascript & JQuery
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    NodeJS & Express
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    PostgreSQL & Databases
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    React/Redux
                                </li>
                                <li>
                                    <span className="fa fa-check success-icon mr-2" />
                                    Cloud Computing (AWS)
                                </li>
                            </ul>
                            <div className="d-flex flex-row justify-content-center">
                                <p className="common-BodyText">
                                    And so much more!
                                </p>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <svg className="mt-4" style={{ height: 70 }}>
                            <circle fill="#B9F4BC" cx="33" cy="33" r="33" />
                            <path
                                d="M38.4 15l1-3h1l1.2 3c.2.2.5.2.7.3l2.2-2.5 1 .4-.2 3.3c.2 0 .3.2.5.4l3-1.5.7.7-1.4 3 .5.5h3.3l.4.8-2.5 2.2c0 .2 0 .5.2.7l3 1v1l-3 1.2-.3.8 2.5 2-.4 1-3.3-.2-.4.7 1.5 2.8-.7.7-3-1.4c0 .2-.4.4-.6.5l.2 3.3-1 .4-2-2.5c-.3 0-.6 0-1 .2l-1 3h-1l-1-3c-.2-.2-.5-.2-.8-.3l-2 2.5-1-.4.2-3.3-.7-.4-2.8 1.5-.7-.7 1.4-3c-.2 0-.4-.4-.5-.6l-3.3.2-.4-1 2.5-2c0-.3 0-.6-.2-1l-3-1v-1l3-1c.2-.2.2-.4.3-.7l-2.5-2.2.4-1 3.3.2c0-.2.2-.3.4-.5l-1.5-3 .7-.7 3 1.4.5-.5v-3.3l.8-.4 2.2 2.5s.5 0 .7-.2z"
                                fill="#6ED69A" transform="rotate(219.19759200000001 40 25)" />
                            <circle fill="#B9F4BC" cx="40" cy="25" r="2" />
                            <path
                                d="M21.6 26.8L19 25l-1.3 1 1.4 3c0 .2-.3.4-.5.6l-3-.8-1 1.4 2.4 2.3-.4.8-3.2.3-.3 1.6 3 1.4v.8l-3 1.4.4 1.6 3.2.3c0 .3.2.5.3.8l-2.4 2.3.8 1.4 3-.8.7.6-1.3 3 1.3 1 2.6-1.8c.3 0 .5.3.8.4l-.3 3.2 1.6.6 2-2.7c.2 0 .5 0 .7.2l1 3h1.5l1-3c0-.2.4-.2.7-.3l2 2.7 1.4-.6-.4-3.2c.3 0 .5-.3.8-.4L37 49l1.3-1-1.4-3c0-.2.3-.4.5-.6l3 .8 1-1.4-2.4-2.3.4-.8 3.2-.3.3-1.6-3-1.4v-.8l3-1.4-.4-1.6-3.2-.3c0-.3-.2-.5-.3-.8l2.4-2.3-.8-1.4-3 .8-.7-.6 1.3-3-1.3-1-2.6 1.8c-.3 0-.5-.3-.8-.4l.3-3.2-1.6-.6-2 2.7c-.2 0-.5 0-.7-.2l-1-3h-1.5l-1 3c0 .2-.4.2-.7.3l-2-2.7-1.4.6.4 3.2c-.3 0-.5.3-.8.4z"
                                fill="#1BB978" transform="rotate(-219.19759200000001 28 37)" />
                            <circle fill="#B9F4BC" cx="28" cy="37" r="3"/>
                        </svg>
                        <h1 className="common-UppercaseTitle">
                            Course Overview
                        </h1>
                        <p className="common-BodyText">
                            With ignite you will learn end to end full stack development using popular open source
                            technologies and libraries like Git, React, NodeJS, Postgres, Express, and JQuery among others!
                            The course takes you through everything from setting up your local development environment,
                            to testing, continuous integration, live deployments, project management, and Cloud providers
                            like <Link to="https://aws.amazon.com">Amazon Web Services</Link>. This course can help launch your career in a completely different
                            direction or simply give you the skills necessary to take on web contracting work from places
                            like <Link to="https://upwork.com">Upwork</Link>!
                        </p>
                    </div>
                </div>
          </section>
          <section id="instructor">
              <div className="row">
                  <div className="col-md-4 offset-md-3 pt-4">
                      <h1 className="common-UppercaseTitle">
                          Meet your Instructor
                      </h1>
                      <p className="common-BodyText">
                          Christian has been professionally developing software for over 5 years and holds a Bachelors degree
                          in Information Systems from the University of North Florida. He has worked for companies including
                          Blue Cross Blue Shield and Capital One working on real full stack development teams to push mission
                          critical code to production. Christian has also led mentoring workshops and tutoring sessions within
                          his role's where he teaches newly graduated students the fundamentals of full stack development
                      </p>
                      <p className="common-BodyText">
                          Christian is passionate about helping people find their true calling and is a firm believer in teaching
                          someone how to think critically and solve problems in their industry. Education is expensive but at
                          Ignite we want to provide it to our users as cheaply as possible.
                      </p>
                  </div>
                  <div className="col-md-4">
                      <QuoteCard
                          imageUrl="https://i.ibb.co/GsFDr1G/IMG-1356.jpg"
                          quote="Teach people to code and they can build an app. Teach someone to think
                                 like a full stack develop and they can conquer any problem they are faced with."
                          by="Christian Bartram"
                      />
                  </div>
              </div>
          </section>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(App);
