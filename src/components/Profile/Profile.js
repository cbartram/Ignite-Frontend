import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from "../LoaderButton/LoaderButton";
import { Auth } from 'aws-amplify';
import moment from 'moment';
import Container from '../Container/Container';
import Card from '../Card/Card';
import './Profile.css';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos,
    billing: state.billing,
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
            confirmPassword: ""
        };
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



    render() {
        console.log(this.props.auth);
        let currentVideo = null;
        if(!this.props.videos.isFetching) {
            currentVideo = this.props.videos.videoList.sort((a, b) => a.scrubDuration - b.scrubDuration)[0];
        }

        return (
            <Container>
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        {/* Billing Card */}
                        <Card cardTitle="Billing Information" classNames={['pb-0']}>
                            <div className="d-flex flex-row justify-content-between">
                                {/* Keys*/}
                                <div className="d-flex flex-column align-items-left align-self-center px-3">
                                <span className="key">
                                    ID
                                </span>
                                    <span className="key">
                                    Plan Name
                                </span>
                                    <span className="key">
                                    Renews On
                                </span>
                                    <span className="key">
                                    Active
                                </span>
                                </div>
                                {/* Values */}
                                <div className="d-flex flex-column align-items-left align-self-center px-3">
                                  <span className="value-code">
                                    { _.isNil(this.props.billing.customer_id) ? 'None' : this.props.billing.customer_id }
                                </span>
                                    <span className="value">
                                        { _.isNil(this.props.billing.plan) ? 'None' : this.props.billing.plan }
                                    </span>
                                    {
                                        _.isNil(this.props.billing.next_invoice_date) ?
                                            <span className="value">
                                                None
                                            </span> :
                                            <span className="badge badge-pill badge-primary py-1 px-0">
                                                {moment.unix(this.props.billing.next_invoice_date).format('MMMM Do')}
                                            </span>
                                    }
                                    <span className="value">
                                        { _.isNil(this.props.billing.subscription_active) ? 'None' : this.props.billing.subscription_active }
                                    </span>
                                </div>
                                {/* Keys (2) */}
                                <div className="d-flex flex-column align-items-left align-self-center px-3">
                                <span className="key">
                                    Current Period
                                </span>
                                    <span className="key">
                                    Payment Amount
                                </span>
                                    <span className="key">
                                    Billing Method
                                </span>
                                    <span className="key">
                                    Card Brand
                                </span>
                                </div>
                                {/* Values (2) */}
                                <div className="d-flex flex-column align-items-left align-self-center px-3">
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
                                    <span className="value-code value-lg">
                                        ${ !_.isNil(this.props.billing.next_invoice_amount) ? (this.props.billing.next_invoice_amount / 100).toFixed(2): '0.00' }
                                    </span>
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
                                                <span className="value">
                                                 { this.props.billing.payment_card_type }
                                                </span>
                                            </div> :
                                            null
                                    }
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-start mt-3">
                                <button className="common-Button text-danger no-hover">
                                    {/* TODO Implement this */}
                                    Cancel Subscription
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between pl-4">
                    {/* Info Card */}
                    <Card cardTitle="Account Information">
                        <div className="d-flex flex-row justify-content-between">
                            {/* Keys*/}
                            <div className="d-flex flex-column align-items-left align-self-center px-3">
                                <span className="key">
                                    Name
                                </span>
                                <span className="key">
                                    Email
                                </span>
                                <span className="key">
                                    Subscriber
                                </span>
                                <span className="key">
                                    Plan
                                </span>
                                <span className="key">
                                    Active
                                </span>
                                <span className="key">
                                    Trial End
                                </span>
                            </div>
                            {/* Values */}
                            <div className="d-flex flex-column align-items-left align-self-center px-3">
                                  <span className="value">
                                    { `${this.props.auth.user['custom:first_name']} ${this.props.auth.user['custom:last_name']}`}
                                </span>
                                <span className="value">
                                    { this.props.auth.user.email }
                                </span>

                                {
                                    this.props.auth.user['custom:premium'] === 'true' ?
                                        <span className="badge badge-pill badge-success py-1 px-0">
                                  True
                              </span> :
                                        <span className="badge badge-pill badge-warning py-1 px-0">
                                  False
                              </span>
                                }
                                {
                                    this.props.auth.user['custom:plan'] === 'Basic Plan' ?
                                        <span className="value">Basic Plan</span> :
                                        <span className="value missing">No Plan</span>
                                }
                                <span className="value">
                                        { _.isNil(this.props.billing.subscription_active) ? 'None' : this.props.billing.subscription_active }
                                </span>
                                <span className="value">
                                    { _.isNil(this.props.billing.trial_end) ? 'None' : <span className="badge badge-pill badge-primary">{ moment.unix(this.props.billing.trial_end).fromNow() }</span> }
                                </span>
                            </div>
                        </div>
                    </Card>
                    {/* Video Card*/}
                    <Card cardTitle="Your Videos">
                        <div className="d-flex flex-row justify-content-between">
                            {/* Keys*/}
                            <div className="d-flex flex-column align-items-left align-self-center px-3">
                                <span className="key">
                                    Current Video
                                </span>
                                <span className="key">
                                    Length
                                 </span>
                                <span className="key">
                                    Duration Completed
                                 </span>
                                <span className="key">
                                    Percent Completed
                                </span>
                                <span className="key">
                                    Next Video
                                </span>
                            </div>
                            {/* Values */}
                            <div className="d-flex flex-column align-items-left align-self-center px-3">
                                {
                                    !_.isNil(currentVideo) ?
                                        <span className="value">{ currentVideo.name }</span> :
                                        <span className="value missing"> None </span>
                                }
                                {
                                    !_.isNil(currentVideo) ?
                                        <span className="value-code">{ currentVideo.length }</span> :
                                        <span className="value-code missing">0:00</span>
                                }
                                {
                                    !_.isNil(currentVideo) ?
                                        <span className="value-code">{ currentVideo.scrubDuration }</span> :
                                        <span className="value-code missing">0:00</span>
                                }
                                {
                                    !_.isNil(currentVideo) ?
                                        <span className="value">{ currentVideo.percentComplete }%</span> :
                                        <span className="value missing">0%</span>
                                }
                                {/* Todo this could be null if there is no next video */}
                                {
                                    !_.isNil(currentVideo) ?
                                        <span className="value">{ this.props.videos.videoList.filter(v => v.id === currentVideo.next)[0].name }</span> :
                                        <span className="value missing">None</span>
                                }
                            </div>
                        </div>
                    </Card>
                    {/* Update Card */}
                    <Card cardTitle="Update Password">
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
            </Container>
        )
    }
}

export default connect(mapStateToProps)(Profile);
