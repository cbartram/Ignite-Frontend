import React, {Component} from 'react';
import {connect} from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {Card, Transition} from "semantic-ui-react";
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Container from "./components/Container/Container";
import {Link, withRouter} from 'react-router-dom'
import QuoteCard from "./components/QuoteCard/QuoteCard";
import IgniteCard from './components/Card/Card';
import InstructorImage from './resources/images/instructor_picture.jpg';
import './App.css';
import {fetchVideos} from "./actions/actions";

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    fetchVideos: (username) => dispatch(fetchVideos(username)),
});


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cogOne: 0,
            cogTwo: 0,
            activeIndex: 0,
            features: [
                {
                    name: 'Quizzes',
                    description: 'Test your knowledge on coding concepts at the end of each suite of videos.'
                },
                {
                    name: 'Articles',
                    description: 'Browse through hand curated articles illuminating new ideas relating to each video.',
                },
                {
                    name: 'Downloads',
                    description: 'All software and downloads used in video lectures is free to use.'
                },
                {
                    name: 'Open Source',
                    description: 'Gain access to direct source code referenced in each of the videos.'
                },
                {
                    name: 'Embedded Programming',
                    description: 'Write & run code along with each video directly in the browser window.'
                },
                {
                    name: 'Open Community',
                    description: 'Utilize the community to answer questions or issues for every Ignite video.'
                }
            ],
            syntax: [
                {
                    id: 0,
                    visible: true,
                    title: 'Javascript & JQuery',
                    lang: 'javascript',
                    code: '$("button.primary").click(function() { \n   window.location.href = "https://google.com?q=My%20Question";\n   const username = $(this).find(".my-class").text();\n    if(username === "foo") {\n      console.log(username); \n    } \n});',
                },
                {
                    id: 1,
                    visible: false,
                    title: 'Node.JS',
                    lang: 'javascript',
                    code: 'const fs = require("fs");\nconst express = require("express");\n\nconst app = express();\n\n app.get("/users/find/:id", (req, res) => {\n        Users.find(req.params.id).then((user) => {\n        user.authenticate();\n        res.json({ success: true, user });    \n    });    \n});',
                },
                {
                    id: 2,
                    visible: false,
                    title: 'Structured Query Language',
                    lang: 'sql',
                    code: 'SELECT (\n    day,\n    transaction_id,\n    timestamp,\n    amount \n) FROM transaction_statements.transactions\n   WHERE transaction_country = "US"\n   GROUP BY timestamp\n   ORDER BY day ASC;',
                },
                {
                    id: 3,
                    visible: false,
                    title: 'React',
                    code: 'import React, { Component } from "react";\n\nclass App extends Component {\n        constructor(props) {\n        super(props);\n        this.state = { data: [] }\n    }\n\nasync componentDidMount() {\n        const data = await fetch("https://apis.google.com/maps/v1/").json();\n        this.setState({ data: data });\n    }\n\nrender() {\n    return (\n        <ul className={this.props.class}>\n        { this.state.data.map(d => <li>{d.title}</li>}) }\n        </ul>\n    )\n}',
                    lang: 'jsx'
                },
                {
                    id: 4,
                    visible: false,
                    title: 'CSS',
                    code: '.footer-text {\n    margin-left: 20px;\n    top: 10px;\n    border: 1px solid #abff01;\n    color:green !important;\n    padding: 3px 2px 10px;\n}\n\n #section-title {\n    font-weight: bold;\n    color: red;\n    border-radius: 3px;\n}\n\np > li.list-item {\n    background-color: white;\n    background-image: url(https://google.com/images/0.jpg)\n    background-size: cover;\n}',
                    lang: 'css'
                },
                {
                    id: 5,
                    visible: false,
                    title: 'Bash & Shell',
                    code: '$ curl -X POST https://google.com | grep <! | sed \\"/g[DOC([a-z])]" > output.txt;\n$ cat output.txt | grep doc',
                    lang: 'shell'
                }
            ]
        };
    }

    componentDidMount() {
        const SPEED = 1.5;

        setInterval(() => {
            this.setState((prev) => {
                const allFalse = prev.syntax.map(s => ({...s, visible: false}));


                if (prev.activeIndex === prev.syntax.length - 1) {
                    return {
                        activeIndex: 0,
                        syntax: allFalse.map(s => {
                            if (s.id === 0)
                                return {
                                    ...s,
                                    visible: true
                                };
                            return s;
                        })
                    };
                }

                return {activeIndex: prev.activeIndex + 1}
            });
        }, 6500);

        setInterval(() => {
            this.setState((prev) => {
                // Compute the cogs value
                let {cogOne, cogTwo} = prev;
                if (cogOne >= 360)
                    cogOne = 0;
                else
                    cogOne += SPEED; // Speed

                if (cogTwo <= -360)
                    cogTwo = 0;
                else
                    cogTwo -= SPEED;

                return {
                    cogOne,
                    cogTwo
                }
            })
        }, 50);

        const addScript = document.createElement('script');
        addScript.setAttribute('src', './Bubbles.js');
        document.body.appendChild(addScript);
    }

    render() {
        return (
            <Container noFooterMargin style={{ overflowX: 'hidden'}}>
                <div className="header-hero">
                    <div className="StripeBackground accelerated">
                        <div className="stripe s0"/>
                        <div className="stripe s1"/>
                        <div className="stripe s2"/>
                        <div className="stripe s3"/>
                    </div>
                    {/* Visual Bubbles Flow */}
                    <div className="IconsContainer" />
                </div>
                <div className="d-flex justify-content-center">
                    {/* Intro Column*/}
                    <div className="col-md-8 offset-md-2">
                        <span className="common-UppercaseTitle">
                            Welcome to Ignite
                        </span>
                        <h1 className="common-PageTitle">Build the next great App</h1>
                        <p className="common-IntroText" style={{maxWidth: 800}}>
                            Our course on full stack development will teach you all the core concepts necessary to have
                            an end to end understanding of modern day development pipeline. From idea to launch We've
                            designed a program that helps to
                            accelerate you through all the stages of software development.
                        </p>
                    </div>
                </div>
                <div className="d-flex justify-content-center my-3">
                    <Link className="common-Button common-Hero-Button" to="/signup">
                        Get Started
                    </Link>
                </div>
                <section id="developers-section" className="py-4">
                    <div className="row d-flex justify-content-center mt-3">
                        <div className="col-md-4 offset-md-2 col-sm-5 offset-sm-1 pl-3" id="flexible-learning">
                            <img src="https://stripe.com/img/v3/customers/section-icons/sharing.svg" width="66"
                                 height="66" alt="Network grid"/>
                            <h2 className="common-UppercaseText mt-4">
                                Flexible Learning
                            </h2>
                            <p className="common-BodyText">
                                Learning a new skill doesn’t have to interrupt your busy schedule. Our on-demand videos
                                and interactive code challenges are there for you when you need them. Keep your day job
                                while you hone your development skills at your own pace.
                            </p>
                            <Link className="common-BodyText common-Link common-Link--arrow" to="/signup">
                                Get Started
                            </Link>
                        </div>
                        <div className="col-md-4 col-sm-5">
                            <img src="https://stripe.com/img/v3/customers/section-icons/platforms.svg" width="66"
                                 height="66" alt="Stack of squares"/>
                            <h2 className="common-UppercaseText mt-4">
                                Modern Stack
                            </h2>
                            <p className="common-BodyText">
                                Technology changes fast. Our course adapts to the constantly shifting technological
                                landscape and provides up to date information on how to develop modern full stack
                                applications
                                with a suite of real world open source tools.
                            </p>
                            <Link className="common-BodyText common-Link common-Link--arrow" to="/pricing">
                                Pricing
                            </Link>
                        </div>
                    </div>
                </section>
                <section id="our-mission">
                    <div className="row">
                        <div className="col-md-6 offset-md-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mission-svg" width="73" height="73"
                                 viewBox="0 0 73 73">
                                <g fill="none" transform="translate(.5 .736)">
                                    <path fill="#C4F0FF"
                                          d="M36,0 C55.882,0 72,16.117 72,36 C72,55.882 55.882,72 36,72 C16.118,72 0,55.882 0,36 C0,16.116 16.118,0 36,0 Z"/>
                                    <path fill="#87BBFD"
                                          d="M18.5,54 C17.6715729,54 17,53.3284271 17,52.5 L17,30.5 C17,29.6715729 17.6715729,29 18.5,29 L37,29 L37,54 L18.5,54 Z M25,33 C25,32.4477153 24.5522847,32 24,32 L21,32 C20.4477153,32 20,32.4477153 20,33 L20,36 C20,36.5522847 20.4477153,37 21,37 L24,37 C24.5522847,37 25,36.5522847 25,36 L25,33 Z M25,41 C25,40.4477153 24.5522847,40 24,40 L21,40 C20.4477153,40 20,40.4477153 20,41 L20,44 C20,44.5522847 20.4477153,45 21,45 L24,45 C24.5522847,45 25,44.5522847 25,44 L25,41 Z M32,33 C32,32.4477153 31.5522847,32 31,32 L28,32 C27.4477153,32 27,32.4477153 27,33 L27,36 C27,36.5522847 27.4477153,37 28,37 L31,37 C31.5522847,37 32,36.5522847 32,36 L32,33 Z"/>
                                    <path fill="#6772E5"
                                          d="M51.5,54 L47,54 L47,46 C47,45.4477153 46.5522847,45 46,45 L42,45 C41.4477153,45 41,45.4477153 41,46 L41,54 L35,54 L35,17.5 C35,16.6715729 35.6715729,16 36.5,16 L51.5,16 C52.3284271,16 53,16.6715729 53,17.5 L53,52.5 C53,53.3284271 52.3284271,54 51.5,54 Z M43,29 C43,28.4477153 42.5522847,28 42,28 L39,28 C38.4477153,28 38,28.4477153 38,29 L38,32 C38,32.5522847 38.4477153,33 39,33 L42,33 C42.5522847,33 43,32.5522847 43,32 L43,29 Z M43,37 C43,36.4477153 42.5522847,36 42,36 L39,36 C38.4477153,36 38,36.4477153 38,37 L38,40 C38,40.5522847 38.4477153,41 39,41 L42,41 C42.5522847,41 43,40.5522847 43,40 L43,37 Z M50,37 C50,36.4477153 49.5522847,36 49,36 L46,36 C45.4477153,36 45,36.4477153 45,37 L45,40 C45,40.5522847 45.4477153,41 46,41 L49,41 C49.5522847,41 50,40.5522847 50,40 L50,37 Z"/>
                                    <path fill="#87BBFD"
                                          d="M49,33 L46,33 C45.4477153,33 45,32.5522847 45,32 L45,29 C45,28.4477153 45.4477153,28 46,28 L49,28 C49.5522847,28 50,28.4477153 50,29 L50,32 C50,32.5522847 49.5522847,33 49,33 Z M49,25 L46,25 C45.4477153,25 45,24.5522847 45,24 L45,21 C45,20.4477153 45.4477153,20 46,20 L49,20 C49.5522847,20 50,20.4477153 50,21 L50,24 C50,24.5522847 49.5522847,25 49,25 Z M42,25 L39,25 C38.4477153,25 38,24.5522847 38,24 L38,21 C38,20.4477153 38.4477153,20 39,20 L42,20 C42.5522847,20 43,20.4477153 43,21 L43,24 C43,24.5522847 42.5522847,25 42,25 Z M40,52 L48,52 C48.5522847,52 49,52.4477153 49,53 L49,54 L39,54 L39,53 C39,52.4477153 39.4477153,52 40,52 Z"/>
                                </g>
                            </svg>
                            <h1 className="common-UppercaseTitle">
                                Our Mission
                            </h1>
                            <p className="common-BodyText">
                                At Ignite our missions is to bring affordable technology education to everyone. Full
                                stack development is hard. There is a plethora of information and mis-information out
                                there on the right way to develop modern
                                web applications. In our current age we demand that apps be more reliable, resilient,
                                available, and responsive
                                then ever before. Ignite's courses teach you how to code, create, deploy, and maintain
                                modern day full stack applications in production.
                            </p>
                            <Link className="common-Button common-Blue-Button mb-3" to="/signup">
                                Start Now
                            </Link>
                        </div>
                        <div className="col-md-5">
                            <div className="laptop">
                                <span className="shadow"/>
                                <span className="lid"/>
                                <span className="camera"/>
                                <div className="screen">
                                    <div style={{ position: 'absolute', top: '20'}}>
                                        <div id="programming-languages" style={{ position: 'absolute', top: 150, left: 260}} />
                                        <svg className="heading-icon" style={{ position: 'absolute', top: 150, left: 240 }}>
                                            <circle fill="#B9F4BC" cx="33" cy="33" r="33" />
                                            <path
                                                d="M38.4 15l1-3h1l1.2 3c.2.2.5.2.7.3l2.2-2.5 1 .4-.2 3.3c.2 0 .3.2.5.4l3-1.5.7.7-1.4 3 .5.5h3.3l.4.8-2.5 2.2c0 .2 0 .5.2.7l3 1v1l-3 1.2-.3.8 2.5 2-.4 1-3.3-.2-.4.7 1.5 2.8-.7.7-3-1.4c0 .2-.4.4-.6.5l.2 3.3-1 .4-2-2.5c-.3 0-.6 0-1 .2l-1 3h-1l-1-3c-.2-.2-.5-.2-.8-.3l-2 2.5-1-.4.2-3.3-.7-.4-2.8 1.5-.7-.7 1.4-3c-.2 0-.4-.4-.5-.6l-3.3.2-.4-1 2.5-2c0-.3 0-.6-.2-1l-3-1v-1l3-1c.2-.2.2-.4.3-.7l-2.5-2.2.4-1 3.3.2c0-.2.2-.3.4-.5l-1.5-3 .7-.7 3 1.4.5-.5v-3.3l.8-.4 2.2 2.5s.5 0 .7-.2z"
                                                fill="#6ED69A" transform={`rotate(${this.state.cogOne} 40 25)`} />
                                            <circle fill="#B9F4BC" cx="40" cy="25" r="2" />
                                            <path
                                                d="M21.6 26.8L19 25l-1.3 1 1.4 3c0 .2-.3.4-.5.6l-3-.8-1 1.4 2.4 2.3-.4.8-3.2.3-.3 1.6 3 1.4v.8l-3 1.4.4 1.6 3.2.3c0 .3.2.5.3.8l-2.4 2.3.8 1.4 3-.8.7.6-1.3 3 1.3 1 2.6-1.8c.3 0 .5.3.8.4l-.3 3.2 1.6.6 2-2.7c.2 0 .5 0 .7.2l1 3h1.5l1-3c0-.2.4-.2.7-.3l2 2.7 1.4-.6-.4-3.2c.3 0 .5-.3.8-.4L37 49l1.3-1-1.4-3c0-.2.3-.4.5-.6l3 .8 1-1.4-2.4-2.3.4-.8 3.2-.3.3-1.6-3-1.4v-.8l3-1.4-.4-1.6-3.2-.3c0-.3-.2-.5-.3-.8l2.4-2.3-.8-1.4-3 .8-.7-.6 1.3-3-1.3-1-2.6 1.8c-.3 0-.5-.3-.8-.4l.3-3.2-1.6-.6-2 2.7c-.2 0-.5 0-.7-.2l-1-3h-1.5l-1 3c0 .2-.4.2-.7.3l-2-2.7-1.4.6.4 3.2c-.3 0-.5.3-.8.4z"
                                                fill="#1BB978" transform={`rotate(${this.state.cogTwo} 28 37)`} />
                                            <circle fill="#B9F4BC" cx="28" cy="37" r="3" />
                                        </svg>
                                    </div>
                                    {/* Laptop content goes here */}
                                </div>
                                <span className="chassis">
                        <span className="keyboard"/>
                        <span className="trackpad"/>
                      </span>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="course-overview">
                    <div className="row">
                        <div className="col-md-6 offset-md-1">
                            <Transition visible={this.state.syntax[this.state.activeIndex].visible === true}
                                        animation="scale" duration={500}>
                                <IgniteCard cardTitle={this.state.syntax[this.state.activeIndex].title} inverted
                                            style={{paddingBottom: 0}} classNames={['py-0']}>
                                    <SyntaxHighlighter showLineNumbers
                                                       useInlineStyles={false}
                                                       language={this.state.syntax[this.state.activeIndex].lang}
                                                       style={docco}>
                                        {this.state.syntax[this.state.activeIndex].code}
                                    </SyntaxHighlighter>
                                </IgniteCard>
                            </Transition>
                        </div>
                        <div className="col-md-4 pb-3 pr-3">
                            <h1 className="common-UppercaseTitle common-UppercaseTitle-Inverse mt-3">
                                Course Overview
                            </h1>
                            <p className="common-BodyText common-BodyText-light">
                                Learn end to end full stack development using modern open source
                                technologies and libraries like Git, React, NodeJS, Postgres, Express, and JQuery among
                                others! The course takes you through everything from setting up your local development
                                environment, to testing, continuous integration, live deployments, project management,
                                and Cloud
                                providers like <Link className="common-Link common-Link-Inverse"
                                                     to="https://aws.amazon.com">Amazon Web Services</Link>.
                            </p>
                            <Link className="common-Button common-Button--default mt-2" to="/signup">
                                Signup
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="learning-tools">
                    <div className="row">
                        <div className="col-md-6 offset-md-1 mt-3">
                            <Card.Group itemsPerRow={2}>
                                {
                                    this.state.features.map(feature => {
                                        return (
                                            <Card
                                                header={feature.name}
                                                description={feature.description}
                                            />
                                        );
                                    })
                                }
                            </Card.Group>
                        </div>
                        <div className="col-md-4 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" viewBox="0 0 48 39">
                                <g fill="none">
                                    <path fill="#FFCCA5"
                                          d="M38,39 L12,39 C10.3431458,39 9,37.6568542 9,36 L9,3 C9,1.34314575 10.3431458,0 12,0 L38,0 C39.6568542,0 41,1.34314575 41,3 L41,36 C41,37.6568542 39.6568542,39 38,39 Z M19.5,36 L32.5,36 C33.3284271,36 34,35.3284271 34,34.5 C34,33.6715729 33.3284271,33 32.5,33 L19.5,33 C18.6715729,33 18,33.6715729 18,34.5 C18,35.3284271 18.6715729,36 19.5,36 Z M26,16.5 C26,15.6715729 25.3284271,15 24.5,15 L18.5,15 C17.6715729,15 17,15.6715729 17,16.5 C17,17.3284271 17.6715729,18 18.5,18 L24.5,18 C25.3284271,18 26,17.3284271 26,16.5 L26,16.5 Z M13.5,24 L22.5,24 C23.3284271,24 24,23.3284271 24,22.5 C24,21.6715729 23.3284271,21 22.5,21 L13.5,21 C12.6715729,21 12,21.6715729 12,22.5 C12,23.3284271 12.6715729,24 13.5,24 Z M24.5,3 L13.5,3 C12.6715729,3 12,3.67157288 12,4.5 C12,5.32842712 12.6715729,6 13.5,6 L24.5,6 C25.3284271,6 26,5.32842712 26,4.5 C26,3.67157288 25.3284271,3 24.5,3 Z M36.5,9 L23.5,9 C22.6715729,9 22,9.67157288 22,10.5 C22,11.3284271 22.6715729,12 23.5,12 L36.5,12 C37.3284271,12 38,11.3284271 38,10.5 C38,9.67157288 37.3284271,9 36.5,9 L36.5,9 Z M36.5,21 L28.5,21 C27.6715729,21 27,21.6715729 27,22.5 C27,23.3284271 27.6715729,24 28.5,24 L36.5,24 C37.3284271,24 38,23.3284271 38,22.5 C38,21.6715729 37.3284271,21 36.5,21 Z"/>
                                    <path fill="#FFA27B"
                                          d="M48.66,29.366 L44.506,33.65 C44.2890532,33.8767863 43.9888438,34.0050541 43.675,34.0050541 C43.3611562,34.0050541 43.0609468,33.8767863 42.844,33.65 C42.3862197,33.1707525 42.3862197,32.4162475 42.844,31.937 L44.722,30 L24.5,30 C23.6715729,30 23,29.3284271 23,28.5 C23,27.6715729 23.6715729,27 24.5,27 L44.704,27 L42.844,25.082 C42.3862197,24.6027525 42.3862197,23.8482475 42.844,23.369 C43.0605372,23.1418217 43.3605151,23.0130116 43.6743591,23.0124451 C43.9882031,23.0118786 44.2886441,23.1396049 44.506,23.366 L48.661,27.651 C49.121,28.124 49.121,28.891 48.661,29.364 L48.66,29.366 Z M17.5,12 L5.296,12 L7.156,13.918 C7.61378028,14.3972475 7.61378028,15.1517525 7.156,15.631 C6.93905318,15.8577863 6.63884379,15.9860541 6.325,15.9860541 C6.01115621,15.9860541 5.71094682,15.8577863 5.494,15.631 L1.34,11.35 C0.881582563,10.8706211 0.881582563,10.1153789 1.34,9.636 L5.494,5.352 C5.71094682,5.12521375 6.01115621,4.99694591 6.325,4.99694591 C6.63884379,4.99694591 6.93905318,5.12521375 7.156,5.352 C7.61378028,5.83124747 7.61378028,6.58575253 7.156,7.065 L5.278,9 L17.5,9 C18.3284271,9 19,9.67157288 19,10.5 C19,11.3284271 18.3284271,12 17.5,12 Z"/>
                                </g>
                            </svg>
                            <h1 className="common-UppercaseTitle peach">
                                Learning Tools
                            </h1>
                            <p className="common-BodyText">
                                Ignite has the tools you need to learn including quizzes for each chapter, hand curated
                                articles relating to each video,
                                useful download links for free open source software, direct access to the lessons source
                                code, an embedded space to write
                                code directly in the browser, and even a question and answer forum to promote community
                                collaboration!
                            </p>
                            <Link className="common-Button common-Peach-Button mb-3" to="/signup">
                                Start Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* TODO Add section about community forum, quizzes, videos, practice, article links, etc... */}
                <section id="instructor">
                    <div className="row">
                        <div className="col-md-6 offset-md-1 pt-4">
                            <h1 className="common-UppercaseTitle">
                                Meet your Instructor
                            </h1>
                            <p className="common-BodyText">
                                Christian has been professionally developing software for over 5 years and holds a
                                Bachelors degree
                                in Information Systems from the University of North Florida. He has worked for companies
                                including
                                Blue Cross Blue Shield and Capital One working on real full stack development teams to
                                push mission
                                critical code to production. Christian has also led mentoring workshops and tutoring
                                sessions within
                                his role's where he teaches newly graduated students the fundamentals of full stack
                                development
                            </p>
                            <p className="common-BodyText">
                                Christian is passionate about helping people find their true calling and is a firm
                                believer in teaching
                                someone how to think critically and solve problems in their industry. Education is
                                expensive but at
                                Ignite we want to provide it to our users as cheaply as possible.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <QuoteCard
                                imageUrl={InstructorImage}
                                quote="Teach people to code and they can build an app. Teach someone to think
                                 like a full stack developer and they can conquer any problem they are faced with."
                                by="Christian Bartram"
                            />
                        </div>
                    </div>
                </section>
                <section id="run-your-business-on-stripe" className="features section bg-slate-9">
                    <div className="container-lg section-intro">
                        <h2 className="common-SectionTitle">
                            Full Stack Development Course Overview
                        </h2>
                        <p className="common-IntroText">
                            Learn the full stack development toolkit and build any Mobile, Web, or Desktop App you and your customers can dream
                            of.
                        </p>
                    </div>

                    <div className="container-lg feature-list_container">
                        <ul className="feature-list common-BodyText ml-5">
                            <li className="title">
                                Front End & Security
                            </li>
                            <li>
                                Get Setup
                                <div className="popover">Download Developer tools, get an IDE, and setup your computer for coding.</div>
                            </li>
                            <li>
                                HTML &amp; CSS
                                <div className="popover">Learn the fundamentals of what makes up a web page.</div>
                            </li>
                            <li>
                                Javascript
                                <div className="popover">Learn the primary programming language of the web (and now the backend as well).</div>
                            </li>
                            <li>
                                JQuery & DOM
                                <div className="popover">Discover the worlds most popular frontend web and DOM manipulation framework</div>
                            </li>
                            <li>
                                React &amp; Redux
                                <div className="popover">Learn to use composable building blocks to create fast websites and user interfaces.</div>
                            </li>
                            <li>
                                Application Security
                                <div className="popover">Properly authorize, authenticate and secure your application using a suite of well tested tools.</div>
                            </li>
                        </ul>


                        <ul className="feature-list common-BodyText">
                            <li className="title">
                                Backend & Project Mgmt
                            </li>
                            <li>
                                Agile & SCRUM
                                <div className="popover">Discover how large scale software in the real world gets developed and distribute.</div>
                            </li>
                            <li>
                                Node.JS
                                <div className="popover">Revisit the way the internet works and learn how to write server sided code with Node.JS.</div>
                            </li>
                            <li>
                                NPM & Open Source
                                <div className="popover">Learn about the world of open source and how we can leverage existing code to work for us.</div>
                            </li>
                            <li>
                                Express & EJS
                                <div className="popover">Join the most popular server sided web framework for creating composable web applications.</div>
                            </li>
                            <li>
                                Routing and API Design
                                <div className="popover">Design architectually sound API's for accessing and processing data.</div>
                            </li>
                            <li>
                                UI Design & Web Mockups
                                <div className="popover">Learn the basics of web design, color palettes, and common web components.</div>
                            </li>
                            <li>
                                And More
                                <div className="popover">Join Ignite today for even more lessons and labs!</div>
                            </li>
                        </ul>


                        <ul className="feature-list common-BodyText">
                            <li className="title">
                                Databases & Testing
                            </li>
                            <li>
                                Database Introduction
                                <div className="popover">Learn about the history and uses of a database.</div>
                            </li>
                            <li>
                                SQL & ORM
                                <div className="popover">
                                    Discover the language of databases and how to interact with them using code.
                                </div>
                            </li>
                            <li>
                                MongoDB & NoSQL
                                <div className="popover">
                                    A new type of database which uses document based storage in favor of traditional SQL.
                                </div>
                            </li>
                            <li>
                                TDD & Unit Testing
                                <div className="popover">
                                    Automatically test our code with tools like Mocha and Chia
                                </div>
                            </li>
                            <li>
                                Integration and Performance Testing
                                <div className="popover">
                                    Ensure your app is ready to handle any number of users in production.
                                </div>
                            </li>
                            <li>
                                And More
                                <div className="popover">Join Ignite today for even more lessons and labs!</div>
                            </li>
                        </ul>


                        <ul className="feature-list common-BodyText">
                            <li className="title">
                                Cloud & App Architecture
                            </li>
                            <li>
                                Cloud Architecture
                                <div className="popover">
                                    Build secure applications in the cloud to scale with business needs.
                                </div>
                            </li>
                            <li>
                                AWS Services
                                <div className="popover">Learn about the many cloud based services AWS provides.</div>
                            </li>
                            <li>
                                AWS Virtual Servers
                                <div className="popover">Create virtual EC2 servers on demand to meet Application compute needs.</div>
                            </li>
                            <li>
                                Serverless Computing
                                <div className="popover">Learn how to build a low cost way to share your App without servers.</div>
                            </li>
                            <li>
                                Simple Cloud Storage
                                <div className="popover">Store an infinite amount of app data in the cloud with S3.</div>
                            </li>
                            <li>
                                Cloud Labs
                                <div className="popover">Take part in cloud labs building out real full stack applications.</div>
                            </li>
                            <li>
                                And More
                                <div className="popover">Join Ignite today for even more lessons and labs!</div>
                            </li>
                        </ul>
                    </div>
                    <div className="common-StripeGrid">
                        <div className="backgroundContainer">
                            <div className="grid">
                                <div className="background"/>
                            </div>
                        </div>
                        <div className="stripeContainer">
                            <div className="grid">
                                <span className="stripe s2 gray"/>
                                <span className="stripe s3 green2"/>
                                <span className="stripe s4 green2"/>

                            </div>
                        </div>
                    </div>
                </section>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
