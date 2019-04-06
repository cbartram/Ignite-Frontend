import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import './Pricing.css';
import withContainer from "../../components/withContainer";
import PricingCard from "./PricingCard";

const mapStateToProps = state => ({
   auth: state.auth,
});

class Pricing extends Component {
    /**
     * Renders the correct button for the payment screen depending on what kind of user
     * is using the button (non registered, registered but not premium, registered and premium)
     */
    renderButton(disabled = false) {
        if(this.props.auth.user) {
            // If the user is already premium let them know!
            if(this.props.auth.user['custom:plan'] === 'Basic Plan2')
                return <button onClick={() => this.props.pushAlert('info', 'Already Subscribed', 'You are already subscribed to this plan!')} disabled={disabled} className="Plan-button common-UppercaseText common-Link--arrow">
                    Join free for 7 days
                </button>;
             else
                // Else show them the payment form
                return <button data-toggle="modal" data-target="#payment-modal" disabled={disabled} className="Plan-button common-Link--arrow">
                    Join free for 7 days
                </button>
        }
        // User is not signed in prompt them to signup
        return  <button onClick={() => this.props.history.push('/signup')} disabled={disabled} className="Plan-button common-UppercaseText common-Link--arrow">
            Join free for 7 days
        </button>;
    }

    render() {
        return (
            <div>
                {/* Handles showing and processing user payments */}
                <PaymentModal
                    onFailedPayment={(errorMessage) => {
                        let message = `Unfortunately something went wrong processing your payment: ${errorMessage}`;
                        this.props.pushAlert('danger', 'Subscription Failed', message)
                    }}
                    onSuccessfulPayment={() => {
                        this.props.history.push('/videos')
                }} />
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-10 d-flex align-items-stretch align-self-end p-4">
                        <PricingCard
                            title="Free Trial"
                            pricing="Free"
                            description="Get a seven day free trial of Ignite! After your free trial ends you will be upgraded automatically to the basic plan."
                        >
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
                        </PricingCard>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-10 d-flex align-items-stretch align-self-end p-4">
                        <PricingCard
                            title="Basic Plan"
                            pricing="$7"
                            perSymbol="/"
                            duration="month"
                            description="Access a complete suite of high quality full stack development videos, quizzes, and examples."
                        >
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
                            { this.renderButton() }
                        </PricingCard>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-10 d-flex align-items-stretch align-self-end p-4">
                        <PricingCard
                            title="Team Plan"
                            disabled
                            pricing="$40"
                            perSymbol="/"
                            duration="month"
                            description="Get up to 7 subscriptions of Ignite's videos, quizzes, and examples for one low price!"
                        >
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
                            { this.renderButton(true) }
                        </PricingCard>
                    </div>
                </div>
            </div>
        )
    }
}

export default withContainer(connect(mapStateToProps)(withRouter(Pricing)));
