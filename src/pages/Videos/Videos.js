import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import _ from 'lodash';
import {
    Loader,
    Dimmer,
    Menu,
    Sticky,
    Dropdown,
    Popup,
    Placeholder,
    Responsive,
} from 'semantic-ui-react';
import { Card } from 'react-bootstrap';
import { withCookies } from 'react-cookie';
import { scroller } from 'react-scroll';
import { withRouter } from 'react-router-dom'
import {
    updateActiveVideo,
    getSignedUrl,
    findQuestions,
    ping,
} from '../../actions/actions';
import { IS_PROD, MAX_RECENTLY_WATCHED_VIDEOS } from "../../constants";
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
    ping: (payload) => dispatch(ping(payload)),
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
        this.stickyRef = React.createRef();
        this.state = {
            isLoading: false,
            loadingVideo: null, // The id of the video that is loading
            activeChapter: 0,
            recentlyWatched: [],
        }
    }

    async componentDidMount() {
        if (this.props.location.search) this.props.pushAlert('info', 'Select a Video', 'You need to select a new video to watch!');

        // Only try cookies if the user is premium and there are cookies to try
        if(this.props.user.premium && !_.isUndefined(this.props.cookies.get('_recent'))) {
            // Retrieve the video given the VID from a cookie and dynamically load its respective thumbnail image
            const promises = [];
            let recentlyWatched = [];

            this.props.cookies.get('_recent').forEach(vid => {
                // Get the video given the vid
                const chapter = +vid.split('.')[0];
                const key = +vid.split('.')[1];

                const {videos} = this.props.videos.videoList.find(c => c.chapter === chapter);

                if (!_.isUndefined(videos)) {
                    const video = videos.find(({sortKey}) => sortKey === key);
                    // Load the thumbnail for this image
                    promises.push(import(`../../resources/images/thumbnails/${video.s3Name}.jpg`));
                    recentlyWatched.push(video);
                } else {
                    Log.warn('Chapter was undefined for videos: ', this.props.videos, chapter, key)
                }
            });

            const images = await Promise.all(promises);
            recentlyWatched = recentlyWatched.map((v, i) => {
                return {
                    ...v,
                    percentComplete: Videos.percentComplete(v),
                    image: images[i].default,
                }
            });


            this.setState({ recentlyWatched: recentlyWatched });
        }
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
     * Note: the video the user selects won't become their "active" video until 30 seconds have passed with them watching it
     */
    handleWatch(video) {
        const vid = `${video.chapter}.${video.sortKey}`;
        this.setState({ isLoading: true, loadingVideo: vid }, async () => {
            try {
                await this.props.getSignedUrl({
                    video,
                    resourceUrl: `${IS_PROD ? 'https://d2hhpuhxg00qg.cloudfront.net' : 'https://dpvchyatyxxeg.cloudfront.net'}/chapter${video.chapter}/${video.s3Name}.mov`,
                    subscriptionId: this.props.user.subscription_id,
                });
                await this.props.findQuestions(vid);

                // Update recently watched cookie with this videos name
                if(_.isUndefined(this.props.cookies.get('_recent'))) {
                    this.props.cookies.set('_recent', [vid]);
                    // If there are already 4 videos in the cookie put this video first and slice off the end
                } else if(this.props.cookies.get('_recent').length >= MAX_RECENTLY_WATCHED_VIDEOS) {
                    let recentlyWatched = this.props.cookies.get('_recent');

                    // Remove Uniques & Shift
                    recentlyWatched.unshift(vid);
                    recentlyWatched = _.uniq(recentlyWatched);
                    recentlyWatched.length = MAX_RECENTLY_WATCHED_VIDEOS;
                    this.props.cookies.set('_recent', recentlyWatched)
                } else {
                    // User has watched between 1 and 3 videos
                    const recentlyWatched = this.props.cookies.get('_recent');
                    recentlyWatched.unshift(vid);
                    this.props.cookies.set('_recent', recentlyWatched)
                }

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
     * Shows a large message on the UI and displays skeleton
     * videos for either loading or unauthorized users.
     */
    renderJumbotron(authorized = false, isLoading = false) {
        let text = '';
        if(isLoading) {
            text = 'Checking your subscription status....It\'ll just be a moment'
        } else if(!authorized) {
            text = ' It looks like you aren\'t subscribed to ignite. If you would like to subscribe and' +
                ' watch all the high quality HD full stack development videos you can click the button below! If you have already subscribed and are seeing' +
                ' this message something may have gone wrong. Refresh the page or try logging out and logging back in.'
        }

        return (
            <div className="p-3 d-flex flex-column align-items-center">
                <h3 className="common-SectionTitle">
                    { !authorized && 'No subscription found'}
                </h3>
                <div className="row d-flex flex-column align-items-center">
                    <div className="col-md-8">
                        <p className="common-BodyText">
                            { text }
                        </p>
                        {
                            !authorized &&
                            <div className="d-flex flex-column align-items-center">
                                <Link to="/pricing" className="common-Button common-Button--default">
                                    Subscribe
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            <div className="row">
                {
                    !authorized && _.times(8, () => {
                        return (
                            <div className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4 my-4" key={_.uniqueId('placeholder_')}>
                                <section className="btn btn-flat btn-flat-no-hover">
                                    <Placeholder style={{ minWidth: '200px' }}>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line length='medium' />
                                            <Placeholder.Line length='short' />
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </section>
                            </div>
                        )
                    })
                }
            </div>
            </div>
        )
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
                <button type="button" className="btn btn-flat btn-quiz" onClick={() => this.props.history.push(`/quiz?q=${btoa(quiz.id)}${quiz.complete ? '&retake=true' : '' }`)}>
                    <div className="d-flex mb-2">
                        <h5 className="btn-flat-title">{quiz.name}</h5>
                        <span className="badge badge-pill badge-success px-3 ml-auto" style={{ paddingTop: 9 }}><strong>Quiz</strong></span>
                    </div>
                    <span>
                       { quiz.description }
                    </span>
                    <h5 className="mt-2">{ quiz.questions.length } Questions</h5>
                    <Popup
                        trigger={
                            <div className="progress" style={{height: 7 }}>
                                <div className="progress-bar" role="progressbar" style={{width: `${quiz.score}%`, backgroundColor: '#3ecf8e' }} />
                            </div>
                        }
                        content={quiz.complete ? `You scored a ${quiz.score}% on this quiz.` : 'You haven\'t taken this quiz yet!'}
                        position="bottom center"
                    />
                </button>
            </div>
        )
    }

    /**
     * Scrolls to the designated chapter on the page
     * @param chapterIndex
     */
    chapterScroll(chapterIndex) {
        this.setState({ activeChapter: chapterIndex });
        scroller.scrollTo(chapterIndex, {
            duration: 1500,
            delay: 100,
            smooth: true,
            offset: -70
        });
    }

    render() {
        // Only returned when history.push('/videos') happens
        if(this.props.videos.isFetching)
            return this.renderJumbotron(false, true);


        if(!this.props.user.premium)
            return this.renderJumbotron(); // Not authorized not loading

        return (
            <div ref={this.stickyRef}>
                { this.renderJumbotron(true) }

                <div className="p-4">
                    <h3 className="common-SectionTitle">
                        Recently Watched
                    </h3>
                    <div className="row">
                        {
                            this.state.recentlyWatched.length === 0 ?
                                <div className="col-md-5 offset-md-4 d-flex flex-column align-items-center justify-content-center p-4">
                                    <i className="fas fa-5x fa-video d-none d-md-block mb-3" />
                                    <p className="common-BodyText" align="center">
                                        You haven't watched any videos yet!
                                    </p>
                                </div>
                            :
                            this.state.recentlyWatched.map(video => {
                                return (
                                    <div key={_.uniqueId('recent_video_')} className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4 my-4">
                                        <Card>
                                            <Dimmer active={this.state.isLoading && this.state.loadingVideo === `${video.chapter}.${video.sortKey}`}>
                                                <Loader>Loading</Loader>
                                            </Dimmer>
                                            <Card.Img variant="top" src={video.image} />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title>{ video.name }</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{ video.length }</Card.Subtitle>
                                                <Card.Text>
                                                    { video.description }
                                                </Card.Text>
                                                <div className="progress" style={{height: 5 }}>
                                                    <div className="progress-bar" role="progressbar" style={{width: `${video.percentComplete}%`, backgroundColor: '#7795f8' }} />
                                                </div>
                                                <span className="text-muted">
                                                   { video.percentComplete <= 1 ? 'Not Started' : `${video.percentComplete}% complete!`}
                                                 </span>
                                                <button onClick={() => this.handleWatch(video)} className="common-Button btn-block common-Button--default mt-auto">
                                                    { video.percentComplete <= 1 ?  'Start Now' : 'Continue'}
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <Sticky context={this.stickyRef} pushing>
                    <Responsive minWidth={768}>
                        <Menu fluid pointing secondary widths={7}>
                            {
                                _.times(7, i => {
                                    if(i === 6) {
                                        return (
                                            <Dropdown key={_.uniqueId('chapter_link_item')} text="More" className="link item">
                                                <Dropdown.Menu>
                                                    {
                                                        _.times(this.props.videos.videoList.length - 6, idx => {
                                                            return <Dropdown.Item key={idx} onClick={() => this.chapterScroll(idx + 6)}>Chapter {idx + 7}</Dropdown.Item>
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )
                                    }
                                    return <Menu.Item key={_.uniqueId('chapter_menu_item_')} name={`Chapter ${i + 1}`} onClick={() => this.chapterScroll(i)} active={this.state.activeChapter === i} />
                                })
                            }
                        </Menu>
                    </Responsive>
                </Sticky>
                {
                    this.props.videos.videoList.map((chapter, i) => {
                        return (
                            <div key={_.uniqueId('chapter_')} name={i}>
                                <div className="d-flex flex-row justify-content-start">
                                    <h2 className={`common-UppercaseTitle big-font ml-4 mt-${i === 0 ? '4' : '2'}`}>
                                        { chapter.title } - {moment.utc(chapter.videos.map(video => (moment(video.length, 'mm:ss').minutes() * 60) + moment(video.length, 'mm:ss').seconds()).reduce((a, b) => a + b) * 1000).format('mm:ss') }
                                        <hr />
                                    </h2>
                                </div>
                                <div className="row px-4">
                                    {
                                        chapter.videos.map((video, index) => {
                                            this.iter = index;
                                            return (
                                                <div className="col-md-3 col-lg-3 col-sm-12 d-flex align-items-stretch pb-2 px-4 my-4" key={_.uniqueId('video_')}>
                                                    <button type="button" className="btn btn-flat" onClick={() => this.handleWatch(video)}>
                                                        <Dimmer active={this.state.isLoading && this.state.loadingVideo === `${video.chapter}.${video.sortKey}`}>
                                                            <Loader>Loading</Loader>
                                                        </Dimmer>
                                                        <div className="d-flex mb-2">
                                                            <h5 className="btn-flat-title">{video.name}</h5>
                                                            <span className="badge badge-pill badge-primary px-3 ml-auto" style={{ paddingTop: 9 }}><strong>Video</strong></span>
                                                        </div>
                                                        <span>
                                                    { video.description }
                                                </span>
                                                        <h5 className="mt-2">{ video.length }</h5>
                                                        <Popup
                                                            trigger={
                                                                <div className="progress mt-3" style={{height: 7 }}>
                                                                    <div className="progress-bar" role="progressbar" style={{width: `${Videos.percentComplete(video)}%`, backgroundColor: '#408AF8' }} />
                                                                </div>
                                                            }
                                                            content={`You have completed ${Videos.percentComplete(video)}% of this video.`}
                                                            position="bottom center"
                                                        />
                                                    </button>
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

// TODO there has to be a better way....
export default
    withContainer(
        connect(mapStateToProps, mapDispatchToProps)(withCookies(withRouter(Videos))),
        { style: { background: 'white' }});
