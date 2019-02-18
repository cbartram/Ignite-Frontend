import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player'
import { Link, withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import _ from 'lodash';
import Log from '../../Log';
import Container from '../Container/Container';
import { logout, updateActiveVideo, } from '../../actions/actions';
import {
    API_FETCH_SIGNED_URL,
    API_KEY,
    IS_PROD,
    PROD_API_KEY,
    getRequestUrl,
} from '../../constants';
import Alert from '../Alert/Alert';
import AlertContainer from '../AlertContainer/AlertContainer';
import './Watch.css';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    updateActiveVideo: (video) => dispatch(updateActiveVideo(video))
});

class Watch extends Component {
  constructor() {
    super();

    this.state = {
      isFetching: false,
      canPlay: false,
      playing: true,
      signedUrl: '',
      error: '',
      alerts: [],
    }
  }

  componentDidMount() {
    this.setState({ isFetching: true }, async () => {
        const video = this.props.videos.activeVideo;
        if(video.name === 'null') {
            try {
                const videoName = decodeURI(atob(this.props.location.search.substring(this.props.location.search.indexOf('=') + 1, this.props.location.search.length)));
                // Find the active video from the backup url query param
                const activeVideo = _.flattenDeep(this.props.videos.videoList.map(chapter => chapter.videos))
                    .filter(video => video.name === videoName)[0];

                if (typeof activeVideo === 'undefined') {
                    // User will need to select a new video something went wrong
                    this.props.history.push('/videos');
                }
                this.props.updateActiveVideo(activeVideo);
                this.props.history.push('/videos'); // TODO its not fast enough or something
            } catch(err) {
                Log.error(err);
                this.props.history.push('/videos');
            }
        }


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
                path: API_FETCH_SIGNED_URL,
                parameters: {}, // Query params
                body: {
                    resourceUrl: `${IS_PROD ? 'https://d2hhpuhxg00qg.cloudfront.net' : 'https://dpvchyatyxxeg.cloudfront.net'}/chapter${video.chapter}/${video.s3Name}.mov`,
                    jwtToken: this.props.auth.user.jwtToken,
                }
            }),
        };

        let response = await (await fetch(getRequestUrl(API_FETCH_SIGNED_URL), params)).json();
        Log.info('Signed URL Response', response);

        switch(response.status) {
            case 403:
                this.pushAlert('warning', 'No Subscription', 'We couldn\'t find an active subscription for your account.');
                this.setState({ error: 'We couldn\'t find an active subscription for your account. If you would like to subscribe and view this content check out the link below!', isFetching: false });
                break;
            case 501:
                // The JWT token is more than likely expired re-authenticate
                await this.logout();
                break;
            case 200:
                if(ReactPlayer.canPlay(response.body.signedUrl))
                    this.setState({
                        signedUrl: response.body.signedUrl,
                        canPlay: true,
                        isFetching: false,
                        error: '',
                    });
                break;
            case 500:
                this.pushAlert('warning', 'No Subscription', 'We couldn\'t find an active subscription for your account.');
                this.setState({ error: 'We couldn\'t find an active subscription for your account. If you would like to subscribe and view this content check out the link below!', isFetching: false });
                break;
            default:
                this.pushAlert('danger', 'Oh No', 'Something went wrong retrieving the videos.');
                // Only show detailed information when its NOT production.
                this.setState({ error: `Something went wrong retrieving the videos refresh the page to try again. ${!IS_PROD && response.body.messages.join(',')}` });
        }
    });
  }

    /**
     * Handles logging the user out by removing cookies/session history
     * @returns {Promise<void>}
     */
    async logout() {
        Log.info('JWT is expired re-authenticating');
        try {
            await Auth.signOut();
            this.props.logout();
        } catch(err) {
            Log.error('Failed to logout user...', err)
        }
    }

    /**
     * Pushes an alert onto the stack to be
     * visible by users
     */
    pushAlert(type, title, message, id = _.uniqueId()) {
        const { alerts } = this.state;
        // Push an object of props to be passed to the <Alert /> Component
        alerts.push({
            type,
            title,
            id,
            message,
        });

        this.setState({ alerts });
    }

    /**
     * Removes an alert from the stack so that
     * it is no longer rendered on the page
     * @param id Integer the unique alert id
     */
    removeAlert(id) {
        const { alerts } = this.state;
        const newAlerts = [
            ...alerts.filter(alert => alert.id !== id)
        ];

        this.setState({ alerts: newAlerts });
    }

    render() {
        if(this.state.isFetching)
            return (
                <Container>
                    <div className="d-flex justify-content-center mt-5">
                        <i className="fas fa-7x fa-circle-notch" style={{ color: '#6772e5' }} />
                    </div>
                </Container>
            );

        if(this.state.error.length > 0)
          return (
              <Container>
                  <AlertContainer>
                      { this.state.alerts.map((props, index) =>
                          <Alert key={index} onDismiss={() => this.removeAlert(props.id)} {...props}>
                              {props.message}
                          </Alert>
                      )
                      }
                  </AlertContainer>
                <div className="row">
                    <div className="col-md-5 offset-md-4">
                        <h2 className="common-UppercaseTitle">Oh no!</h2>
                        <h4 className="common-IntroText">{this.state.error}</h4>
                        <Link to="/pricing" className="common-Button common-Button--default">
                            Subscribe
                        </Link>
                    </div>
                </div>
              </Container>
          );

      return (
          <Container sidebar noFooterMargin>
              <AlertContainer>
                  { this.state.alerts.map((props, index) =>
                      <Alert key={index} onDismiss={() => this.removeAlert(props.id)} {...props}>
                          {props.message}
                      </Alert>
                  )
                  }
              </AlertContainer>
                  {
                      this.state.canPlay &&
                      <ReactPlayer
                          url={this.state.signedUrl}
                          width="100%"
                          height="100%"
                          style={{
                              position: 'relative',
                              width: '100%',
                              height: '100%',
                              maxWidth: '100%',
                              maxHeight: '100vh',
                              minHeight: '100%'
                          }}
                          playing={this.state.playing}
                          onClick={() => this.setState(prev => ({ playing: !prev.playing }))}
                          controls
                      />
                  }
          </Container>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Watch));
