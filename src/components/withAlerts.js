import React, { Component } from 'react';
import _ from 'lodash';
import Alert from './Alert/Alert';

/**
 * Attaches logic and Alert component to the specified base component so
 * that it can use the alert system
 * @param BaseComponent JSX Base component you wish to enhance
 * @returns {{new(props: Readonly<P>): EnhancedComponent, new(props: P, context?: any): EnhancedComponent, prototype: EnhancedComponent}}
 */
const withAlerts = (BaseComponent, props) => {
    return class EnhancedComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                alerts: []
            }
        }

        /**
         * Pushes an alert onto the stack to be
         * visible by users
         */
        pushAlert(type, title, message, id = _.uniqueId()) {
            const { alerts } = this.state;
            // Push an object of props to be passed to the <Alert /> Component
            alerts.push({
                type,
                title,
                id,
                message,
            });

            this.setState({ alerts });
        }

        /**
         * Removes an alert from the stack so that
         * it is no longer rendered on the page
         * @param id Integer the unique alert id
         */
        removeAlert(id) {
            const { alerts } = this.state;
            const newAlerts = [
                ...alerts.filter(alert => alert.id !== id)
            ];

            this.setState({ alerts: newAlerts });
        }

        render() {
            return (
                <div>
                    {
                        this.state.alerts.length > 0 &&
                        <div className="alert-container">
                            {
                                this.state.alerts.map((props, index) =>
                                    <Alert onDismiss={() => this.removeAlert(props.id)} {...props} key={index}>
                                        { props.message }
                                    </Alert>
                                )
                            }
                        </div>
                    }
                    <BaseComponent {...props} pushAlert={(type, title, message, id) => this.pushAlert(type, title, message, id)}/>
                </div>
            );
        }
    }
};

export default withAlerts;

