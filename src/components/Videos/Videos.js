import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Container from '../Container/Container';
import { withRouter } from 'react-router-dom'
import { updateActiveVideo } from '../../actions/actions';
import './Videos.css';
import Card from "../Card/Card";

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos,
    quizzes: state.quizzes,
});

const mapDispatchToProps = dispatch => ({
    updateActiveVideo: (name) => dispatch(updateActiveVideo(name))
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Videos extends Component {
    constructor(props) {
        super(props);

        // Retains access to the iteration for each loop in
        // the videos map(). This tells us when we can render a quiz (at the end of a chapter)
        this.iter = 0;
    }

    /**
     * Renders a message telling users to subscribe in order to watch videos
     */
    static renderSubscribeMessage() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <h3 className="common-SectionTitle">No Subscription Found</h3>
                        <p className="common-BodyText">
                            It looks like you aren't subscribed to ignite. If you would like to subscribe and
                            watch all the high quality HD full stack development videos you can click the button below!
                        </p>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <Link to="/pricing" className="common-Button common-Button--default">
                        Subscribe to Watch Videos
                    </Link>
                </div>
            </div>
        )
    }

    /**
     * Computes the percentage of the video the user has completed given
     * the length of the video and the duration needed to scrub
     * @param length String Length of the video in mm:ss format
     * @param scrubDuration Integer the scrub
     */
    static percentComplete({ length, scrubDuration }) {
        const secondsLength = (moment(length, 'mm:ss').minutes() * 60) + moment(length, 'mm:ss').seconds();
        return ((scrubDuration / secondsLength) * 100).toFixed(0);
    }

    /**
     * Handles a watch now video button being clicked and updating the active
     * video in redux as well as redirecting the user to the /watch page
     * @param video Object The video object representing the video the user
     * wishes to watch (the one that was clicked)
     */
    handleWatch(video) {
        this.props.updateActiveVideo(video);
        // Add the encoded video to the url so if a user refreshes the page we can retrieve the active video
        this.props.history.push(`/watch?v=${btoa(encodeURI(video.name))}`)
    }

    /**
     * Returns the CSS Classname for a randomized gradient to be applied
     * to the card header
     * @returns {string}
     */
    static getRandomGradient() {
        const gradients = [
            'purple-gradient',
            'blue-gradient',
            'aqua-gradient',
            'peach-gradient',
            'warm-flame-gradient',
            'night-fade-gradient',
            'spring-warmth-gradient',
            'juicy-peach-gradient',
            'rainy-ashville-gradient',
            'sunny-morning-gradient',
            'lady-lips-gradient',
            'winter-neva-gradient',
            'frozen-dreams-gradient',
            'dusty-grass-gradient',
            'tempting-azure-gradient',
            'amy-crisp-gradient',
            'mean-fruit-gradient',
            'deep-blue-gradient',
            'ripe-malinka-gradient',
            'morpheus-den-gradient',
            'rare-wind-gradient',
            'near-moon-gradient',
        ];

        return gradients[Math.floor(Math.random() * gradients.length)]
    }

    /**
     * Returns true if the array is on its last iteration given an index
     * @param arr Array
     * @param index Integer index to check
     * @returns {boolean}
     */
    static isLastIteration(arr, index) {
        return index === arr.length - 1;
    }

    /**
     * Renders a quiz card to the DOM
     * @param quizArr Array passed in from quiz.filter() could be []
     * @returns {*}
     */
    renderQuiz(quizArr) {
        if(quizArr.length === 0)
            return null;
        let quiz = quizArr[0];
        return (
            <div className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4" key={quiz.name}>
                <div className={`common-Card-video m-2`}>
                    <div className={`d-flex justify-content-center align-items-center cover ${Videos.getRandomGradient()}`}>
                        <span className="gradient-text">{quiz.name}</span>
                    </div>
                    <div className="d-flex flex-row">
                        <h2 className="common-IntroText mt-0">{quiz.name}</h2>
                        <p className="common-BodyText pt-1 ml-3">
                            {quiz.completed}
                        </p>
                    </div>
                    <div className="d-flex flex-column">
                        <p className="common-BodyText">
                            { quiz.description }
                        </p>
                        {
                            quiz.complete &&
                            <div>
                                <div className="progress" style={{height: 5 }}>
                                    <div className="progress-bar" role="progressbar" style={{width: `${quiz.score}%`, backgroundColor: '#7795f8' }} />
                                </div>
                                <span className="text-muted">
                                    {quiz.score}%
                                 </span>
                            </div>
                        }
                        <Link to={`/quiz?q=${btoa(quiz.id)}${quiz.complete ? '&retake=true' : '' }`} className="common-Button common-Button--default">
                            { quiz.complete ? 'Re-take Quiz' : 'Take Quiz'}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Renders a list of videos a user can choose from to watch.
     * @returns {*}
     */
    renderVideos() {
        if(typeof this.props.videos.videoList !== 'undefined') {
            return (
                <div>
                    <Card>
                        <h3 className="common-SectionTitle">
                            Welcome to Videos
                        </h3>
                        <div className="row">
                            <div className="col-md-8">
                                <p className="common-BodyText">
                                    These videos are a customized list of chapters, quizzes and workshops that provide a guided learning path for a particular subject.
                                    Each course or quiz in a chapter builds on the previous one, so that as you progress through the videos you gain a solid
                                    understanding of the broader topic and how it fits into full stack development.
                                </p>
                            </div>
                            <div className="col-md-3 offset-md-1">
                                <svg width="150" height="150" viewBox="0 0 40 40">
                                    <g stroke="#0CB" strokeWidth="2" fill="none">
                                        <path d="M4 35c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h32c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H4z" />
                                        <path d="M14 20h8" />
                                        <path d="M8 12l4 3.5L8 19" />
                                    </g>
                                </svg>
                            </div>
                            {/*<svg width="40" height="40">*/}
                                {/*<g stroke="#0CB" strokeWidth="2" fill="none">*/}
                                    {/*<path d="M4 35c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h32c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H4z" strokeDasharray="128.56021118164062" strokeDashoffset="128.56021118164062" style={{opacity: 1}} />*/}
                                    {/*<path d="M14 20h8" strokeDasharray="8" strokeDashoffset="8" style={{opacity: 1 }} />*/}
                                    {/*<path d="M8 12l4 3.5L8 19" strokeDasharray="10.630146026611328" strokeDashoffset="10.630146026611328" style={{ opacity: 1 }} />*/}
                                {/*</g>*/}
                            {/*</svg>*/}
                        </div>
                    </Card>
                    { this.props.videos.videoList.map(chapter => {
                    return (
                        <div key={chapter.title}>
                            <div className="d-flex flex-row justify-content-start">
                                <h2 className="common-UppercaseTitle big-font ml-4">
                                    { chapter.title } - {moment.utc(chapter.videos.map(video => (moment(video.length, 'mm:ss').minutes() * 60) + moment(video.length, 'mm:ss').seconds()).reduce((a, b) => a + b) * 1000).format('mm:ss') }
                                </h2>
                                <hr />
                            </div>
                            <div className="row">
                                {
                                    chapter.videos.map((video, index) => {
                                        this.iter = index;
                                        return (
                                                <div className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4" key={video.name}>
                                                    <div className="common-Card-video m-2">
                                                        <div className={`d-flex justify-content-center align-items-center cover ${Videos.getRandomGradient()}`}>
                                                            <span className="gradient-text">{video.name}</span>
                                                        </div>
                                                        <div className="d-flex flex-row">
                                                            <h2 className="common-IntroText mt-0">{video.name}</h2>
                                                            <p className="common-BodyText pt-1 ml-3">
                                                                {video.length}
                                                            </p>
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <p className="common-BodyText">
                                                                { video.description }
                                                            </p>
                                                            <div className="progress" style={{height: 5 }}>
                                                                <div className="progress-bar" role="progressbar" style={{width: `${Videos.percentComplete(video)}%`, backgroundColor: '#7795f8' }} />
                                                            </div>
                                                            <span className="text-muted">
                                                                 { Videos.percentComplete(video) <= 1 ? 'Not Started' : `${Videos.percentComplete(video) > 100 ? 100 : Videos.percentComplete(video)}% complete!`}
                                                            </span>
                                                            <button onClick={() => this.handleWatch(video)} className="common-Button common-Button--default mt-2">
                                                                { Videos.percentComplete(video) <= 1 ?  'Start Now' : 'Continue'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                        )
                                    })
                                }
                                { Videos.isLastIteration(chapter.videos, this.iter) && this.renderQuiz(this.props.quizzes.quizList.filter(q => q.chapter === chapter.chapter)) }
                            </div>
                        </div>
                    )
                }) }
                </div>
            );
        }
    }

    render() {
        if(this.props.videos.isFetching)
            return (
                <Container>
                    <div className="d-flex justify-content-center mt-5">
                        <i className="fas fa-7x fa-circle-notch" style={{ color: '#6772e5' }} />
                    </div>
                </Container>
            );

        return (
            <Container>
                {
                    // Only render an error message if its their first time logging in and they dont have videos or they arent premium
                    ((typeof this.props.videos.videoList !== 'undefined' && this.props.videos.videoList.length === 0) || this.props.auth.user['custom:premium'] === 'false') &&
                    Videos.renderSubscribeMessage()
                }
                {
                    // Render a success message on the condition that there is a video list and videos to show and the user is premium
                    (typeof this.props.videos.videoList !== 'undefined' && this.props.videos.videoList.length > 0 && this.props.auth.user['custom:premium'] === 'true') &&
                     this.renderVideos()
                }
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Videos));
