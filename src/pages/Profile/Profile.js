import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {FormControl, FormGroup} from 'react-bootstrap';
import {Link, withRouter} from "react-router-dom";
import {Auth} from 'aws-amplify/lib/index';
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost';
import {Confirm, Placeholder} from 'semantic-ui-react';
import moment from 'moment/moment';
import withContainer from '../../components/withContainer';
import Card from '../../components/Card/Card';
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import './Profile.css';
import {
    fetchVideos,
    getEvents,
    loginSuccess,
    requestVideos,
    unsubscribe,
    updateActiveVideo,
    updateBillingSync,
    updateUserAttributes,
    updateVideosSync,
    videosFetched,
} from '../../actions/actions';
import Log from '../../Log';
import BillingDetails from "./BillingDetails/BillingDetails";

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
            customer: null
        };
    }

    /**
     * Sets the active video to the last video in the series
     * that the user was last watching (started: true, completed: false, scrubDuration > 0)
     */
    async componentDidMount() {
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
        return <Query
            query={gql`
                      {
                        getCustomer(id: "${this.props.user.customer_id}") {
                          name
                          id
                          sources {
                            last4
                            brand
                          }
                          subscriptions {
                            cancel_at_period_end
                            current_period_start
                            current_period_end
                            trial_end
                            status
                            plan {
                                nickname
                                amount
                            }
                          }
                        }
                      }
                    `}
        >
            {({loading, error, data}) => {
                if (error) Log.warn(error);
                console.log(data);
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
                                        This will permanently cancel your Ignite Subscription. If you are still in your
                                        trial period you will not be charged.
                                        If you trial has ended your subscription will be active until the start of the
                                        next billing cycle at which time you will no
                                        longer be able to access Ignite video content.
                                        <br/>
                                        You can resubscribe at any time by <Link to="/pricing">following this
                                        link.</Link>
                                    </p>
                                )
                            }}
                            onCancel={() => this.setState({confirmOpen: false})}
                            onConfirm={async () => {
                                this.setState({confirmOpen: false});
                                await this.unsubscribe();
                            }}
                        />
                        <div className="row">
                            <div className="col-md-7">
                                {/* Billing Card */}
                                <BillingDetails
                                    auth={this.props.auth}
                                    billing={this.props.billing}
                                    loading={loading}
                                    customer={data.getCustomer}
                                />
                            </div>
                            <div className="col-md-5">
                                <Card
                                    cardTitle="Recent Events"
                                    style={{midWidth: 0, padding: 0}}
                                    classNames={['p-0', 'mt-0', 'pb-2']}
                                >
                                    {
                                        this.props.auth.isFetching ?
                                            _.times(3, i => {
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
                                            }) :
                                            <div style={{maxHeight: 240, overflowY: 'scroll'}}>
                                                <ul className="list-group">
                                                    {
                                                        this.props.user.events.length === 0 ?
                                                            <li className="list-group-item"
                                                                style={{border: '1px solid white'}}>
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
                                                {this.props.user.name}
                                            </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="key">
                                                    Email
                                                </td>
                                                <td>
                                            <span className="value">
                                                {this.props.user.email}
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
                                            {/*{*/}
                                            {/*    data.getCustomer.subscriptions[0].cancel_at_period_end === true &&*/}
                                            {/*    <tr>*/}
                                            {/*        <td className="key">*/}
                                            {/*            Subscription Ends*/}
                                            {/*        </td>*/}
                                            {/*        <td>*/}
                                            {/*            <span className="value">*/}
                                            {/*                <span className="badge badge-pill badge-secondary px-2 py-1">{moment.unix(this.props.user.unsub_timestamp).fromNow()}</span>*/}
                                            {/*            </span>*/}
                                            {/*        </td>*/}
                                            {/*    </tr>*/}
                                            {/*}*/}
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
                                            <hr/>
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
            }}
        </Query>
    }
}

export default withContainer(withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile)), { noFooterMargin: true, style: {backgroundColor: '#fff'}});
