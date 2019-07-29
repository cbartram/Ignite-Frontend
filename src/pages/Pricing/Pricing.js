import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import isNil from 'lodash/isNil';
import {withRouter} from 'react-router-dom';
import ReactGA from 'react-ga';
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
            // Default to 1 month plan
            selectedPlan: {
                ONE_MONTH: {
                    name: 'ONE_MONTH',
                    amount: '$14.99',
                    recurring: `on the ${moment().format('Do')} of the month`
                }
            },
            plans: {
                ONE_MONTH: {
                    name: 'ONE_MONTH',
                    amount: '$14.99',
                    recurring: `on the ${moment().format('Do')} of the month`
                },
                THREE_MONTH: {
                    name: 'THREE_MONTH',
                    amount: '$39.99',
                    recurring: `on ${moment().add(3, 'months').format('MMMM DD')}`

                },
                SIX_MONTH: {
                    name: 'SIX_MONTH',
                    amount: '$74.99',
                    recurring: `on ${moment().add(6, 'months').format('MMMM DD')}`
                },
            }
        };
    }
    /**
     * Renders the correct button for the payment screen depending on what kind of user
     * is using the button (non registered, registered but not premium, registered and premium)
     * @param planName string either oneMonth, threeMonth, or sixMonth. Designates what data is shown in the modal
     */
    renderButton(planName) {
        if (this.props.user) {
            // If the user is already premium let them know!
            if (!isNil(this.props.user.plan))
                return <button
                    onClick={() => {
                        this.props.pushAlert('info', 'Already Subscribed', 'You are already subscribed to this plan!');
                        ReactGA.modalview('/pricing#already-subscribed');
                    }}
                    className="Plan-button common-UppercaseText common-Link--arrow">
                    Join free for 7 days
                </button>;
             else
                // Else show them the payment form
                return <button onClick={() => {
                    this.setState({selectedPlan: this.state.plans[planName]});
                    ReactGA.modalview('/pricing#successful');
                }}
                               data-toggle="modal" data-target="#payment-modal"
                               className="Plan-button common-Link--arrow">
                    Join free for 7 days
                </button>
        }
        // User is not signed in prompt them to signup
        return <button onClick={() => {
            this.props.history.push('/signup');
            ReactGA.modalview('/pricing#signup');
        }}
                       className="Plan-button common-UppercaseText common-Link--arrow">
            Join free for 7 days
        </button>;
    }

    render() {
        return (
            <div>
                {/* Handles showing and processing user payments */}
                <PaymentModal
                    plan={this.state.selectedPlan}
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
                            pricing="$14.99"
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
                            {this.renderButton('ONE_MONTH')}
                        </PricingCard>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-10 p-4">
                        <PricingCard
                            title="Three Month"
                            pricing="$39.99"
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
                            {this.renderButton('THREE_MONTH')}
                        </PricingCard>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-10 p-4">
                        <PricingCard
                            title="Six Month"
                            disabled
                            pricing="$74.99"
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
                            {this.renderButton('SIX_MONTH')}
                        </PricingCard>
                    </div>
                </div>
            </div>
        )
    }
}

export default withContainer(connect(mapStateToProps)(withRouter(Pricing)));
