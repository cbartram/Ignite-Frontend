import React, {Component} from 'react';
import isNil from "lodash/isNil";
import moment from "moment";
import LoaderButton from "../../../components/LoaderButton/LoaderButton";
import Card from "../../../components/Card/Card";
import _ from "lodash";
import {Placeholder} from "semantic-ui-react";

export default class BillingDetails extends Component {
    /**
     * Renders the date when the bill will renew for the user
     */
    renderRenewalDate() {
        if (isNil(this.props.customer)) return <span className="value">None</span>;
        if (this.props.customer.subscriptions[0].cancel_at_period_end === true) return <span
            className="badge badge-pill badge-secondary py-1 px-2">Subscription Cancelled</span>
        if (_.isNil(this.props.customer.subscriptions[0].current_period_end)) return <span
            className="value">None</span>;

        return <span
            className="badge badge-pill badge-primary py-1 px-2">{moment.unix(this.props.customer.subscriptions[0].current_period_end).format('MMMM Do')}</span>
    }

    render() {
        if (this.props.loading)
            return (
                <Card cardTitle="Billing Information" classNames={['pb-0']}>
                    <div className="p-4">
                        <Placeholder fluid>
                            <Placeholder.Paragraph>
                                <Placeholder.Line/>
                                <Placeholder.Line/>
                                <Placeholder.Line/>
                                <Placeholder.Line/>
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </div>
                </Card>
            )

        return (
            <Card cardTitle="Billing Information" classNames={['pb-0']}>
                <div className="d-flex flex-row justify-content-between">
                    <div className="table-responsive">
                        <table className="table table-borderless table-sm">
                            <tbody>
                            <tr>
                                <td className="key">ID</td>
                                <td>
                                    <span className="value-code">
                                         {isNil(this.props.customer) ? 'None' : this.props.customer.id}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="key">Plan Name</td>
                                <td>
                                    <span className="value">
                                        {isNil(this.props.customer) ? 'None' : this.props.customer.subscriptions[0].plan.nickname}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="key">Renews On</td>
                                <td>
                                    {this.renderRenewalDate()}
                                </td>
                            </tr>
                            <tr>
                                <td className="key">Subscription Status</td>
                                <td>
                                    <span className="value">
                                        {isNil(this.props.customer) ? 'None' : this.props.customer.subscriptions[0].status}
                                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-borderless table-sm">
                            <tbody>
                            <tr>
                                <td className="key">
                                    Current Period
                                </td>
                                <td>
                                    {isNil(this.props.customer) ?
                                        <span className="value">None</span> :
                                        <span className="value">
                                                        {moment.unix(this.props.customer.subscriptions[0].current_period_start).format('MMM Do YYYY')}
                                            &nbsp;
                                            to
                                            &nbsp;
                                            {moment.unix(this.props.customer.subscriptions[0].current_period_end).format('MMM Do YYYY')}
                                                        </span>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="key">
                                    Payment Amount
                                </td>
                                <td>
                                    <span className="value-code value-lg">
                                        ${!isNil(this.props.customer) ? (this.props.customer.subscriptions[0].plan.amount / 100).toFixed(2) : '0.00'}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="key">
                                    Billing Method
                                </td>
                                <td>
                                    {
                                        !isNil(this.props.customer) ?
                                            <div>
                                                        <span className="value">
                                                          {/* Card image icon */}
                                                            <svg
                                                                className="SVGInline-svg SVGInline--cleaned-svg SVG-svg mr-2"
                                                                style={{width: 16, height: 16}}
                                                                xmlns="http://www.w3.org/2000/svg" width="16"
                                                                height="16" viewBox="0 0 16 16">
                                                            <g fill="none" fillRule="evenodd">
                                                                <path fill="#F6F9FC" fillRule="nonzero"
                                                                      d="M1 12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8z"/>
                                                                <path fill="#E6EBF1" fillRule="nonzero"
                                                                      d="M1 12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8zm-1 0V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z"/>
                                                                <path fill="#1A1F71"
                                                                      d="M0 5V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm5 2h6a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2z"/>
                                                                <path fill="#F7B600"
                                                                      d="M0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1H0z"/>
                                                            </g>
                                                        </svg>
                                                        •••• {this.props.customer.sources[0].last4}
                                                        </span>
                                                <span className="value ml-2">
                                                         {this.props.customer.sources[0].brand}
                                                 </span>
                                            </div> :
                                            null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="key">
                                    Card Brand
                                </td>
                                <td>
                                    <span className="value ml-2">
                                     {!isNil(this.props.customer) ? this.props.customer.sources[0].brand : 'None'}
                                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="d-flex align-items-end justify-content-start mt-3">
                    {
                        // Only show the button to user's who are actively subscribed
                        // (dont show to users whos subscription will end at the close of the next period)

                        (!isNil(this.props.customer) && this.props.billing.premium && this.props.billing.premium !== 'false' && this.props.customer.subscriptions[0].cancel_at_period_end !== true) &&
                        <LoaderButton
                            isLoading={this.props.auth.isFetching}
                            className="btn btn-danger"
                            text="Cancel Subscription"
                            noCommon
                            onClick={() => this.setState({confirmOpen: true})}>
                        </LoaderButton>
                    }
                </div>
            </Card>
        )
    }
}
