import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import PaymentModal from '../PaymentModal/PaymentModal';
import './Pricing.css';

const mapStateToProps = state => ({
   auth: state.auth,
});

class Pricing extends Component {
    render() {
        return (
            <Container>
                <PaymentModal />
                <div className="d-flex flex-row justify-content-center my-3">
                    <h1>Simple Plans. Flexible Pricing.</h1>
                </div>
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="Plan Plan--standard">
                            <h2 className="Plan-title common-UppercaseText">Basic Plan</h2>
                            <div className="Plan-description Plan-description-intergrated">Access a complete suite of high
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
                            {
                                this.props.auth.user ?
                                <a href="#join" data-toggle="modal" data-target="#payment-modal" className="Plan-button common-UppercaseText common-Link--arrow">
                                    Join free for 7 days
                                </a> :
                                <Link to="/signup" className="Plan-button common-UppercaseText common-Link--arrow">
                                    Join free for 7 days
                                </Link>
                            }

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
