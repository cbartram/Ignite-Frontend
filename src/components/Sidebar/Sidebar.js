import React, { Component } from 'react';
import SidebarOverlay from './SidebarOverlay';
import './Sidebar.css';

/**
 * Sidebar Component which renders
 * the list of videos to the right of the user's screen.
 * When active the user will be presented with a sliding sidebar showing a list
 * of videos they can select
 */
export default class Sidebar extends Component {
  render() {
      return (
          <div>
            <nav id="sidebar" className={`${this.props.active ? 'sidebar-active': ''}`}>
              <button id="dismiss" onClick={() => this.props.onDismiss()}>
                <span className="fas fa-arrow-right" />
              </button>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="my-3">
                  <img height="70" width="70" alt="thumbnail" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/170px-HTML5_logo_and_wordmark.svg.png" />
                </div>
                <h3 className="text-muted">HTML & CSS</h3>
              </div>
              {/* Chapter */}
              <div className="d-flex pl-4 pr-2">
                <small className="mr-auto">Chapter 1</small>
                <span className="curriculum-chapterDuration">17:21</span>
              </div>
              <div className="d-flex flex-column align-items-start pl-4">
                <h4 className="curriculum-heading">
                  Introduction
                </h4>
              </div>
              {/* Content */}
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                <div className="pl-4">
                  <i className="fa fa-check success-icon" />
                </div>
                <span>Overview</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                <div className="pl-4">
                  <i className="fa fa-check success-icon" />
                </div>
                <span>Blueprint</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                <div className="pl-4">
                  <i className="fa fa-check success-icon" />
                </div>
                <span>Git & Version Control</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                <div className="pl-4">
                  <i className="fa fa-check success-icon" />
                </div>
                <span>CSS</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex pl-4 pr-2">
                <small className="mr-auto">Chapter 2</small>
                <span className="curriculum-chapterDuration">13:43</span>
              </div>
              <div className="d-flex flex-column align-items-start pl-4">
                <h4 className="curriculum-heading">
                  Javascript
                </h4>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                <div className="pl-4">
                  <i className="fa fa-check success-icon" />
                </div>
                <span>JQuery</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                <div className="pl-4">
                  <i className="fa fa-check success-icon" />
                </div>
                <span>The DOM</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                <div className="pl-4">
                  <i className="fas fa-play play-icon" />
                </div>
                <span>Javascript Basics</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
              <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                <div className="pl-4">
                  <i className="fas fa-play play-icon" />
                </div>
                <span>NodeJS</span>
                <span className="curriculum-chapterDuration pr-2">18:20</span>
              </div>
            </nav>
            <SidebarOverlay
                active={this.props.active}
                onClick={() => this.props.onDismiss()}
            />
          </div>
      )
  }
}
