import React, { Component } from 'react';
import './Alert.css';

/**
 * The Presentational component of an alert which slides in and is displayed to the user.
 * There are 4 different alert types: danger, warning, info, and success which can be passed as a string
 * via the "type" prop.
 */
export default class Alert extends Component {
    /**
     * Renders the correct icon depending on the
     * type of alert passed in as props
     */
    renderIconType() {
        switch(this.props.type.toUpperCase()) {
            case 'SUCCESS':
                return <span className="fa fa-check success-icon" />;
            case 'DANGER':
                return <span className="fa fa-times danger-icon" />;
            case 'WARNING':
                return <span className="fas fa-exclamation warning-icon" />;
            case 'INFO':
                return <span className="fas fa-info info-icon" />;
            default:
                return <span className="fas fa-info info-icon" />;
        }
    }

    render() {
        return (
            <div className={`notification notification-${this.props.type}`} role="alert">
                <div className="d-flex flex-row justify-content-left align-items-center">
                    {/* Icon Image */}
                    { this.renderIconType() }
                    <div className="d-flex flex-column ml-3 mt-2">
                        <strong>{this.props.title}</strong>
                        <div className="text-muted mb-0">
                            {this.props.children}
                        </div>
                    </div>
                    <span onClick={() => this.props.onDismiss(this.props.id)} role="button" className="fa fa-times light-gray ml-auto mt-2" />
                </div>
            </div>
        )
    }
}
