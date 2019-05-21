import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormGroup, FormControl } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { Auth } from 'aws-amplify/lib/index';
import moment from 'moment/moment';
import Crypto from 'crypto-js';
import { ECC_ID } from "../../constants";
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
        };
    }

    /**
     * Sets the active video to the last video in the series
     * that the user was last watching (started: true, completed: false, scrubDuration > 0)
     */
    componentDidMount() {
        try {
            if (this.props.videos.activeVideo.name === 'null') {
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
            deviceKey: this.props.auth.user.deviceKey,
            username: this.props.auth.user['cognito:username'],
            refreshToken: this.props.auth.user.refreshToken,
        }).then(async () => {
            // Decrypt localStorage info
            const bytes  = Crypto.AES.decrypt(localStorage.getItem('ECC_ID'), ECC_ID);
            const original = bytes.toString(Crypto.enc.Utf8);

            // Completely revoke all previous (stale) user tokens
            // and re-authenticate the user with new info (now cache/session is up to date)
            await Auth.signOut({ global: true });
            const user = await Auth.signIn(this.props.user.email, original);

            // Update user attributes in redux
            this.props.loginSuccess(user);
        }).catch(err => {
            Log.error(err);
            this.props.pushAlert('danger', 'Unsubscribe Failed', 'Something went wrong trying to un-subscribe you from your plan. Please try again shortly!')
        });



        //  // Attempt to make the API call
       // // To test the subscription end feature set trial_end field in DynamoDB to 1551164545
       // if(response.status <= 200) {
       //         this.props.loadingComplete(); // Turns off the loading spinners
       //         this.props.pushAlert('success', 'Subscription Cancelled', 'Your subscription has been cancelled. You will not be billed at the end of the period but can still view our videos' +
       //             'until the end of your period.');
       //         updateCache({ idToken: response.body.idToken });
       //
       //     } else {
       //          // Their subscription was cancelled immediately
       //         // Update user attributes in redux sychronously (without doing another /users/find call)
       //         this.props.updateBillingSync(response.body.user.Attributes);
       //         this.props.unsubscribeUser({
       //             'custom:customer_id': 'null',
       //             'custom:subscription_id': 'null',
       //             'custom:plan_id': 'null',
       //             'custom:plan': 'none',
       //             'custom:premium': 'false',
       //             jwtToken: response.body.idToken,
       //         });
       //         this.props.updateVideosSync([]);
       //         this.props.pushAlert('success', 'Subscription Cancelled', 'Your subscription has been cancelled. You no longer have access to view video content');
       //
       //         updateCache({ idToken: response.body.idToken });
       //     }
       // } else {
       //      // There was an error un-subscribing
       //     this.props.updateVideosSync([]);
       //     this.props.pushAlert('danger', 'Unsubscribe Failed', 'Something went wrong trying to un-subscribe you from your plan. Please try again shortly!')
       // }
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
        if(this.props.auth.user['custom:at_period_end'] === 'true') {
            return <span className="badge badge-pill badge-secondary py-1 px-2">Subscription Cancelled</span>
        }

        if(_.isNil(this.props.billing.next_invoice_date)) {
            return <span className="value">None</span>
        }

        return <span className="badge badge-pill badge-primary py-1 px-2">{moment.unix(this.props.billing.next_invoice_date).format('MMMM Do')}</span>
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-10 offset-md-1">
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
                                                    { _.isNil(this.props.billing.invoice_date) ?
                                                        <span className="value">None</span> :
                                                        <span className="value">
                                                        { moment.unix(this.props.billing.invoice_date).format('MMM Do YYYY') }
                                                            &nbsp;
                                                            to
                                                            &nbsp;
                                                            { moment.unix(this.props.billing.next_invoice_date).format('MMM Do YYYY')}
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
                                    (this.props.billing.premium && this.props.billing.premium !== 'false' && this.props.auth.user['custom:at_period_end'] !== 'true' ) &&
                                    <button className="btn btn-danger"
                                            onClick={() => this.unsubscribe()}>
                                        Cancel Subscription
                                    </button>
                                }
                            </div>
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
                                                { `${this.props.auth.user['custom:first_name']} ${this.props.auth.user['custom:last_name']}`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Email
                                        </td>
                                        <td>
                                            <span className="value">
                                                { this.props.auth.user.email }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Subscriber
                                        </td>
                                        <td>
                                            {
                                                this.props.billing.premium === 'true' ?
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
                                                this.props.auth.user['custom:plan'] === 'Basic Plan' ?
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
                                        this.props.auth.user['custom:at_period_end'] === 'true' &&
                                        <tr>
                                            <td className="key">
                                                Subscription Ends
                                            </td>
                                            <td>
                                                <span className="value">
                                                    <span className="badge badge-pill badge-secondary px-2 py-1">{ moment.unix(this.props.auth.user['custom:unsub_timestamp']).fromNow() }</span>
                                                </span>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    </div>
                    <div className="col-md-4">
                    {/* Video Card*/}
                    <Card loading={this.props.videos.isFetching} cardTitle="Your Videos">
                        <div className="table-responsive">
                            <table className="table table-borderless table-sm">
                                <tbody>
                                    <tr>
                                        <td className="key">
                                            Current Video
                                        </td>
                                        <td>
                                            {
                                                this.props.videos.activeVideo.name !== 'null' ?
                                                    <span className="value">{ this.props.videos.activeVideo.name }</span> :
                                                    <span className="value missing">None</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Length
                                        </td>
                                        <td>
                                            {
                                                this.props.videos.activeVideo.name !== 'null' ?
                                                    <span className="value-code">{ this.props.videos.activeVideo.length }</span> :
                                                    <span className="value-code missing">0:00</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Duration Completed
                                        </td>
                                        <td>
                                            {
                                                this.props.videos.activeVideo.name !== 'null' ?
                                                    <span className="value-code">{ moment.utc(this.props.videos.activeVideo.scrubDuration.toFixed(0) * 1000).format('mm:ss') }</span> :
                                                    <span className="value-code missing">0:00</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Percent Completed
                                        </td>
                                        <td>
                                            {
                                                this.props.videos.activeVideo.name !== 'null' ?
                                                    <span className="value">{Profile.percentComplete(this.props.videos.activeVideo)}%</span> :
                                                    <span className="value missing">0%</span>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    </div>
                    <div className="col-md-4">
                    {/* Update Card */}
                    <Card loading={this.props.videos.isFetching} classNames={['mb-4']} cardTitle="Update Password">
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
