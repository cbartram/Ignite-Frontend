import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dimmer, Loader } from "semantic-ui-react";
import _ from 'lodash';
import SidebarOverlay from './SidebarOverlay';
import './Sidebar.css';
import { getSignedUrl, findQuestions } from "../../actions/actions";
import { IS_PROD } from "../../constants";
import Log from "../../Log";

const mapStateToProps = (state) => ({
    videos: state.videos,
    token: state.auth.user.jwtToken,
    activeVideo: state.videos.activeVideo,
});

const mapDispatchToProps = (dispatch) => ({
    getSignedUrl: (payload) => dispatch(getSignedUrl(payload)),
    findQuestions: (payload) => dispatch(findQuestions(payload)),
});

/**
 * Sidebar Component which renders
 * the list of videos to the right of the user's screen.
 * When active the user will be presented with a sliding sidebar showing a list
 * of videos they can select
 */
class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    /**
     * Updates the active video in redux and redirects the user to
     * the correct video link
     * @param video
     */
    handleVideoClick(video) {
        this.setState({isLoading: true}, async () => {
            try {
                await this.props.getSignedUrl({
                    video,
                    resourceUrl: `${IS_PROD ? 'https://d2hhpuhxg00qg.cloudfront.net' : 'https://dpvchyatyxxeg.cloudfront.net'}/chapter${video.chapter}/${video.s3Name}.mov`,
                    jwtToken: this.props.token
                });
                await this.props.findQuestions(`${video.chapter}.${video.sortKey}`);
                this.setState({ isLoading: false });
                this.props.onDismiss();
            } catch (err) {
                Log.error(err.message);
            }
        });
    }

    /**
     * Renders a list of videos to the DOM
     * @param video Object the video to render { name: 'FOO', length: '20:10' }
     */
    renderVideos(video) {
        return (
            <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row"
                 key={video.name} onClick={() => this.handleVideoClick(video)}>
                <div className="pl-4">
                    {
                        !_.isUndefined(this.props.activeVideo) && this.props.activeVideo.name === video.name ?
                            <i className="fa fa-pause info-icon"/> : (
                                video.completed ? <i className="fa fa-check success-icon"/> :
                                    <i className="fas fa-play play-icon"/>
                            )
                    }
                </div>
                <span>{video.name}</span>
                <span className="curriculum-chapterDuration pr-2">{video.length}</span>
            </div>
        )
    }

    render() {
        if (this.props.videos.isFetching)
            return <h3>Loading...</h3>;

        return (
            <div>
                <nav id="sidebar" className={`${this.props.active ? 'sidebar-active' : ''}`}>
                    <Dimmer
                        style={{ borderRadius: 0, height: '100%', background: 'rgba(82,95,127,.4)' }}
                        active={this.state.isLoading}>
                        <Loader />
                    </Dimmer>
                    <button id="dismiss" onClick={() => this.props.onDismiss()}>
                        <span className="fas fa-arrow-right"/>
                    </button>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="my-3">
                            <input className="form-field-default" placeholder="Search Chapters"
                                   onChange={(e) => this.props.onSearch(e.target.value)}/>
                        </div>
                        <h3 className="text-muted">{this.props.videos.activeVideo.name}</h3>
                    </div>
                    {/* Chapter */}
                    {
                        // Filter the list of chapters based on the query the user has typed in.
                        this.props.videos.videoList
                            .filter(v => v.title.toUpperCase().includes(this.props.filter.toUpperCase()))
                            .map(({duration, title, videos, chapter}) => {
                                return (
                                    <div key={title}>
                                        <div className="d-flex pl-4 pr-2">
                                            <small className="mr-auto">Chapter {chapter}</small>
                                            <span className="curriculum-chapterDuration">{duration}</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-start pl-4 video-item">
                                            <h4 className="curriculum-heading">
                                                {title}
                                            </h4>
                                        </div>
                                        {videos.map((video) => this.renderVideos(video))}
                                    </div>
                                )
                            })
                    }
                </nav>
                <SidebarOverlay
                    active={this.props.active}
                    onClick={() => this.props.onDismiss()}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sidebar));
