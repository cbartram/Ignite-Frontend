import React, { Component } from 'react';
import './Alert.css';

/**
 * The Presentational component of an alert which slides in and is displayed to the user.
 * There are 4 different alert types: danger, warning, info, and success which can be passed as a string
 * via the "type" prop.
 */
export default class Alert extends Component {
    constructor() {
        super();

        this.state = {
            notificationHidden: false,
        }
    }

    pushAlert(type, title, message) {
        const { alerts } = this.state;

        alerts.push(
            <Alert key={alerts.length} title={title} type={type}>
                {message}
            </Alert>
        );

        this.setState({ alerts });
    }

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
            <div className={`notification notification-${this.props.type} ${this.state.notificationHidden ? 'notification-hide' : '' }`} role="alert">
                <div className="d-flex flex-row justify-content-left align-items-center">
                    {/* Icon Image */}
                    { this.renderIconType() }
                    <div className="d-flex flex-column ml-3 mt-2">
                        <strong>{this.props.title}</strong>
                        <p className="text-muted mb-0">
                            {this.props.children}
                        </p>
                        { this.props.action &&
                            <button className="btn btn-link text-left pl-0" onClick={() => this.props.onClick()}>{this.props.actionText}></button>
                        }
                    </div>
                    <span onClick={() => this.setState({ notificationHidden: true })} className="fa fa-times light-gray ml-auto mt-2" />
                </div>
            </div>
        )
    }
}
