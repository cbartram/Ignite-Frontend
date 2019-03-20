import React, { Component } from 'react';
import './Pricing.css';

export default class PricingCard extends Component {
    render() {
        return (
            <div className="Plan">
                <h2 className="common-UppercaseText Plan-title">
                    { this.props.title }
                </h2>
                <div className="Plan-description Plan-description-intergrated px-2">
                    { this.props.description }
                </div>

                <div className="Plan-cardPricing">
                    <div className="Plan-cardRate">
                        <div className="Plan-cardRate-percent">
                            { this.props.pricing }
                        </div>
                        {
                            this.props.perSymbol && <div className="Plan-cardRate-plus">{this.props.perSymbol || '\\'}</div>
                        }
                        {
                            this.props.duration && <div className="Plan-cardRate-fixed">{this.props.duration || 'month'}</div>
                        }
                    </div>
                    <div className="Plan-cardRate-description">
                        Cancel Anytime
                    </div>
                </div>
                { this.props.children }
            </div>
        )
    }
};
