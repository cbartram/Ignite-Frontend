import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from "../Container/Container";
import './Tracks.css';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Tracks extends Component {

    renderVideos() {

        if(typeof this.props.videos.videoList !== 'undefined') {
            if (this.props.videos.videoList.length === 0) {
                return (
                    <div className="d-flex flex-column justify-content-center">
                        <h3>No Recent Videos</h3>
                        <Link to="/pricing" className="common-Button common-Button--default">
                            Subscribe to Watch Videos
                        </Link>
                    </div>
                )
            }

            return this.props.videos.videoList.map(track => {
                return (
                    <div className="common-Card m-2" key={track.name}>
                        <div className="cover"/>
                        <h2 className="common-IntroText">{track.name}</h2>
                        <p className="common-BodyText">
                            {track.length}
                        </p>
                        <span className="text-muted">
                                                    {track.percentComplete === 0 ? 'Not Started' : `${track.percentComplete}% complete!`}
                                                </span>
                        <Link to={`/watch?v=${btoa(unescape(encodeURIComponent(track.id)))}`}
                              className="common-Button common-Button--default mt-2">
                            Start Now
                        </Link>
                    </div>
                )
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
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="d-flex flex-row justify-content-between">
                            { this.renderVideos() }
                        </div>
                    </div>
                </div>
            </Container>
        )
    }
}

export default connect(mapStateToProps)(Tracks);
