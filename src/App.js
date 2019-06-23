import React, {Component} from 'react';
import {connect} from 'react-redux';
import Container from "./components/Container/Container";
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash';
import Card from "./components/Card/Card";
import QuoteCard from "./components/QuoteCard/QuoteCard";
import InstructorImage from './resources/images/instructor_picture.jpg';
import './App.css';
import {USER_POOL_URL} from "./constants";
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
        };
    }

    componentDidMount() {
        const SPEED = 1.5;

        setInterval(() => {
            this.setState((prev) => ({ foo: !prev.foo }));
        }, 3000);

        setInterval(() => {
            this.setState((prev) => {
                // Compute the cogs value
                let { cogOne, cogTwo } = prev;
                if(cogOne >= 360)
                    cogOne = 0;
                else
                    cogOne += SPEED; // Speed

                if(cogTwo <= -360)
                    cogTwo = 0;
                else
                    cogTwo -= SPEED;

                return {
                    cogOne,
                    cogTwo
                }
            })
        }, 50);

        // Parse code query param if it exists
        // If the code exists
        // if(!_.isNil(code)) {
        //     fetch(USER_POOL_URL)
        // }

        // make a call to cognito TOKEN endpoint
        // get access token
        // make a call to my backend to swap access token for user pool creds
        // now you have user pool creds dispatch actions to log the user in


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
                <div className="d-flex flex-row justify-content-center">
                    {/* Intro Column*/}
                    <div className="col-md-8 offset-md-2">
                <span className="common-UppercaseTitle">
                    Welcome to Ignite
                </span>
                        <h1 className="common-PageTitle">Build the next great App</h1>
                        <p className="common-IntroText">
                            Our course on full stack development will teach you all the core concepts necessary to have
                            a firm
                            understanding of modern day development practices. We've designed a program that helps to
                            accelerate
                            you through all the stages of software development from project planning to future
                            maintenance.
                        </p>
                    </div>
                </div>
                <section id="developers-section" className="py-4">
                    <div className="row">
                        <div className="col-md-4 offset-md-3 col-sm-5 offset-sm-1 pl-3" id="flexible-learning">
                            <img src="https://stripe.com/img/v3/customers/section-icons/sharing.svg" width="66"
                                 height="66" alt="Network grid"/>
                            <h2 className="common-UppercaseText mt-4">
                                Flexible Learning
                            </h2>
                            <p className="common-BodyText">
                                Learning a new skill doesn’t have to interrupt your busy schedule. Our on-demand videos
                                and
                                interactive code challenges are there for you when you need them. Keep your day job
                                while you
                                hone your development skills at your own pace.
                            </p>
                            <Link className="common-BodyText common-Link common-Link--arrow" to="/">
                                Learn about Ignite's products
                            </Link>
                        </div>
                        <div className="col-md-4 col-sm-5 pl-3">
                            <img src="https://stripe.com/img/v3/customers/section-icons/platforms.svg" width="66"
                                 height="66" alt="Stack of squares"/>
                            <h2 className="common-UppercaseText mt-4">
                                Modern Stack
                            </h2>
                            <p className="common-BodyText">
                                Technology changes fast. Our course adapts to the constantly shifting technological
                                landscape
                                and provides up to date information on how to develop modern full stack applications
                                with a suite
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
                                stack development
                                is hard. There is a plethora of information and mis-information out there on the right
                                way to develop modern
                                web applications. In our current age we demand that apps be more reliable, resilient,
                                available, and responsive
                                then ever before. Ignite's courses teach you how to code, create, deploy, and maintain
                                modern day full stack
                                applications in production.
                            </p>
                        </div>
                        <div className="col-md-6">
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
                        <div className="col-md-4 offset-md-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mt-4" width="366" height="168" viewBox="0 0 366 168" fill="none">
                                <rect x="35" y="58" width="70" height="12" rx="3" fill="#FFD33D"/>
                                <rect x="26" y="5" width="54" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="86" y="5" width="84" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="26" y="19" width="74" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="106" y="19" width="24" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="26" y="33" width="27" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="52" y="48" width="33" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="136" y="19" width="73" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="39" y="62" width="62" height="4" rx="2" fill="#6A737D"/>
                                <rect x="94" y="132" width="95" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="77" y="132" width="11" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="74" y="146" width="65" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="57" y="146" width="11" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="145" y="146" width="59" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="93" y="160" width="25" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="26" y="160" width="61" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="124" y="160" width="59" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="91" y="48" width="97" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="111" y="62" width="97" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="59" y="33" width="145" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="210" y="33" width="9" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="225" y="33" width="94" height="4" rx="2" fill="#D1D5DA"/>
                                <g filter="url(#filter0_d)">
                                    <path d="M45 80.9074C45 78.6983 46.7909 76.9074 49 76.9074H67.075C67.9767 76.9074 68.8306 76.5018 69.4003 75.8028L72.5 72L75.1028 75.6494C75.6658 76.4388 76.5756 76.9074 77.5452 76.9074H358C360.209 76.9074 362 78.6983 362 80.9074V121C362 123.209 360.209 125 358 125H49C46.7909 125 45 123.209 45 121V80.9074Z" fill="white"/>
                                    <path d="M361.5 80.9074V121C361.5 122.933 359.933 124.5 358 124.5H49C47.067 124.5 45.5 122.933 45.5 121V80.9074C45.5 78.9744 47.067 77.4074 49 77.4074H67.075C68.127 77.4074 69.1232 76.9342 69.7879 76.1187L72.4735 72.8239L74.6957 75.9397C75.3525 76.8607 76.414 77.4074 77.5452 77.4074H358C359.933 77.4074 361.5 78.9744 361.5 80.9074Z" stroke="#E1E4E8"/>
                                </g>
                                <path d="M60.5225 116.161C61.9678 116.161 62.9932 115.15 62.9932 113.734C62.9932 112.367 62.0215 111.376 60.6787 111.376C59.8389 111.376 59.1504 111.776 58.8037 112.46H58.7256C58.7744 110.585 59.4238 109.569 60.5713 109.569C61.2646 109.569 61.7969 109.97 61.9873 110.629H62.8906C62.666 109.496 61.7773 108.788 60.5811 108.788C58.8574 108.788 57.8711 110.175 57.8711 112.597C57.8711 113.373 57.9834 114.022 58.2129 114.56C58.6523 115.595 59.4629 116.161 60.5225 116.161ZM60.5127 115.39C59.6094 115.39 58.9209 114.677 58.9209 113.734C58.9209 112.802 59.5898 112.138 60.5225 112.138C61.4551 112.138 62.1045 112.802 62.1045 113.764C62.1045 114.687 61.416 115.39 60.5127 115.39ZM66.8994 116.161C68.3447 116.161 69.3701 115.15 69.3701 113.734C69.3701 112.367 68.3984 111.376 67.0557 111.376C66.2158 111.376 65.5273 111.776 65.1807 112.46H65.1025C65.1514 110.585 65.8008 109.569 66.9482 109.569C67.6416 109.569 68.1738 109.97 68.3643 110.629H69.2676C69.043 109.496 68.1543 108.788 66.958 108.788C65.2344 108.788 64.248 110.175 64.248 112.597C64.248 113.373 64.3604 114.022 64.5898 114.56C65.0293 115.595 65.8398 116.161 66.8994 116.161ZM66.8896 115.39C65.9863 115.39 65.2979 114.677 65.2979 113.734C65.2979 112.802 65.9668 112.138 66.8994 112.138C67.832 112.138 68.4814 112.802 68.4814 113.764C68.4814 114.687 67.793 115.39 66.8896 115.39Z" fill="#6A737D"/>
                                <path d="M78.4121 93.499L81 84.6465H80.2578L77.6699 93.499H78.4121Z" fill="#D1D5DA"/>
                                <rect x="57" y="87" width="17" height="4" rx="2" fill="#D1D5DA"/>
                                <rect x="88" y="110" width="20" height="4" rx="2" fill="#D73A49"/>
                                <rect x="111" y="110" width="50" height="4" rx="2" fill="#6F42C1"/>
                                <rect x="164" y="110" width="29" height="4" rx="2" fill="#FC934A"/>
                                <rect x="196" y="110" width="39" height="4" rx="2" fill="#FC934A"/>
                                <rect x="238" y="110" width="29" height="4" rx="2" fill="#FC934A"/>
                                <rect x="85" y="87" width="37" height="4" rx="2" fill="#D1D5DA"/>
                                <path d="M126.412 93.499L129 84.6465H128.258L125.67 93.499H126.412Z" fill="#D1D5DA"/>
                                <path d="M293.819 89.5479V88.7744H291.248V89.4688H293.032V89.6226C293.032 90.6948 292.263 91.4199 291.129 91.4199C289.855 91.4199 289.064 90.4268 289.064 88.8271C289.064 87.2495 289.868 86.2388 291.125 86.2388C292.065 86.2388 292.703 86.6914 292.975 87.5483H293.779C293.551 86.2915 292.531 85.5093 291.125 85.5093C289.389 85.5093 288.251 86.8232 288.251 88.8271C288.251 90.8574 289.372 92.1494 291.125 92.1494C292.747 92.1494 293.819 91.1123 293.819 89.5479Z" fill="#0366D6"/>
                                <path d="M297.071 92.0835C298.42 92.0835 299.255 91.1519 299.255 89.6313C299.255 88.1064 298.42 87.1792 297.071 87.1792C295.722 87.1792 294.887 88.1064 294.887 89.6313C294.887 91.1519 295.722 92.0835 297.071 92.0835ZM297.071 91.4023C296.174 91.4023 295.669 90.752 295.669 89.6313C295.669 88.5063 296.174 87.8604 297.071 87.8604C297.967 87.8604 298.473 88.5063 298.473 89.6313C298.473 90.752 297.967 91.4023 297.071 91.4023Z" fill="#0366D6"/>
                                <path d="M303.298 86.0366V87.2627H302.533V87.8955H303.298V90.7695C303.298 91.6748 303.689 92.0352 304.665 92.0352C304.814 92.0352 304.959 92.0176 305.108 91.9912V91.354C304.968 91.3672 304.893 91.3716 304.757 91.3716C304.265 91.3716 304.054 91.1343 304.054 90.5762V87.8955H305.108V87.2627H304.054V86.0366H303.298Z" fill="#0366D6"/>
                                <path d="M308.127 92.0835C309.477 92.0835 310.312 91.1519 310.312 89.6313C310.312 88.1064 309.477 87.1792 308.127 87.1792C306.778 87.1792 305.943 88.1064 305.943 89.6313C305.943 91.1519 306.778 92.0835 308.127 92.0835ZM308.127 91.4023C307.231 91.4023 306.726 90.752 306.726 89.6313C306.726 88.5063 307.231 87.8604 308.127 87.8604C309.024 87.8604 309.529 88.5063 309.529 89.6313C309.529 90.752 309.024 91.4023 308.127 91.4023Z" fill="#0366D6"/>
                                <path d="M315.792 92.0835C316.446 92.0835 317.009 91.7715 317.308 91.2441H317.378V92H318.099V85.3818H317.343V88.0098H317.277C317.009 87.4912 316.451 87.1792 315.792 87.1792C314.587 87.1792 313.801 88.146 313.801 89.6313C313.801 91.1211 314.579 92.0835 315.792 92.0835ZM315.967 87.8604C316.824 87.8604 317.36 88.5459 317.36 89.6313C317.36 90.7256 316.829 91.4023 315.967 91.4023C315.102 91.4023 314.583 90.7388 314.583 89.6313C314.583 88.5283 315.106 87.8604 315.967 87.8604Z" fill="#0366D6"/>
                                <path d="M321.456 87.8472C322.208 87.8472 322.708 88.4009 322.726 89.2402H320.116C320.173 88.4009 320.7 87.8472 321.456 87.8472ZM322.704 90.7739C322.506 91.1914 322.093 91.4155 321.482 91.4155C320.678 91.4155 320.155 90.8223 320.116 89.8862V89.8511H323.521V89.561C323.521 88.0889 322.744 87.1792 321.465 87.1792C320.164 87.1792 319.329 88.146 319.329 89.6357C319.329 91.1343 320.151 92.0835 321.465 92.0835C322.502 92.0835 323.231 91.5869 323.46 90.7739H322.704Z" fill="#0366D6"/>
                                <path d="M325.024 92H325.78V87.8955H326.866V87.2627H325.78V86.7573C325.78 86.2388 326.009 85.9751 326.554 85.9751C326.69 85.9751 326.817 85.9795 326.91 85.9971V85.3818C326.751 85.3511 326.584 85.3379 326.4 85.3379C325.499 85.3379 325.024 85.7905 325.024 86.7354V87.2627H324.238V87.8955H325.024V92Z" fill="#0366D6"/>
                                <path d="M327.986 92H328.742V87.2627H327.986V92ZM328.364 86.3003C328.654 86.3003 328.892 86.063 328.892 85.7729C328.892 85.4829 328.654 85.2456 328.364 85.2456C328.074 85.2456 327.837 85.4829 327.837 85.7729C327.837 86.063 328.074 86.3003 328.364 86.3003Z" fill="#0366D6"/>
                                <path d="M330.184 92H330.939V89.1963C330.939 88.3657 331.427 87.8604 332.183 87.8604C332.939 87.8604 333.299 88.2646 333.299 89.1172V92H334.055V88.9326C334.055 87.8076 333.462 87.1792 332.398 87.1792C331.673 87.1792 331.212 87.4868 330.975 88.0098H330.904V87.2627H330.184V92Z" fill="#0366D6"/>
                                <path d="M335.457 92H336.213V87.2627H335.457V92ZM335.835 86.3003C336.125 86.3003 336.362 86.063 336.362 85.7729C336.362 85.4829 336.125 85.2456 335.835 85.2456C335.545 85.2456 335.308 85.4829 335.308 85.7729C335.308 86.063 335.545 86.3003 335.835 86.3003Z" fill="#0366D6"/>
                                <path d="M337.971 86.0366V87.2627H337.206V87.8955H337.971V90.7695C337.971 91.6748 338.362 92.0352 339.337 92.0352C339.487 92.0352 339.632 92.0176 339.781 91.9912V91.354C339.641 91.3672 339.566 91.3716 339.43 91.3716C338.938 91.3716 338.727 91.1343 338.727 90.5762V87.8955H339.781V87.2627H338.727V86.0366H337.971Z" fill="#0366D6"/>
                                <path d="M340.941 92H341.697V87.2627H340.941V92ZM341.319 86.3003C341.609 86.3003 341.847 86.063 341.847 85.7729C341.847 85.4829 341.609 85.2456 341.319 85.2456C341.029 85.2456 340.792 85.4829 340.792 85.7729C340.792 86.063 341.029 86.3003 341.319 86.3003Z" fill="#0366D6"/>
                                <path d="M345.085 92.0835C346.435 92.0835 347.27 91.1519 347.27 89.6313C347.27 88.1064 346.435 87.1792 345.085 87.1792C343.736 87.1792 342.901 88.1064 342.901 89.6313C342.901 91.1519 343.736 92.0835 345.085 92.0835ZM345.085 91.4023C344.189 91.4023 343.684 90.752 343.684 89.6313C343.684 88.5063 344.189 87.8604 345.085 87.8604C345.982 87.8604 346.487 88.5063 346.487 89.6313C346.487 90.752 345.982 91.4023 345.085 91.4023Z" fill="#0366D6"/>
                                <path d="M348.456 92H349.212V89.1963C349.212 88.3657 349.7 87.8604 350.456 87.8604C351.211 87.8604 351.572 88.2646 351.572 89.1172V92H352.328V88.9326C352.328 87.8076 351.734 87.1792 350.671 87.1792C349.946 87.1792 349.484 87.4868 349.247 88.0098H349.177V87.2627H348.456V92Z" fill="#0366D6"/>
                                <rect x="75" y="62" width="11.9444" height="12.5" fill="url(#pattern0)"/>
                                <rect x="133" y="87" width="37" height="4" rx="2" fill="#586069"/>
                                <line x1="45" y1="98.5" x2="361" y2="98.5" stroke="#E1E4E8"/>
                                <path d="M8.80273 11H9.68164V3.9541H8.80762L6.93262 5.30176V6.22949L8.72461 4.93066H8.80273V11ZM5.69727 19.9365V19.9414H6.54688V19.9365C6.54688 19.1064 7.10352 18.5547 7.92871 18.5547C8.70508 18.5547 9.30566 19.0967 9.30566 19.7998C9.30566 20.3662 9.08594 20.7471 8.17773 21.7334L5.74121 24.3945V25H10.3018V24.209H7.00098V24.1309L8.69531 22.3096C9.85254 21.0693 10.1846 20.498 10.1846 19.7656C10.1846 18.6475 9.21777 17.7881 7.95312 17.7881C6.64453 17.7881 5.69727 18.6865 5.69727 19.9365ZM6.95703 35.7529H7.85059C8.85156 35.7529 9.47168 36.2607 9.47168 37.0762C9.47168 37.8477 8.8125 38.3994 7.88477 38.3994C6.97656 38.3994 6.3418 37.916 6.26367 37.1641H5.41406C5.47754 38.3701 6.46387 39.166 7.89453 39.166C9.28613 39.166 10.375 38.2627 10.375 37.1006C10.375 36.1387 9.79395 35.4746 8.83691 35.3525V35.2744C9.6084 35.0889 10.0723 34.4736 10.0723 33.6338C10.0723 32.6084 9.09082 31.7881 7.86035 31.7881C6.51758 31.7881 5.64355 32.54 5.55566 33.7607H6.41016C6.4834 33.0039 7.01562 32.5547 7.82617 32.5547C8.63672 32.5547 9.17871 33.0332 9.17871 33.751C9.17871 34.4834 8.6123 35.001 7.81152 35.001H6.95703V35.7529ZM8.56836 53H9.42773V51.54H10.4287V50.7539H9.42773V45.9541H8.15332C6.88379 47.8535 5.76562 49.6211 5.13574 50.7393V51.54H8.56836V53ZM6.03418 50.7002C6.87402 49.2744 7.79199 47.8193 8.51465 46.7695H8.57324V50.7588H6.03418V50.7002ZM7.91895 67.166C9.37891 67.166 10.3799 66.1895 10.3799 64.7588C10.3799 63.3721 9.44238 62.4004 8.10449 62.4004C7.45508 62.4004 6.95703 62.6006 6.61523 63.001H6.53711L6.7373 60.7402H9.97949V59.9541H6.04883L5.66309 63.9482H6.48828C6.77637 63.4453 7.30371 63.1572 7.94336 63.1572C8.86621 63.1572 9.50098 63.8164 9.50098 64.7832C9.50098 65.75 8.87109 66.3945 7.92871 66.3945C7.09863 66.3945 6.49316 65.8867 6.41504 65.125H5.55078C5.62891 66.3408 6.58594 67.166 7.91895 67.166ZM7.89941 81.1611C9.34473 81.1611 10.3701 80.1504 10.3701 78.7344C10.3701 77.3672 9.39844 76.376 8.05566 76.376C7.21582 76.376 6.52734 76.7764 6.18066 77.46H6.10254C6.15137 75.585 6.80078 74.5693 7.94824 74.5693C8.6416 74.5693 9.17383 74.9697 9.36426 75.6289H10.2676C10.043 74.4961 9.1543 73.7881 7.95801 73.7881C6.23438 73.7881 5.24805 75.1748 5.24805 77.5967C5.24805 78.373 5.36035 79.0225 5.58984 79.5596C6.0293 80.5947 6.83984 81.1611 7.89941 81.1611ZM7.88965 80.3896C6.98633 80.3896 6.29785 79.6768 6.29785 78.7344C6.29785 77.8018 6.9668 77.1377 7.89941 77.1377C8.83203 77.1377 9.48145 77.8018 9.48145 78.7637C9.48145 79.6865 8.79297 80.3896 7.88965 80.3896ZM6.37598 95H7.29883L10.4336 88.7695V87.9541H5.77051V88.7402H9.54004V88.8086L6.37598 95ZM7.80664 109.166C9.30078 109.166 10.3457 108.321 10.3457 107.115C10.3457 106.197 9.76465 105.484 8.88086 105.318V105.24C9.6084 105.04 10.0576 104.439 10.0576 103.668C10.0576 102.569 9.125 101.788 7.80664 101.788C6.48828 101.788 5.55566 102.569 5.55566 103.668C5.55566 104.435 6.01465 105.045 6.73242 105.24V105.318C5.84863 105.484 5.26758 106.197 5.26758 107.115C5.26758 108.321 6.3125 109.166 7.80664 109.166ZM7.80664 108.414C6.83008 108.414 6.15625 107.857 6.15625 107.052C6.15625 106.246 6.83008 105.689 7.80664 105.689C8.7832 105.689 9.45703 106.246 9.45703 107.052C9.45703 107.857 8.7832 108.414 7.80664 108.414ZM7.80664 104.947C6.97656 104.947 6.41992 104.469 6.41992 103.751C6.41992 103.023 6.97168 102.54 7.80664 102.54C8.6416 102.54 9.19336 103.023 9.19336 103.751C9.19336 104.469 8.63672 104.947 7.80664 104.947ZM7.66016 123.161C9.38379 123.161 10.3701 121.774 10.3701 119.353C10.3701 118.576 10.2578 117.927 10.0283 117.39C9.58887 116.35 8.77344 115.788 7.71875 115.788C6.27344 115.788 5.24805 116.799 5.24805 118.215C5.24805 119.582 6.21973 120.573 7.5625 120.573C8.40234 120.573 9.09082 120.173 9.4375 119.489H9.45703H9.47656H9.51562C9.4668 121.364 8.81738 122.38 7.66992 122.38C6.97656 122.38 6.44434 121.979 6.25391 121.32H5.35059C5.5752 122.453 6.46387 123.161 7.66016 123.161ZM7.71875 119.812C6.78613 119.812 6.13672 119.147 6.13672 118.186C6.13672 117.263 6.8252 116.56 7.72852 116.56C8.63184 116.56 9.32031 117.272 9.32031 118.215C9.32031 119.147 8.65137 119.812 7.71875 119.812ZM2.50391 137H3.38281V129.954H2.50879L0.633789 131.302V132.229L2.42578 130.931H2.50391V137ZM7.85547 137.166C9.4375 137.166 10.3457 135.828 10.3457 133.489C10.3457 131.155 9.42285 129.788 7.85547 129.788C6.27832 129.788 5.35547 131.15 5.35547 133.475C5.35547 135.818 6.26855 137.166 7.85547 137.166ZM7.85547 136.399C6.81543 136.399 6.23926 135.359 6.23926 133.475C6.23926 131.614 6.8252 130.56 7.85547 130.56C8.88574 130.56 9.46191 131.604 9.46191 133.475C9.46191 135.364 8.89551 136.399 7.85547 136.399ZM4.13477 151H5.01367V143.954H4.13965L2.26465 145.302V146.229L4.05664 144.931H4.13477V151ZM8.80273 151H9.68164V143.954H8.80762L6.93262 145.302V146.229L8.72461 144.931H8.80273V151ZM2.75781 165H3.63672V157.954H2.7627L0.887695 159.302V160.229L2.67969 158.931H2.75781V165ZM5.69727 159.937V159.941H6.54688V159.937C6.54688 159.106 7.10352 158.555 7.92871 158.555C8.70508 158.555 9.30566 159.097 9.30566 159.8C9.30566 160.366 9.08594 160.747 8.17773 161.733L5.74121 164.395V165H10.3018V164.209H7.00098V164.131L8.69531 162.31C9.85254 161.069 10.1846 160.498 10.1846 159.766C10.1846 158.647 9.21777 157.788 7.95312 157.788C6.64453 157.788 5.69727 158.687 5.69727 159.937Z" fill="#D1D5DA"/>
                                <defs>
                                    <filter id="filter0_d" x="41" y="72" width="325" height="61" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                                        <feOffset dy="4"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                                    </filter>
                                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use transform="scale(0.0232558 0.0222222)"/>
                                    </pattern>
                                    <image id="image0" width="43" height="45" href="data:image/png;base64,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"/>
                                </defs>
                            </svg>
                        </div>
                        <div className="col-md-5 pb-3 pr-3">
                            <h1 className="common-UppercaseTitle mt-3">
                                Course Overview
                            </h1>
                            <p className="common-BodyText common-BodyText-dark">
                                With ignite you will learn end to end full stack development using popular open source
                                technologies and libraries like Git, React, NodeJS, Postgres, Express, and JQuery among
                                others!
                                The course takes you through everything from setting up your local development
                                environment,
                                to testing, continuous integration, live deployments, project management, and Cloud
                                providers
                                like <Link to="https://aws.amazon.com">Amazon Web Services</Link>. This course can help
                                launch your career in a completely different
                                direction or simply give you the skills necessary to take on web contracting work from
                                places
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
                                 like a full stack develop and they can conquer any problem they are faced with."
                                by="Christian Bartram"
                            />
                        </div>
                    </div>
                </section>
                <section id="run-your-business-on-stripe" className="features section bg-slate-9">
                    <div className="container-lg section-intro">
                        <h2 className="common-SectionTitle">
                            Learn Full Stack from Beginning to End
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
