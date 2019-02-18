import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Container from '../Container/Container';
import { withRouter } from 'react-router-dom'
import { updateActiveVideo } from '../../actions/actions';
import './Videos.css';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos
});

const mapDispatchToProps = dispatch => ({
    updateActiveVideo: (name) => dispatch(updateActiveVideo(name))
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Videos extends Component {

    /**
     * Renders a message telling users to subscribe in order to watch videos
     */
    static renderSubscribeMessage() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-4 offset-md-4">
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
        this.props.history.push('/watch')
    }

    /**
     * Renders a list of videos a user can choose from to watch.
     * @returns {*}
     */
    renderVideos() {
        if(typeof this.props.videos.videoList !== 'undefined') {
            return this.props.videos.videoList.map(chapter => {
                return (
                    <div key={chapter.title}>
                        <div className="d-flex flex-row justify-content-start">
                            <h2 className="common-UppercaseTitle ml-4">
                                { chapter.title } - {chapter.duration}
                            </h2>
                            <hr />
                        </div>
                        <div className="row">
                            {
                                chapter.videos.map(video => {
                                    return (
                                        <div className="col-md-3 col-lg-3 col-sm-12 pb-2 px-4" key={video.name}>
                                            <div className="common-Card-video m-2">
                                                <div className="cover"/>
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
                                                         { Videos.percentComplete(video) <= 1 ? 'Not Started' : `${Videos.percentComplete(video)}% complete!`}
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
                        </div>
                    </div>
                )
            });
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
                <div className="d-flex flex-row justify-content-center">
                    <h1>Your Recent Videos</h1>
                </div>
                {
                    (typeof this.props.videos.videoList !== 'undefined' && this.props.videos.videoList.length === 0) &&
                    Videos.renderSubscribeMessage()
                }
                {
                    (typeof this.props.videos.videoList !== 'undefined' && this.props.videos.videoList.length > 0) &&
                     this.renderVideos()
                }
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Videos));
