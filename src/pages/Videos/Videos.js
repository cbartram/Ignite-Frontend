import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import Card from 'react-bootstrap/Card';
import _ from 'lodash';
import { Loader, Dimmer } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'
import {
    updateActiveVideo,
    getSignedUrl,
    findQuestions,
} from '../../actions/actions';
import { IS_PROD } from "../../constants";
import Jumbotron from "../../components/Card/Card";
import Log from '../../Log';
import './Videos.css';
import withContainer from "../../components/withContainer";

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user,
    videos: state.videos,
    quizzes: state.quizzes,
});

const mapDispatchToProps = dispatch => ({
    updateActiveVideo: (name) => dispatch(updateActiveVideo(name)),
    getSignedUrl: (payload) => dispatch(getSignedUrl(payload)),
    findQuestions: (payload) => dispatch(findQuestions(payload)),
});

/**
 * This Component handles showing the user all
 * the full stack development videos they can choose from. It is responsible
 * for pre-loading all of the information about a chosen video such as
 * the signed url, the questions/answers, and the active video
 */
class Videos extends Component {
    constructor(props) {
        super(props);

        // Retains access to the iteration for each loop in
        // the videos map(). This tells us when we can render a quiz (at the end of a chapter)
        this.iter = 0;
        this.state = {
            isLoading: false,
            loadingVideo: null, // The id of the video that is loading
            gradients: [
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
            ]
        }
    }

    componentDidMount() {
        if(this.props.location.search) this.props.pushAlert('info', 'Select a Video', 'You need to select a new video to watch!');
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
        this.setState({ isLoading: true, loadingVideo: `${video.chapter}.${video.sortKey}` }, async () => {
            try {
                await this.props.getSignedUrl({
                    video,
                    resourceUrl: `${IS_PROD ? 'https://d2hhpuhxg00qg.cloudfront.net' : 'https://dpvchyatyxxeg.cloudfront.net'}/chapter${video.chapter}/${video.s3Name}.mov`,
                    jwtToken: this.props.user.jwtToken
                });
                await this.props.findQuestions(`${video.chapter}.${video.sortKey}`);
                this.props.history.push('/watch');
            } catch(err) {
                Log.error(err);
                this.props.pushAlert('danger', 'Oh No!', 'There was an issue retrieving the url for your video refresh the page and try again!');
                this.setState({ isLoading: false, loadingVideo: null });
            }
        });
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
     * @param index Integer the index of the quizArray so that we know to put it as the last item in the array.
     * @returns {*}
     */
    renderQuiz(quizArr, index) {
        if(quizArr.length === 0)
            return null;
        let quiz = quizArr[0];
        return (
            <div className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4 my-4" key={quiz.name}>
                <Card>
                    <div className={`d-flex justify-content-center align-items-center cover ${this.state.gradients[index]}`}>
                        <span className="gradient-text">{quiz.name}</span>
                    </div>
                    <Card.Body className="p-0">
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
                    </Card.Body>
                </Card>
            </div>
        )
    }

    render() {
        // Only returned when history.push('/videos') happens
        if(this.props.videos.isFetching) return <Loader active />;

        if(((!_.isUndefined(this.props.videos.videoList) && _.size(this.props.videos.videoList) === 0) || this.props.auth.user['custom:premium'] === 'false'))
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6 offset-md-4">
                            <h3 className="common-SectionTitle">No Subscription Found</h3>
                            <p className="common-BodyText">
                                It looks like you aren't subscribed to ignite. If you would like to subscribe and
                                watch all the high quality HD full stack development videos you can click the button below!
                            </p>
                        </div>
                    </div>
                    <div className="d-flex mt-3 justify-content-center">
                        <Link to="/pricing" className="common-Button common-Button--default">
                            Subscribe to Watch Videos
                        </Link>
                    </div>
                </div>
            );

        return (
            <div>
                <Jumbotron>
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
                </Jumbotron>
                {
                    this.props.videos.videoList.map((chapter, i) => {
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
                                        // TODO Move the API call to fetch video, and find questions etc... into this file bc we know about the video being clicked
                                        chapter.videos.map((video, index) => {
                                            this.iter = index;
                                            return (
                                                <div className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4 my-4" key={video.name}>
                                                    <Card>
                                                        <Dimmer active={this.state.isLoading && this.state.loadingVideo === `${video.chapter}.${video.sortKey}`}>
                                                            <Loader>Loading</Loader>
                                                        </Dimmer>
                                                        <div className={`d-flex justify-content-center align-items-center cover ${this.state.gradients[i]}`}>
                                                            <span className="gradient-text">{video.name}</span>
                                                        </div>
                                                        <Card.Body className="p-0">
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
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            )
                                        })
                                    }
                                    { Videos.isLastIteration(chapter.videos, this.iter) && this.renderQuiz(this.props.quizzes.quizList.filter(q => q.chapter === chapter.chapter), i) }
                                </div>
                            </div>
                        )
                    })}
            </div>
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(Videos)));
