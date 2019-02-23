import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SidebarOverlay from './SidebarOverlay';
import './Sidebar.css';
import {updateActiveVideo} from "../../actions/actions";

const mapStateToProps = (state) =>  ({
  videos: state.videos,
});

const mapDispatchToProps = (dispatch) => ({
    updateActiveVideo: (video) => dispatch(updateActiveVideo(video)),
});

/**
 * Sidebar Component which renders
 * the list of videos to the right of the user's screen.
 * When active the user will be presented with a sliding sidebar showing a list
 * of videos they can select
 */
class Sidebar extends Component {
    /**
     * Updates the active video in redux and redirects the user to
     * the correct video link
     * @param video
     */
  handleVideoClick(video) {
      this.props.updateActiveVideo(video);
      window.location.replace(`/watch?v=${btoa(encodeURI(video.name))}`);
  }

  /**
   * Renders a list of videos to the DOM
   */
  renderVideos(video) {
    return (
        <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row" key={video.name} onClick={() => this.handleVideoClick(video)}>
          <div className="pl-4">
            {
              typeof this.props.videos.activeVideo !== 'undefined' && this.props.videos.activeVideo.name === video.name ? <i className="fa fa-pause info-icon" /> : (
                  video.completed ? <i className="fa fa-check success-icon" /> :
                      <i className="fas fa-play play-icon" />
              )
            }
          </div>
          <span>{ video.name }</span>
          <span className="curriculum-chapterDuration pr-2">{ video.length }</span>
        </div>
    )
  }

  render() {
      if(this.props.videos.isFetching)
        return <h3>Loading...</h3>;

      return (
          <div>
            <nav id="sidebar" className={`${this.props.active ? 'sidebar-active': ''}`}>
              <button id="dismiss" onClick={() => this.props.onDismiss()}>
                <span className="fas fa-arrow-right" />
              </button>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="my-3">
                    <input className="form-field-default" placeholder="Search Chapters" onChange={(e) => this.props.onSearch(e.target.value)} />
                </div>
                <h3 className="text-muted">{this.props.videos.activeVideo.name}</h3>
              </div>
              {/* Chapter */}
              {
                  // Filter the list of chapters based on the query the user has typed in.
                this.props.videos.videoList
                    .filter(v => v.title.toUpperCase().includes(this.props.filter.toUpperCase()))
                    .map(({ duration, title, videos, chapter }) => {
                  return (
                      <div key={title}>
                        <div className="d-flex pl-4 pr-2">
                          <small className="mr-auto">Chapter { chapter }</small>
                          <span className="curriculum-chapterDuration">{ duration }</span>
                        </div>
                        <div className="d-flex flex-column align-items-start pl-4 video-item">
                          <h4 className="curriculum-heading">
                            { title }
                          </h4>
                        </div>
                        { videos.map((video) => this.renderVideos(video)) }
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
