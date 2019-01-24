import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../LoaderButton/LoaderButton";
import { Auth } from "aws-amplify";
import Container from "../Container/Container";
import './Profile.css';
import Card from '../Card/Card';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos,
});

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

    validateForm() {
        return (
            this.state.oldPassword.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

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

            this.props.history.push('/profile');
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
            <div className="d-flex flex-row justify-content-left pl-4">
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
                <Card badgeText="Update your Information">
                    <h4>Change your Password</h4>
                    <div className="ChangePassword">
                        <form onSubmit={this.handleChangeClick}>
                            <FormGroup bsSize="large" controlId="oldPassword">
                                <ControlLabel>Old Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    onChange={this.handleChange}
                                    value={this.state.oldPassword}
                                />
                            </FormGroup>
                            <hr />
                            <FormGroup bsSize="large" controlId="password">
                                <ControlLabel>New Password</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup bsSize="large" controlId="confirmPassword">
                                <ControlLabel>Confirm Password</ControlLabel>
                                <FormControl
                                    type="password"
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
                    <h4>Change your Email</h4>
                </Card>
                {/* Billing Card */}
                <Card badgeText="Billing Information">
                </Card>
            </div>
          </Container>
      )
  }
}

export default connect(mapStateToProps)(Profile);
