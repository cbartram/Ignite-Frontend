import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
      let currentVideo = null;
      if(!this.props.videos.isFetching)
        currentVideo = this.props.videos.videoList.sort((a, b) => a.scrubDuration - b.scrubDuration)[0];

      return (
          <Container>
              <div className="row">
                  <div className="col-md-8 offset-md-2">
                      {/* Billing Card */}
                      <Card cardTitle="Billing Information">
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
                                    { this.props.billing.customer_id }
                                </span>
                                  <span className="value">
                                    { this.props.billing.plan }
                                </span>
                                <span className="badge badge-pill badge-primary">
                                    { moment(this.props.billing.next_invoice_date).format('MMMM Do') }
                                </span>
                                <span className="value">
                                    { this.props.billing.subscription_active }
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
                                  <span className="value">
                                    { moment(this.props.billing.invoice_date).format('MMM Do YYYY') }
                                    &nbsp;
                                    to
                                    &nbsp;
                                    { moment(this.props.billing.next_invoice_date).format('MMM Do YYYY')}
                                </span>
                                  <span className="value-code value-lg">
                                    ${ (this.props.billing.next_invoice_amount / 100).toFixed(2) }
                                </span>
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
                              </div>
                          </div>
                      </Card>
                  </div>
              </div>
            <div className="d-flex flex-row justify-content-between pl-4">
                {/* Info Card */}
              <Card badgeText="Your Information">
                  <div className="d-flex flex-row">
                      <h4>Name:</h4>
                      <span className="pl-2 pt-1">{ `${this.props.auth.user['custom:first_name']} ${this.props.auth.user['custom:last_name']}`}</span>
                  </div>
                  <div className="d-flex flex-row">
                      <h4>Email:</h4>
                      <span className="pl-2 pt-1">{this.props.auth.user['email']}</span>
                  </div>
                  <div className="d-flex flex-row">
                      <h4>Premium:</h4>
                      {
                          this.props.auth.user['custom:premium'] === 'true' ?
                              <span className="badge badge-success pt-2 ml-2 mb-2">True</span> :
                              <span className="badge badge-danger">False</span>
                      }
                  </div>
                  <div className="d-flex flex-row">
                      <h4>Plan:</h4>
                      {
                          this.props.auth.user['custom:plan'] === 'Basic Plan' ?
                              <span className="badge badge-success pt-2 ml-2">Basic Plan</span> :
                              <span className="badge badge-danger">No Plan</span>
                      }
                  </div>
              </Card>
                {/* Video Card*/}
                <Card badgeText="Video Data">
                    {
                        this.props.auth.user['custom:premium'] === 'false' &&
                        <div className="d-flex flex-row justify-content-center">
                            <h3>You haven't subscribed to watch videos yet</h3>
                            <Link to="/pricing" className="common-Button common-Button--default">
                                Subscribe Now
                            </Link>
                        </div>
                    }
                    <div className="d-flex flex-row">
                        <h4>Current Video:</h4>
                        {
                            currentVideo !== null &&
                            <span className="pl-2 pt-1">{ currentVideo.name }</span>
                        }
                    </div>
                    <div className="d-flex flex-row">
                        <h4>Length:</h4>
                        {
                            currentVideo !== null &&
                            <span className="pl-2 pt-1">{ currentVideo.length }</span>
                        }
                    </div>
                    <div className="d-flex flex-row">
                        <h4>Duration Completed:</h4>
                        {
                            currentVideo !== null &&
                            <span className="pl-2 pt-1">{ currentVideo.scrubDuration }</span>
                        }
                    </div>
                    <div className="d-flex flex-row">
                        <h4>Percent Completed:</h4>
                        {
                            currentVideo !== null &&
                            <span className="pl-2 pt-1">{ currentVideo.percentComplete }%</span>
                        }
                    </div>
                    <div className="d-flex flex-row">
                        <h4>Next Video:</h4>
                        {/* Todo this could be null if there is no next video */}
                        {
                            currentVideo !== null &&
                            <span className="pl-2 pt-1">{ this.props.videos.videoList.filter(v => v.id === currentVideo.next)[0].name }</span>
                        }
                    </div>
                </Card>
                {/* Update Card */}
                <Card badgeText="Update Password">
                    <h4>Change your Password</h4>
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
