import React, {Component} from 'react';
import times from 'lodash/times';
import {Placeholder} from "semantic-ui-react";
import moment from "moment";
import Card from "../../../components/Card/Card";

export default class RecentEvents extends Component {
    /**
     * Determines the proper icon to show
     * given the event type.
     * @param event String the events type (customer.subscription.created etc...)
     */
    static getIcon(event) {
        switch (event) {
            case 'customer.created':
                return 'fas fa-user success-icon';
            case 'customer.subscription.created':
                return 'far fa-calendar info-icon';
            case 'charge.succeeded':
                return 'far fa-credit-card success-icon';
            case 'invoice.upcoming':
                return 'far fa-hourglass info-icon';
            case 'invoice.created':
                return 'fas fa-receipt success-icon';
            case 'customer.subscription.trial_will_end':
                return 'far fa-hourglass warning-icon';
            case 'customer.subscription.deleted':
                return 'fas fa-times danger-icon';
            default:
                return 'fa fa-plus success-icon'
        }
    }

    render() {
        if (this.props.loading)
            return (
                <Card
                    cardTitle="Recent Events"
                    style={{midWidth: 0, padding: 0}}
                    classNames={['p-0', 'mt-0', 'pb-2']}
                >
                    {
                        times(3, i => {
                            return (
                                <div className="p-4" key={i}>
                                    <Placeholder fluid>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </div>
                            )
                        })
                    }
                </Card>
            );

        return (
            <Card
                cardTitle="Recent Events"
                style={{midWidth: 0, padding: 0}}
                classNames={['p-0', 'mt-0', 'pb-2']}
            >
                <div style={{maxHeight: 240, overflowY: 'scroll'}}>
                    <ul className="list-group">
                        {
                            this.props.customer.events.length === 0 ?
                                <li className="list-group-item" style={{border: '1px solid white'}}>
                                    <h3>No Events</h3></li> :
                                this.props.customer.events.map((event, i) => {
                                    return (
                                        <li className="list-group-item"
                                            style={{border: '1px solid white'}} key={i}>

                                            <div className="d-flex flex-row">
                                                <span className={`${RecentEvents.getIcon(event.type)} mr-2`}/>
                                                <div className="d-flex flex-column">
                                                    <h5 className="mb-1 mt-0">{event.type.split('.').join(' ')}</h5>
                                                    <p className="text-muted">{moment(moment.unix(event.created)).format('MMM d, YYYY h:mm A')}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                        }
                    </ul>
                </div>
            </Card>
        )
    }
}
