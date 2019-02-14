import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from "../Container/Container";
import './Videos.css';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos
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
     * Renders a list of videos a user can choose from to watch.
     * @returns {*}
     */
    renderVideos() {
        if(typeof this.props.videos.videoList !== 'undefined') {
            return this.props.videos.videoList.map((track) => {
                return (
                    <div className="col-sm-3 col-md-3 pb-2 px-4" key={track.name}>
                        <div className="common-Card m-2">
                            <div className="cover"/>
                            <div className="d-flex flex-row">
                                <h2 className="common-IntroText mt-0">{track.name}</h2>
                                <p className="common-BodyText pt-1 ml-3">
                                    {track.length}
                                </p>
                            </div>
                            <div className="d-flex flex-column">
                                <span className="text-muted">
                               {track.percentComplete === 0 ? 'Not Started' : `${track.percentComplete}% complete!`}
                                </span>
                                <Link to={`/watch?v=${btoa(unescape(encodeURIComponent(track.id)))}`}
                                      className="common-Button common-Button--default mt-2">
                                    Start Now
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })
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
                    <div className="row">
                      { this.renderVideos() }
                    </div>
                }
            </Container>
        )
    }
}

export default connect(mapStateToProps)(Videos);
