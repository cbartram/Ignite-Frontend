import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from "../LoaderButton/LoaderButton";
import { Auth } from 'aws-amplify';
import moment from 'moment';
import Container from '../Container/Container';
import Card from '../Card/Card';
import './Profile.css';
import {
    API_DELETE_SUBSCRIPTION,
    API_KEY,
    IS_PROD,
    PROD_API_KEY,
    getRequestUrl,
} from '../../constants';
import { updateBillingSync, updateVideosSync, requestVideos } from '../../actions/actions';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos,
    billing: state.billing,
});

const mapDispatchToProps = dispatch => ({
   updateBillingSync: (payload) => dispatch(updateBillingSync(payload)),
   updateVideosSync: (videos) => dispatch(updateVideosSync(videos)),
   requestVideos: () => dispatch(requestVideos()),
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
            showSlide: false,
        };
    }

    componentDidMount() {
        // Determines if we should show the slide icon
        const isOverflowing = this.slideable.offsetHeight < this.slideable.scrollHeight ||
            this.slideable.offsetWidth < this.slideable.scrollWidth;

        this.setState({ showSlide: isOverflowing });
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
            alert(e.message);
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
        // Dispatch an isFetching for videos so that the loading screen appears
        this.props.requestVideos();

        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY,
            },
            // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
            body: JSON.stringify({
                headers: {},
                method: 'POST',
                path: API_DELETE_SUBSCRIPTION,
                parameters: {}, // Query params
                body: {
                    email: this.props.auth.user.email
                }
            }),
        };

        // Attempt to make the API call
       let response = await (await fetch(getRequestUrl(API_DELETE_SUBSCRIPTION), params)).json();

       // Update user attributes in redux sychronously (without doing another /users/find call)
       this.props.updateBillingSync(response.body.user.Attributes);
       this.props.updateVideosSync([]);
    }



    render() {
        let currentVideo = null;
        if(!this.props.videos.isFetching) {
            // TODO if we ever fail to retrieve the videoList from the API this page will break
            currentVideo = this.props.videos.videoList.sort((a, b) => a.scrubDuration - b.scrubDuration)[0];
        }

        return (
            <Container noFooterMargin style={{backgroundColor: '#fff'}}>
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        {/* Billing Card */}
                        <Card loading={this.props.videos.isFetching} cardTitle="Billing Information" classNames={['pb-0']}>
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
                                                    {
                                                        _.isNil(this.props.billing.next_invoice_date) ?
                                                            <span className="value">
                                                            None
                                                        </span> :
                                                            <span className="badge badge-pill badge-primary py-1 px-2">
                                                            {moment.unix(this.props.billing.next_invoice_date).format('MMMM Do')}
                                                        </span>
                                                    }
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
                                    // Only show the button to user's who are subscribed
                                    (this.props.billing.premium && this.props.billing.premium !== 'false' ) &&
                                    <button className="common-Button common-Button--danger"
                                            onClick={() => this.unsubscribe()}>
                                        Cancel Subscription
                                    </button>
                                }
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between pl-4 card-slideable" ref={(el) => this.slideable = el}>
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
                                </tbody>
                            </table>
                        </div>
                    </Card>
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
                                                !_.isNil(currentVideo) ?
                                                    <span className="value">{ currentVideo.name }</span> :
                                                    <span className="value missing"> None </span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Length
                                        </td>
                                        <td>
                                            {
                                                !_.isNil(currentVideo) ?
                                                    <span className="value-code">{ currentVideo.length }</span> :
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
                                                !_.isNil(currentVideo) ?
                                                    <span className="value-code">{ currentVideo.scrubDuration }</span> :
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
                                                !_.isNil(currentVideo) ?
                                                    <span className="value">{ currentVideo.percentComplete }%</span> :
                                                    <span className="value missing">0%</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="key">
                                            Next Video
                                        </td>
                                        <td>
                                            {
                                                !_.isNil(currentVideo) ?
                                                    <span className="value">{ this.props.videos.videoList.filter(v => v.id === currentVideo.next)[0].name }</span> :
                                                    <span className="value missing">None</span>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    {/* Update Card */}
                    <Card loading={this.props.videos.isFetching} classNames={['mb-4']} cardTitle="Update Password">
                        <div className="ChangePassword">
                            <form onSubmit={this.handleChangeClick}>
                                <FormGroup bsSize="large" controlId="oldPassword">
                                    <ControlLabel>Old Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        className="form-field-default"
                                        onChange={this.handleChange}
                                        value={this.state.oldPassword}
                                    />
                                </FormGroup>
                                <hr />
                                <FormGroup bsSize="large" controlId="password">
                                    <ControlLabel>New Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        className="form-field-default"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup bsSize="large" controlId="confirmPassword">
                                    <ControlLabel>Confirm Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        className="form-field-default"
                                        onChange={this.handleChange}
                                        value={this.state.confirmPassword}
                                    />
                                </FormGroup>
                                <LoaderButton
                                    block
                                    type="submit"
                                    bsSize="large"
                                    text="Change Password"
                                    loadingText="Updating…"
                                    disabled={!this.validateForm()}
                                    isLoading={this.state.isChanging}
                                />
                            </form>
                        </div>
                    </Card>
                </div>
                {
                    this.state.showSlide &&
                    <div className="d-flex flex-row justify-content-center ">
                        <div className="badge badge-pill badge-secondary">
                            <i className="fas fa-2x fa-ellipsis-h" />
                        </div>
                    </div>
                }
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
