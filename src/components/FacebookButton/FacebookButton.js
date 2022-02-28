import React, { Component } from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "../LoaderButton/LoaderButton";
import Log from '../../Log';

/**
 * Waits for the Facebook SDK to load and disables the
 * button once it is loaded
 * @returns {Promise<any>}
 */

const waitForInit = () => {
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
};

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

  /**
   * Retrieves the OAuth Access token from Facebook
   * and calls the handleResponse() method to sign them
   * in with cognito
   */
  checkLoginState = () => {
    window.FB.getLoginStatus(({ status, authResponse}) => {
      if (status === "connected") {
        this.handleResponse(authResponse);
      } else {
        Log.error(status, authResponse);
        this.handleError('Error Logging user in with facebook.');
      }
    });
  };

  /**
   * Contacts facebook to retrieve the Access token for the users
   * public profile and email address.
   */
  handleClick = () => {
    window.location.replace('https://ignite-app.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=29mat74dp2pep5bmh532gjepm2&redirect_uri=http://localhost:3000/login')
    // window.FB.login(this.checkLoginState, { scope: "public_profile,email" });
  };

  /**
   * Handles any errors thrown
   * @param error
   */
  handleError(error) {
    Log.error(error);
    this.props.onError(error);
  }


  async handleResponse(data) {
    const { accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    fetch(`https://graph.facebook.com/${data.userID}?fields=name,email&access_token=${token}`)
        .then(res => res.json())
        .then(async user => {
            this.setState({ isLoading: true });

            try {
              Auth.federatedSignIn("facebook", { token, expires_at }, user)
                  .then(creds => {
                    console.log('CREDS ->', creds);
                    return Auth.currentAuthenticatedUser();
                  })
                  .then(user => {
                      console.log('USER ->', user);
                      this.setState({ isLoading: false }, () => {
                        this.props.onLogin(user);
                      });
                  }).catch(err => {
                    Log.error(err);
                    this.handleError(err);
                  });
            } catch (e) {
              this.setState({ isLoading: false });
              this.handleError(e);
            }
    }).catch(err => {
      Log.error(err);
      this.handleError(err);
    });
  }

  render() {
    return (
        <LoaderButton
            block
            bsSize="large"
            bsStyle="primary"
            className="FacebookButton"
            text={<span><i className="fab fa-facebook" /> Login with Facebook</span>}
            onClick={this.handleClick}
            disabled={this.state.isLoading}
            style={{ backgroundColor: 'rgb(72, 103, 173)', color: '#fff', marginBottom: '15px'}}
        />
    );
  }
}
