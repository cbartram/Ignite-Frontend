import React, { Component } from 'react';
import Container from '../Container/Container';
import './Pricing.css';

class Pricing extends Component {
    render() {
        return (
            <Container>
                <div className="d-flex flex-row justify-content-center">
                    <h1>Simple. Flexible. Pricing.</h1>
                </div>
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="Plan Plan--standard">
                            <h2 className="Plan-title common-UppercaseText">Integrated</h2>
                            <div className="Plan-description Plan-description-intergrated">Access a complete platform
                                for online payments with simple, pay-as-you-go pricing
                            </div>

                            <div className="Plan-cardPricing">
                                <div className="Plan-cardRate">
                                    <div className="Plan-cardRate-percent">
                                        2.9%
                                    </div>
                                    <div className="Plan-cardRate-plus">+</div>
                                    <div className="Plan-cardRate-fixed">
                                        30¢
                                    </div>
                                </div>
                                <div className="Plan-cardRate-description">
                                    per successful card charge
                                </div>
                            </div>
                            <ul className="Plan-list Plan-list-updated">
                                <li className="Plan-listItem">
                                    <img src="https://stripe.com/img/v3/pricing/header/payment.svg" width="26" height="26"
                                         alt="fees icon" />
                                    Everything you need to manage payments
                                </li>
                                <li className="Plan-listItem">
                                    <img src="https://stripe.com/img/v3/pricing/header/forward.svg" width="26" height="26" alt="pay icon" />
                                    Get hundreds of feature updates each year
                                </li>
                                <li className="Plan-listItem">
                                    <img src="https://stripe.com/img/v3/pricing/header/plan-star.svg" width="26" height="26"
                                         alt="reporting icon" />
                                    No setup fees, monthly fees, or hidden fees
                                </li>
                            </ul>

                            <a href="https://dashboard.stripe.com/register"
                               className="Plan-button common-UppercaseText common-Link--arrow"
                               data-analytics-action="get-started"
                               data-analytics-source="pricing-experiment-plan-boxes">
                                Get started in minutes
                            </a>

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

export default Pricing;
