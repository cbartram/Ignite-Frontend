import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormGroup, FormControl } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { Auth } from 'aws-amplify/lib/index';
import ReactTooltip from 'react-tooltip';
import { Confirm, Placeholder } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import withContainer from '../../components/withContainer';
import Card from '../../components/Card/Card';
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import './Profile.css';
import {
    updateBillingSync,
    updateVideosSync,
    requestVideos,
    updateActiveVideo,
    updateUserAttributes,
    videosFetched,
    unsubscribe,
    loginSuccess,
    fetchVideos,
    getEvents,
} from '../../actions/actions';
import Log from '../../Log';

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user,
    videos: state.videos,
    billing: state.billing,
});

const mapDispatchToProps = dispatch => ({
   updateBillingSync: (payload) => dispatch(updateBillingSync(payload)),
   unsubscribeUser: (user) => dispatch(updateUserAttributes(user)),
   updateActiveVideo: (video) => dispatch(updateActiveVideo(video)),
   updateVideosSync: (videos) => dispatch(updateVideosSync(videos)),
   requestVideos: () => dispatch(requestVideos()),
   loadingComplete: () => dispatch(videosFetched()),
   unsubscribe: (payload) => dispatch(unsubscribe(payload)),
   loginSuccess: (payload) => dispatch(loginSuccess(payload)),
   fetchVideos: (payload) => dispatch(fetchVideos(payload)),
   getEvents: (payload) => dispatch(getEvents(payload)),
});

/**
 * This Presentational component shows the user their information and
 * allows them to manage their billing and current password.
 */
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            oldPassword: "",
            isChanging: false,
            confirmPassword: "",
            events: [],
            confirmOpen: false,

            // Tooltip state
            stages: [{
                text: 'You will be billed $7.00',
                highlightedText: 'on June 7th',
                width: 30,
                color: '#3ecf8e',
            },
            {
                text: 'You will be billed $7.00',
                highlightedText: 'on July 7th',
                width: 14,
                color: '#55d9c2',
            },
            {
                text: 'You unsubscribed',
                highlightedText: 'on July 14th',
                width: 14,
                color: '#3ecf8e',
            },
            {
                text: 'Your subscription ends',
                highlightedText: 'on August 7th',
                width: 2,
                color: 'grey',
            }]
        };
    }

    /**
     * Sets the active video to the last video in the series
     * that the user was last watching (started: true, completed: false, scrubDuration > 0)
     */
    async componentDidMount() {
        this.determineWidths();
        this.props.getEvents({ customerId: this.props.user.customer_id });

        try {
            if (this.props.videos.activeVideo && this.props.videos.activeVideo.name === 'null') {
                let activeVideo = null;
                const chapters = this.props.videos.videoList;
                // Find our best guess at the active video. (started: true, completed: false, scrubDuration > 0)
                // First we try to meet all 3 criteria
                _.flattenDeep(chapters.map(chapter => chapter.videos)).forEach(video => {
                    if (video.started && !video.completed && video.scrubDuration > 0)
                        activeVideo = video; // We intentionally want to overwrite this value so we get the latest video in the array
                });

                // Otherwise just settle for the first video
                if (activeVideo === null) {
                    Log.info('Active Video not found meeting criteria: video.started=true, video.completed=false');
                    activeVideo = chapters[0].videos[0];
                }

                this.props.updateActiveVideo(activeVideo);
            }
        } catch(err) {
            console.log(err);
            Log.error('Something went wrong loading this page!');
            this.props.pushAlert('warning', 'Issue Loading Videos', 'We had an issue loading your most recently watched videos.');
        }
    }

    /**
     * Validates the input fields
     */
    validateForm() {
        return (
            this.state.oldPassword.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    /**
     * Updates local state with the values in each form field
     */
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    /**
     * Handles submitting the form and changer a user's password
     */
    handleChangeClick = async event => {
        event.preventDefault();
        this.setState({ isChanging: true });

        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(
                currentUser,
                this.state.oldPassword,
                this.state.password
            );
            this.setState({ isChanging: false, password: '', oldPassword: '', confirmPassword: '' }, () => {
                this.props.history.push('/profile');
            });
        } catch (e) {
            this.props.pushAlert('danger', 'Incorrect Password', 'There was an issue updating your password. ' + e.message);
            this.setState({ isChanging: false });
        }
    };

    /**
     * Un-subscribes a user from their current plan. Note:
     * If they are NOT in their free trial period it will let them keep
     * the subscription until the end of their period else it will cancel it immediately if they
     * are in their trial period.
     */
    async unsubscribe() {
        this.props.unsubscribe({
            username: this.props.user.userName,
            subscriptionId: this.props.user.subscription_id,
            trialEnd: this.props.user.trial_end,
        }).then(async () => {
            //Update user attributes in redux
            this.props.fetchVideos(`user-${this.props.user.userName}`);
            this.props.pushAlert('success', 'Unsubscribe Successful', 'You Ignite subscription has been cancelled successfully. If you are outside of your trial period you will still retain access to video content until the end of the billing cycle.');
        }).catch(err => {
            Log.error(err);
            this.props.pushAlert('danger', 'Unsubscribe Failed', 'Something went wrong trying to un-subscribe you from your plan. Please try again shortly!')
        });
    }

    /**
     * Computes the percentage of the video the user has completed given
     * the length of the video and the duration needed to scrub
     * @param length String Length of the video in mm:ss format
     * @param scrubDuration Integer the scrub
     */
    static percentComplete({ length, scrubDuration }) {
        const secondsLength = (moment(length, 'mm:ss').minutes() * 60) + moment(length, 'mm:ss').seconds();
        return ((scrubDuration / secondsLength) * 100).toFixed(0);
    }


    /**
     * Renders the date when the bill will renew for the user
     */
    renderRenewalDate() {
        if(this.props.user.at_period_end === true) {
            return <span className="badge badge-pill badge-secondary py-1 px-2">Subscription Cancelled</span>
        }

        if(_.isNil(this.props.billing.next_invoice_date)) {
            return <span className="value">None</span>
        }

        return <span className="badge badge-pill badge-primary py-1 px-2">{moment.unix(this.props.billing.next_invoice_date).format('MMMM Do')}</span>
    }

    determineWidths() {
        const stages = [];
        const trialEnd = moment(moment.unix(this.props.user.trial_end).format('YYYY-MM-DD'));
        const nextInvoiceDate = moment(moment.unix(this.props.user.next_invoice_date).format('YYYY-MM-DD'));
        const hasTrial = trialEnd.isAfter(moment()) && this.props.user.next_invoice_date !== null;
        const daysLeftInTrial = trialEnd.diff(moment(), 'days');
        const monthTillNow = moment().diff(moment().startOf('month'), 'days');

        let totalWidth = 0;

        // If the user has a trial show the trial
        if(hasTrial) {
            // Determine how many days left (1 day = 2% width)
            stages.push({
                text: 'Your free trial will end',
                highlightedText: trialEnd.fromNow(),
                width: daysLeftInTrial * 2,
                color: '#24b47e',
            });

            totalWidth += daysLeftInTrial * 2;
        }

        if(this.props.user.next_invoice_date) {
            stages.push({
                text: 'You will be billed $7.00',
                highlightedText: nextInvoiceDate.fromNow(),
                width: (daysLeftInTrial * 2) + nextInvoiceDate.daysInMonth(),
                color: '#3ecf8e',
            });

            totalWidth += (daysLeftInTrial * 2) + nextInvoiceDate.daysInMonth()
        }

        if(this.props.user.unsub_timestamp) {
           const unsubTimestamp = moment(moment.unix(this.props.user.unsub_timestamp).format('YYYY-MM-DD'));
           stages.push({
               text: 'You unsubscribed',
               highlightedText: unsubTimestamp.fromNow(),
               width: 14,
               color: '#55d9c2',
           });

           totalWidth += 14;
        }

        // Push to the front of the array
        stages.unshift({
            text: 'You were not subscribed yet!',
            highlightedText: '',
            width: 100 - totalWidth,
            color: 'grey',
        });

        this.setState({ stages });
    }

    /**
     * Determines the proper icon to show
     * given the event type.
     * @param event String the events type (customer.subscription.created etc...)
     */
    static getIcon(event) {
        switch(event) {
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
        return (
            <div>
                <Confirm
                    open={this.state.confirmOpen}
                    className="confirm-delete"
                    header="Danger Zone"
                    cancelButton="Back"
                    confirmButton="Cancel Subscription"
                    content={() => {
                        return (
                            <p className="common-BodyText">
                                <strong>Warning:</strong>&nbsp;
                                This will permanently cancel your Ignite Subscription. If you are still in your trial period you will not be charged.
                                If you trial has ended your subscription will be active until the start of the next billing cycle at which time you will no
                                longer be able to access Ignite video content.
                                <br />
                                You can resubscribe at any time by <Link to="/pricing">following this link.</Link>
                            </p>
                        )
                    }}
                    onCancel={() => this.setState({ confirmOpen: false })}
                    onConfirm={async () => {
                        this.setState({ confirmOpen: false });
                        await this.unsubscribe();
                    }}
                />
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Card badgeText="Billing Status" className="pt-4">
                            <div className="slider">
                                <div className="d-flex rail">
                                    { moment().format('MMM') }
                                    {
                                        this.state.stages.map((stage, i) => {
                                            return (
                                                <div key={i} style={{ width: `${stage.width}%`, background: stage.color }} className="tooltip-container" data-tip="tooltip" data-for={`tooltip-${i}`}>
                                                    <ReactTooltip className="schema-tooltip" place="bottom" id={`tooltip-${i}`}>
                                                        <div>
                                                            {stage.text} <span className="common-Link">{ stage.highlightedText }</span>
                                                        </div>
                                                    </ReactTooltip>
                                                </div>
                                            )
                                        })
                                    }
                                    { moment().add(2, 'months').format('MMM') }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8 offset-md-2">
                                <p className="common-BodyText mt-4" align="center">
                                    Visualize your billing cycle and quickly understand when your free trial ends,
                                    how you will be charged and your subscriptions remaining duration after cancellation.
                                </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-7">
                        {/* Billing Card */}
                        <Card loading={this.props.user.isFetching} cardTitle="Billing Information" classNames={['pb-0']}>
                            <div className="d-flex flex-row justify-content-between">
                                <div className="table-responsive">
                                    <table className="table table-borderless table-sm">
                                        <tbody>
                                            <tr>
                                                <td className="key">ID</td>
                                                <td>
                                                    <span className="value-code">
                                                         { _.isNil(this.props.billing.customer_id) ? 'None' : this.props.billing.customer_id }
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="key">Plan Name</td>
                                                <td>
                                                    <span className="value">
                                                        { _.isNil(this.props.billing.plan) ? 'None' : this.props.billing.plan }
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="key">Renews On</td>
                                                <td>
                                                    { this.renderRenewalDate() }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="key">Active</td>
                                                <td>
                                                    <span className="value">
                                                        { _.isNil(this.props.billing.subscription_active) ? 'None' : this.props.billing.subscription_active }
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
                                                    { _.isNil(this.props.user.invoice_date) ?
                                                        <span className="value">None</span> :
                                                        <span className="value">
                                                        { moment.unix(this.props.user.invoice_date).format('MMM Do YYYY') }
                                                            &nbsp;
                                                            to
                                                            &nbsp;
                                                            { moment.unix(this.props.user.next_invoice_date).format('MMM Do YYYY')}
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
                                                        ${ !_.isNil(this.props.billing.next_invoice_amount) ? (this.props.billing.next_invoice_amount / 100).toFixed(2): '0.00' }
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="key">
                                                    Billing Method
                                                </td>
                                                <td>
                                                    {
                                                        !_.isNil(this.props.billing.payment_card_type) ?
                                                            <div>
                                                        <span className="value">
                                                          {/* Card image icon */}
                                                            <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg mr-2" style={{width: 16, height: 16 }}
                                                                 xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                            <g fill="none" fillRule="evenodd">
                                                                <path fill="#F6F9FC" fillRule="nonzero" d="M1 12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8z" />
                                                                <path fill="#E6EBF1" fillRule="nonzero" d="M1 12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8zm-1 0V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" />
                                                                <path fill="#1A1F71" d="M0 5V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm5 2h6a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2z" />
                                                                <path fill="#F7B600" d="M0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1H0z" />
                                                            </g>
                                                        </svg>
                                                        •••• { this.props.billing.payment_last_four }
                                                        </span>
                                                                <span className="value ml-2">
                                                         { this.props.billing.payment_card_type }
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
                                                         { this.props.billing.payment_card_type }
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
                                    (this.props.billing.premium && this.props.billing.premium !== 'false' && this.props.user.at_period_end !== true ) &&
                                    <LoaderButton
                                        isLoading={this.props.auth.isFetching}
                                        className="btn btn-danger"
                                        text="Cancel Subscription"
                                        noCommon
                                        onClick={() => this.setState({ confirmOpen: true })}>
                                    </LoaderButton>

                                }
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-5">
                        <Card
                            cardTitle="Recent Events"
                            style={{ midWidth: 0, padding: 0 }}
                            classNames={['p-0', 'mt-0', 'pb-2']}
                        >
                            {
                                this.props.auth.isFetching ?
                                    Array.from(new Array(3)).map(() => {
                                        return (
                                            <div className="p-4">
                                                <Placeholder fluid>
                                                    <Placeholder.Paragraph>
                                                        <Placeholder.Line />
                                                        <Placeholder.Line />
                                                        <Placeholder.Line />
                                                        <Placeholder.Line />
                                                    </Placeholder.Paragraph>
                                                </Placeholder>
                                            </div>
                                        )
                                    }) :
                                    <div style={{maxHeight: 240, overflowY: 'scroll'}}>
                                        <ul className="list-group">
                                            {
                                                this.props.user.events.length === 0 ?
                                                    <li className="list-group-item" style={{border: '1px solid white'}}>
                                                        <h3>No Events</h3></li> :
                                                    this.props.user.events.map((event, i) => {
                                                        return (
                                                            <li className="list-group-item"
                                                                style={{border: '1px solid white'}} key={i}>

                                                                <div className="d-flex flex-row">
                                                                    <span
                                                                        className={`${Profile.getIcon(event.type)} mr-2`}/>
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
                            }
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                    {/* Info Card */}
                    <Card loading={this.props.videos.isFetching} cardTitle="Account Information">

                        <div className="table-responsive">
                            <table className="table table-borderless table-sm">
                                <tbody>
                                    <tr>
                                        <td className="key">
                                            Name
                                        </td>
                                        <td>
                                            <span className="value">
                                                { this.props.user.name }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Email
                                        </td>
                                        <td>
                                            <span className="value">
                                                { this.props.user.email }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Subscriber
                                        </td>
                                        <td>
                                            {
                                                this.props.billing.premium ?
                                                    <span className="badge badge-pill badge-success py-1 px-2">
                                                        True
                                                    </span> :
                                                    <span className="badge badge-pill badge-warning py-1 px-2">
                                                        False
                                                    </span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Plan
                                        </td>
                                        <td>
                                            {
                                                this.props.user.plan === 'Basic Plan' ?
                                                    <span className="value">Basic Plan</span> :
                                                    <span className="value missing">No Plan</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Active
                                        </td>
                                        <td>
                                            <span className="value">
                                                { _.isNil(this.props.billing.subscription_active) ? 'None' : this.props.billing.subscription_active }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Trial End
                                        </td>
                                        <td>
                                            <span className="value">
                                                { (_.isNil(this.props.billing.trial_end) || !this.props.billing.premium) ? 'None' : <span className="badge badge-pill badge-primary px-2 py-1">{ moment.unix(this.props.billing.trial_end).fromNow() }</span> }
                                            </span>
                                        </td>
                                    </tr>
                                    {
                                        this.props.user.at_period_end === true &&
                                        <tr>
                                            <td className="key">
                                                Subscription Ends
                                            </td>
                                            <td>
                                                <span className="value">
                                                    <span className="badge badge-pill badge-secondary px-2 py-1">{ moment.unix(this.props.user.unsub_timestamp).fromNow() }</span>
                                                </span>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="ChangePassword">
                            <form onSubmit={this.handleChangeClick}>
                                <FormGroup>
                                    <label>Old Password</label>
                                    <FormControl
                                        id="oldPassword"
                                        type="password"
                                        className="form-field-default"
                                        onChange={this.handleChange}
                                        value={this.state.oldPassword}
                                    />
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <label>New Password</label>
                                    <FormControl
                                        id="password"
                                        type="password"
                                        className="form-field-default"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Confirm Password</label>
                                    <FormControl
                                        id="confirmPassword"
                                        type="password"
                                        className="form-field-default"
                                        onChange={this.handleChange}
                                        value={this.state.confirmPassword}
                                    />
                                </FormGroup>
                                <LoaderButton
                                    type="submit"
                                    text="Change Password"
                                    loadingText="Updating…"
                                    disabled={!this.validateForm()}
                                    isLoading={this.state.isChanging}
                                />
                            </form>
                        </div>
                    </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default withContainer(withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile)), { noFooterMargin: true, style: {backgroundColor: '#fff'}});
