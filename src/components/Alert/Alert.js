import React, { Component } from 'react';
import './Alert.css';

export default class Alert extends Component {
    render() {
        return (
            <div className={`alert alert-${this.props.type}`} role="alert">
                <h4 className="alert-heading">{this.props.heading}</h4>
                {this.props.children}
            </div>
        )
    }
}
