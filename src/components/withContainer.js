import React, { Component } from 'react';
import _ from 'lodash';
import Container from './Container/Container';
import Alert from './Alert/Alert';

/**
 * Attaches a <Container /> Component around the
 * base component which shows the Navbar and footer on the page.
 * @param BaseComponent
 * @param props
 * @returns {{new(props: Readonly<P>): EnhancedComponent, new(props: P, context?: any): EnhancedComponent, prototype: EnhancedComponent}}
 */
const withContainer = (BaseComponent, props = {}) => {
    return class EnhancedComponent extends Component {
        constructor(props) {
            super(props);

            this.state = { alerts: [] }
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
                <Container {...props}>
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
                    <BaseComponent pushAlert={(type, title, message, id) => this.pushAlert(type, title, message, id)}/>
                </Container>
            );
        }
    }
};

export default withContainer;

