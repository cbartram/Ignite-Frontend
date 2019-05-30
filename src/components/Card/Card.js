import React, { Component } from 'react';
import './Card.css';
import {Dimmer, Loader} from "semantic-ui-react";

/**
 * Renders a common card to display information in
 */
export default class Card extends Component {
  render() {
      return (
          <div className={`common-Card pricing-box mx-3 my-3 pt-0 ${this.props.cardTitle ? 'px-0' : ''}`} style={this.props.style}>
              <Dimmer active={this.props.loading}>
                  <Loader>Loading</Loader>
              </Dimmer>
              {
                  this.props.badgeText &&
                  <aside className="common-UppercaseText-Badge profile-badge">{this.props.badgeText}</aside>
              }
              {
                  this.props.cardTitle &&
                   <div className="modal-header">
                       <h4 className="modal-title">{this.props.cardTitle}</h4>
                   </div>
              }
              <div className={`card-body ${this.props.classNames ? this.props.classNames.join(' ') : ''}`}>
                  { this.props.children }
              </div>
          </div>
      )
  }
}
