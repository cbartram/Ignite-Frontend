import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Log from '../../Log';
import Container from '../Container/Container';
import { logout } from '../../actions/actions';
import './Watch.css';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
});

class Watch extends Component {
  constructor() {
    super();

    this.state = {
      isFetching: false,
      canPlay: false,
      signedUrl: '',
      error: '',
    }
  }

  componentDidMount() {
    this.setState({ isFetching: true }, async () => {
      const trackName = atob(this.props.location.search.substring(this.props.location.search.indexOf('=') + 1, this.props.location.search.length));
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': 'pgS8gGvkv53xFg4BdgECn38C4CDNZXKj8EqFtQdW'
            },
            // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
            body: JSON.stringify({
                headers: {},
                method: 'POST',
                path: '/security/signed-url/create',
                parameters: {}, // Query params
                body: {
                    resourceUrl: `https://dpvchyatyxxeg.cloudfront.net/${trackName}_Track.mov`,
                    jwtToken: this.props.auth.user.jwtToken,
                }
            }),
        };

        let response = await (await fetch('https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Development/security/signed-url/create', params)).json();
        Log.info('Signed URL Response', response);

        if(response.status === 403) {
          this.setState({ error: 'We couldn\'t find an active subscription for your account. If you would like to subscribe and view this content check out the link below!', isFetching: false });
          return;
        }

        switch(response.status) {
            case 403:
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
            default:
                this.setState({ error: `Something went wrong retrieving the videos: ${response.body.messages.join(',')}` });
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

    render() {
      if(this.state.error.length > 0)
          return (
              <Container>
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
          <Container noFooter>
                  <div className="sidebar-container">
                      <div className="my-3">
                          <img height="70" width="70" alt="thumbnail" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/170px-HTML5_logo_and_wordmark.svg.png" />
                      </div>
                      <h3 className="text-muted">HTML & CSS</h3>
                      <div className="sidebar">
                          <div className="d-flex pl-4 pr-2">
                              <small className="mr-auto">Chapter 1</small>
                              <span className="curriculum-chapterDuration">17:21</span>
                          </div>
                          <div className="d-flex flex-column align-items-start pl-4">
                              <h4 className="curriculum-heading">
                                  Introduction
                              </h4>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fa fa-check success-icon" />
                              </div>
                              <span>Overview</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fa fa-check success-icon" />
                              </div>
                              <span>Blueprint</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fa fa-check success-icon" />
                              </div>
                              <span>Git & Version Control</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fa fa-check success-icon" />
                              </div>
                              <span>CSS</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex pl-4 pr-2">
                              <small className="mr-auto">Chapter 2</small>
                              <span className="curriculum-chapterDuration">13:43</span>
                          </div>
                          <div className="d-flex flex-column align-items-start pl-4">
                              <h4 className="curriculum-heading">
                                  Javascript
                              </h4>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fa fa-check success-icon" />
                              </div>
                              <span>JQuery</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fa fa-check success-icon" />
                              </div>
                              <span>The DOM</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>Javascript Basics</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>NodeJS</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex pl-4 pr-2">
                              <small className="mr-auto">Chapter 3</small>
                              <span className="curriculum-chapterDuration">22:21</span>
                          </div>
                          <div className="d-flex flex-column align-items-start pl-4">
                              <h4 className="curriculum-heading">
                                  NodeJS
                              </h4>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>Express Framework</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>Express Framework</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>Express Framework</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>Express Framework</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                          <div className="d-flex flex-row justify-content-between align-self-center py-3 curriculum-row curriculum-row-last">
                              <div className="pl-4">
                                  <i className="fas fa-play play-icon" />
                              </div>
                              <span>Express Framework</span>
                              <span className="curriculum-chapterDuration pr-2">18:20</span>
                          </div>
                      </div>
                  </div>
                  { this.state.isFetching && <div className="d-flex justify-content-center mt-5"><i className="fas fa-7x fa-circle-notch" style={{ color: '#6772e5' }} /></div> }
                  {
                      this.state.canPlay &&
                      <ReactPlayer
                          url={this.state.signedUrl}
                          width="100%"
                          height="100%"
                          style={{
                              position: 'relative',
                              width: '80%',
                              height: '100%',
                              maxWidth: '80%',
                              maxHeight: '100vh',
                              marginLeft: 302,
                              minHeight: '100%'
                          }}
                          playing
                          controls
                      />
                  }
          </Container>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Watch);
