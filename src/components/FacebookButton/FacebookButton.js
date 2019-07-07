import React, { Component } from "react";
import { Auth } from 'aws-amplify';
import { Popup } from 'semantic-ui-react';
import './FacebookButton.css';
import Log from '../../Log';
import LoaderButton from "../LoaderButton/LoaderButton";
import {IS_PROD} from "../../constants";

/**
 * Waits for the Facebook SDK to load and disables the
 * button once it is loaded
 * @returns {Promise<any>}
 */
function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

/**
 * Handles Loading and using the Facebook SDK to
 * retrieve basic_profile info from Facebook
 */
export default class FacebookButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  /**
   * Loads the SDK and waits for it to be properly mounted
   * @returns {Promise<void>}
   */
  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  /**
   * Callback when OAuth process is complete with facebook
   */
  checkLoginState = () => {
    window.FB.getLoginStatus((response) => {
      if (response.status === "connected") {
        this.handleResponse(response.authResponse);
      } else {
        Log.error(response);
      }
    });
  };

  /**
   * Opens the OAuth link with Cognito to authenticate via user pool
   * through facebook -> cognito link.
   * @returns {Promise<void>}
   */
  handleClick = async () => {
    const url_to_google = `https://ignite-app${IS_PROD ? '-prod' : ''}.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=${IS_PROD ? '57ga887esg3j7t2r89hr9nkn4c' : '29mat74dp2pep5bmh532gjepm2'}&redirect_uri=${IS_PROD ? 'https://ignitecode.net/signup' : 'http://localhost:3000/signup'}`;
    window.location.assign(url_to_google);
    // window.FB.login(this.checkLoginState, {scope: "public_profile,email"});
  };

  /**
   * Currently not in use this uses AWS Amplify to authenticat with facebook through
   * an identity pool. This returns identity pool credentials to access AWS services but
   * not user pool credentials.
   * @param data
   * @returns {Promise<void>}
   */
  async handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    this.setState({ isLoading: true });

    try {
      const response = await Auth.federatedSignIn(
          "facebook",
          { token, expires_at },
          user
      );
      this.setState({ isLoading: false });
      this.props.onLogin(response);
    } catch (e) {
      this.setState({ isLoading: false });
      this.handleError(e);
    }
  }

  render() {
    // If the user has already "clicked" the facebook button show it as disabled with a popup
    // this is to avoid users constantly re-clicking the sign-in with facebook
    if(this.props.hasAuthenticated)
        return (
            <Popup
                position="top center"
                hideOnScroll
                content="You are already signed in with Facebook. Continue with Ignite by creating a new password."
                trigger={
                  <LoaderButton
                      noCommon
                      className="btn btn-primary btn-block FacebookButton"
                      text={<span><i className="fab fa-facebook" /> Continue with Facebook</span>}
                      onClick={() => {}}
                      disabled
                  />
                }
            />
        );

    // Else just return the normal button
    return (
        <LoaderButton
            noCommon
            className="btn btn-primary btn-block FacebookButton"
            text={<span><i className="fab fa-facebook" /> Continue with Facebook</span>}
            onClick={this.handleClick}
            disabled={this.state.isLoading || this.props.disabled}
        />
    )
  }
}
