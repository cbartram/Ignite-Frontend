import React, {Component} from 'react';
import {connect} from 'react-redux';
import isNil from 'lodash/isNil';
import {withRouter} from 'react-router-dom';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import './Pricing.css';
import withContainer from "../../components/withContainer";
import PricingCard from "./PricingCard";
import Log from '../../Log';

const mapStateToProps = state => ({
   auth: state.auth,
    user: state.auth.user,
});

class Pricing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPlan: null,
            plans: {
                oneMonth: {
                    amount: '$7.00'
                },
                threeMonth: {
                    amount: '$18.00'
                },
                sixMonth: {
                    amount: '$35.00'
                },
            }
        };
    }
    /**
     * Renders the correct button for the payment screen depending on what kind of user
     * is using the button (non registered, registered but not premium, registered and premium)
     */
    renderButton() {
        if (this.props.user) {
            // If the user is already premium let them know!
            if (!isNil(this.props.user.plan))
                return <button
                    onClick={() => this.props.pushAlert('info', 'Already Subscribed', 'You are already subscribed to this plan!')}
                    className="Plan-button common-UppercaseText common-Link--arrow">
                    Join free for 7 days
                </button>;
             else
                // Else show them the payment form
                return <button data-toggle="modal" data-target="#payment-modal"
                               className="Plan-button common-Link--arrow">
                    Join free for 7 days
                </button>
        }
        // User is not signed in prompt them to signup
        return <button onClick={() => this.props.history.push('/signup')}
                       className="Plan-button common-UppercaseText common-Link--arrow">
            Join free for 7 days
        </button>;
    }

    render() {
        return (
            <div>
                {/* Handles showing and processing user payments */}
                <PaymentModal
                    onFailedPayment={(errorMessage) => {
                        Log.error(errorMessage);
                        this.props.pushAlert('danger', 'Subscription Failed', `Unfortunately something went wrong processing your payment. ${errorMessage}`)
                    }}
                    onSuccessfulPayment={() => this.props.history.push('/videos')}
                />
                <div className="row d-flex justify-content-around">
                    <div className="col-lg-4 col-md-4 col-sm-10 p-4">
                        <PricingCard
                            title="One Month"
                            pricing="$7"
                            perSymbol="/"
                            duration="month"
                        >
                            <ul className="Plan-list Plan-list-updated">
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Unlimited Access to 60+ HD Videos
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Quizzes for each Chapter
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Real World exercises and projects
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    On Demand Learning & Mobile Friendly
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Supportive Q&A Community
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2"/>
                                    Hand curated blogs for continued learning
                                </li>
                            </ul>
                            {/* If the user is logged in show the payment modal else redirect to the sign up page */}
                            {this.renderButton('oneMonth')}
                        </PricingCard>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-10 p-4">
                        <PricingCard
                            title="Three Month"
                            pricing="$18"
                            perSymbol="/"
                            duration="three months"
                        >
                            <ul className="Plan-list Plan-list-updated">
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Unlimited Access to 60+ HD Videos
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Quizzes for each Chapter
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Real World exercises and projects
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    On Demand Learning & Mobile Friendly
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Supportive Q&A Community
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2"/>
                                    Hand curated blogs for continued learning
                                </li>
                            </ul>
                            { this.renderButton() }
                        </PricingCard>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-10 p-4">
                        <PricingCard
                            title="Six Month"
                            disabled
                            pricing="$35"
                            perSymbol="/"
                            duration="bi-annually"
                        >
                            <ul className="Plan-list Plan-list-updated">
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Unlimited Access to 60+ HD Videos
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Quizzes for each Chapter
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Real World exercises and projects
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    On Demand Learning & Mobile Friendly
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2" />
                                    Supportive Q&A Community
                                </li>
                                <li className="Plan-listItem">
                                    <span className="fa fa-check success-icon mr-2"/>
                                    Hand curated blogs for continued learning
                                </li>
                            </ul>
                            {this.renderButton()}
                        </PricingCard>
                    </div>
                </div>
            </div>
        )
    }
}

export default withContainer(connect(mapStateToProps)(withRouter(Pricing)));
