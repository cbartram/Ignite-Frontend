import React, { Component } from "react";
import { Auth } from 'aws-amplify';
import './FacebookButton.css';
import LoaderButton from "../LoaderButton/LoaderButton";

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


export default class FacebookButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  statusChangeCallback = response => {
    if (response.status === "connected") {
      this.handleResponse(response.authResponse);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = () => {
    window.FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = async () => {
    const url_to_google = 'https://ignite-app.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=29mat74dp2pep5bmh532gjepm2&redirect_uri=http://localhost:3000/signup';
    window.location.assign(url_to_google);
    // window.FB.login(this.checkLoginState, {scope: "public_profile,email"});
  };

  handleError(error) {
    alert(error);
  }

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
    return (
        <LoaderButton
            noCommon
            className="btn btn-primary btn-block FacebookButton"
            text={<span><i className="fab fa-facebook" /> Continue with Facebook</span>}
            onClick={this.handleClick}
            disabled={this.state.isLoading}
        />
    );
  }
}
