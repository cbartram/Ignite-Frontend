import React, { Component } from 'react';
import './AlertContainer.css';

export default class AlertContainer extends Component {
  render() {
      return (
          <div className="alert-container">
              { !this.props.hidden ? this.props.children : null }
          </div>
      )
  }
}
