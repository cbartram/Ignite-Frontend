import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PaymentModal from '../PaymentModal/PaymentModal';
import './Pricing.css';
import withContainer from "../withContainer";

const mapStateToProps = state => ({
   auth: state.auth,
});

class Pricing extends Component {
    /**
     * Renders the correct button for the payment screen depending on what kind of user
     * is using the button (non registered, registered but not premium, registered and premium)
     */
    renderButton() {
        if(this.props.auth.user) {
            // If the user is already premium let them know!
            if(this.props.auth.user['custom:plan'] === 'Basic Plan2') { // TODO change this to "Basic Plan" to prevent re-subscribers
                return <a href="#basic-plan" onClick={() => this.props.pushAlert('info', 'Already Subscribed', 'You are already subscribed to this plan!')} className="Plan-button common-UppercaseText common-Link--arrow">
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
                    let message = `Your subscription has been created successfully and will automatically renew on ${ moment().format('MMM Do') }.`;
                    this.props.pushAlert('success', 'Subscription Successful', message)
                }} />
                <div className="row">
                    <div className="col-lg-4 offset-md-4 col-md-4 offset-md-4 col-sm-8 offset-sm-2 px-4 mt-3">
                        <div className="Plan Plan--standard">
                            <h2 className="common-UppercaseText Plan-title">Basic Plan</h2>
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
            </div>
        )
    }
}

export default withContainer(connect(mapStateToProps)(Pricing));
