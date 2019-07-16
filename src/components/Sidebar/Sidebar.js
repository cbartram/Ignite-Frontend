import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import SidebarOverlay from './SidebarOverlay';
import './Sidebar.css';
import {findQuestions, getSignedUrl} from "../../actions/actions";
import {IS_PROD} from "../../constants";
import Log from "../../Log";
import {matchSearchQuery} from "../../util";

const mapStateToProps = (state) => ({
    videos: state.videos,
    user: state.auth.user,
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
            query: '',
        }
    }

    /**
     * Passes the search text up through props and updates local state for
     * matching the search query and highlighting the context
     * @param query String query the user typed in
     */
    onSearchChange(query) {
        this.setState({ query });
        this.props.onSearch(query);
    }

    /**
     * Updates the active video in redux and redirects the user to
     * the correct video link
     * @param video
     */
    async handleVideoClick(video) {
        try {
            await this.props.getSignedUrl({
                video,
                resourceUrl: `${IS_PROD ? 'https://d2hhpuhxg00qg.cloudfront.net' : 'https://dpvchyatyxxeg.cloudfront.net'}/chapter${video.chapter}/${video.s3Name}.mov`,
                subscriptionId: this.props.user.subscription_id,
            });
            await this.props.findQuestions(`${video.chapter}.${video.sortKey}`);
            this.props.onDismiss();
        } catch (err) {
            Log.error(err.message);
        }
    }


    /**
     * Computes which icon to render in the sidebar based on if the user
     * has completed, currently watching, or needs to watch a video
     * @param video Object video object to compute the icon for
     * @returns {*}
     */
    renderIcon(video) {
        if (!_.isNil(this.props.activeVideo)) {
            if (this.props.activeVideo.name === video.name)
                return <i className="fa fa-pause info-icon"/>;
            else if (video.completed)
                return <i className="fa fa-check success-icon"/>
        } else
        // Its still loading no active video
            return <i className="fa fa-pause info-icon"/>
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
                    {this.renderIcon(video)}
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
                    <button id="dismiss" onClick={() => this.props.onDismiss()}>
                        <span className="fas fa-arrow-right"/>
                    </button>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="my-3">
                            <input className="form-field-default" placeholder="Search Chapters"
                                   onChange={({ target }) => this.onSearchChange(target.value)}/>
                        </div>
                        <h3 className="text-muted">{_.isNil(this.props.activeVideo) ? 'Loading...' : this.props.activeVideo.name}</h3>
                    </div>
                    {/* Chapter */}
                    {
                        // Filter the list of chapters based on the query the user has typed in.
                        this.props.videos.videoList
                            .filter(v => v.title.toUpperCase().includes(this.props.filter.toUpperCase()))
                            .map(({duration, title, videos, chapter}) => {
                                return (
                                    <div key={_.uniqueId('chapter_')}>
                                        <div className="d-flex pl-4 pr-2">
                                            <small className="mr-auto">Chapter {chapter}</small>
                                            <span className="curriculum-chapterDuration">{duration}</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-start pl-4 video-item">
                                            <h4 className="curriculum-heading">
                                                { matchSearchQuery(this.state.query, title)}
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
