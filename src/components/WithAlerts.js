import React, { Component } from 'react';
import './AlertContainer/AlertContainer.css';
import moment from "./Signup/Signup";
import {Link} from "react-router-dom";
import Alert from "./Login/Login";

/**
 * Component which renders a list of <Alert /> components
 * @returns {{new(*=): EnhancedComponent, state, new(props: Readonly<P>): EnhancedComponent, new(props: P, context?: any): EnhancedComponent, prototype: EnhancedComponent}}
 */
const withAlerts = (BaseComponent) => {
    return class EnhancedComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                alerts: [{ id: 100, type: 'success', title: 'Success', message: 'It works from the higher order component'}]
            }
        }

        /**
         * Pushes an alert onto the stack to be
         * visible by users
         */
        pushAlert(type, title, message, id = moment().toISOString()) {
            console.log('Pushing ->', id);
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
            console.log('Removing ->', id);
            const { alerts } = this.state;
            const newAlerts = [
                ...alerts.filter(alert => alert.id !== id)
            ];

            console.log(newAlerts);

            this.setState({ alerts: newAlerts });
        }

        render() {
            console.log(BaseComponent);
            // BaseComponent.props.pushAlert = () => ({type, title, message }) => this.pushAlert(type, title, message);
            return (
                <div>
                    <div className="alert-container">
                        { this.state.alerts.map((props, index) =>
                            <Alert key={index} onDismiss={() => this.removeAlert(props.id)} {...props}>
                                {props.message}
                                <br />
                                <Link to="/login/reset">reset your password.</Link>
                            </Alert>
                        )}
                    </div>
                    {/*<BaseComponent pushAlert={({type, title, message }) => this.pushAlert(type, title, message)} />*/}
                </div>
            )
        }
    }
};

export default withAlerts;
