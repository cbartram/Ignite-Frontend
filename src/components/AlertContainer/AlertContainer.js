import React, { Component } from 'react';
import './AlertContainer.css';

/**
 * Component which renders a list of <Alert /> components
 * @returns {{new(*=): AlertContainer, state, new(props: Readonly<P>): AlertContainer, new(props: P, context?: any): AlertContainer, prototype: AlertContainer}}
 */
export default class AlertContainer extends Component {
    render() {
        return (
            <div className="alert-container">
                { this.props.children }
            </div>
        )
    }
}

