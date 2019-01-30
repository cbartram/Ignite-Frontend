import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import PaymentModal from '../PaymentModal/PaymentModal';
import AlertContainer from '../AlertContainer/AlertContainer';
import Alert from '../Alert/Alert';
import './Pricing.css';

const mapStateToProps = state => ({
   auth: state.auth,
});

class Pricing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alerts: []
        }
    }

    /**
     * Renders the correct button for the payment screen depending on what kind of user
     * is using the button (non registered, registered but not premium, registered and premium)
     */
    renderButton() {
        if(this.props.auth.user) {
            // If the user is already premium let them know!
            if(this.props.auth.user['custom:plan'] === 'Basic Plan2') {
                // todo replace this alert with something better
                return <a href="#basic-plan" onClick={() => alert('You are already on this plan!')} className="Plan-button common-UppercaseText common-Link--arrow">
                    Join free for 7 days
                </a>
            } else {
                // Else show them the payment form
                return <a href="#join" data-toggle="modal" data-target="#payment-modal" className="Plan-button common-UppercaseText common-Link--arrow">
                    Join free for 7 days
                </a>
            }
        }
        // User is not signed in prompt them to signup
        return  <Link to="/signup" className="Plan-button common-UppercaseText common-Link--arrow">
            Join free for 7 days
        </Link>;
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
            <Container>
                <AlertContainer>
                    {
                        this.state.alerts.map((props, index) =>
                            <Alert onDismiss={() => this.removeAlert(props.id)} {...props} key={index}>
                                { props.message }
                            </Alert>
                        )
                    }
                </AlertContainer>
                {/* Handles showing and processing user payments */}
                <PaymentModal
                    onFailedPayment={(errorMessage) => {
                        let message = `Unfortunately something went wrong processing your payment: ${errorMessage}`;
                        this.pushAlert('danger', 'Subscription Failed', message)
                    }}
                    onSuccessfulPayment={() => {
                    let message = `Your subscription has been created successfully and will automatically renew on ${ moment().format('MMM Do') }.`;
                    this.pushAlert('success', 'Subscription Successful', message)
                }} />
                <div className="d-flex flex-row justify-content-center my-3">
                    <h1>Simple Plans. Flexible Pricing.</h1>
                </div>
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="Plan Plan--standard">
                            <h2 className="Plan-title common-UppercaseText">Basic Plan</h2>
                            <div className="Plan-description Plan-description-intergrated px-2">Access a complete suite of high
                                quality full stack development videos.
                            </div>

                            <div className="Plan-cardPricing">
                                <div className="Plan-cardRate">
                                    <div className="Plan-cardRate-percent">
                                        $20
                                    </div>
                                    <div className="Plan-cardRate-plus">/</div>
                                    <div className="Plan-cardRate-fixed">
                                        month
                                    </div>
                                </div>
                                <div className="Plan-cardRate-description">
                                    Cancel Anytime
                                </div>
                            </div>
                            <ul className="Plan-list Plan-list-updated">
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    1080p HD Step by Step Videos
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Full Stack Development Course
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Real World exercises and portfolio
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    On Demand Learning
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Supportive Q&A Community
                                </li>
                            </ul>
                            {/* If the user is logged in show the payment modal else redirect to the sign up page */}
                            { this.renderButton() }
                        </div>
                    </div>
                </div>
                <div className="common-StripeGrid anchorBottom">
                    <div className="backgroundContainer">
                        <div className="grid">
                            <div className="background" />
                        </div>
                    </div>
                    <div className="stripeContainer">
                        <div className="grid">
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />
                            <div className="stripe" />

                        </div>
                    </div>
                </div>
            </Container>
        )
    }
}

export default connect(mapStateToProps)(Pricing);
