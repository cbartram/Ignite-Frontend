import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom';
import Log from '../../Log';
import Container from '../Container/Container';
import './Watch.css';

const mapStateToProps = state => ({
    auth: state.auth,
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
      const trackName = this.props.location.search.substring(this.props.location.search.indexOf('=') + 1, this.props.location.search.length);
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
          this.setState({ error: 'We couldn\'t find an active subscription for your account. If you would like to subscribe and view this content check out the link below!', isFetching: false })
        }

        if(response.status === 200 && ReactPlayer.canPlay(response.body.signedUrl)) {
            this.setState({
                signedUrl: response.body.signedUrl,
                canPlay: true,
                isFetching: false,
                error: '',
            });
        }
    });

  }

    render() {
      return (
          <Container style={{marginBottom: '0px!important;'}}>
              <div className="row">
                  <div className="col-md-3 pr-0">
                      <div className="course-viewer-sidebar pl-5 pr-2">
                          <div className="my-3">
                              <img height="70" width="70" alt="thumbnail" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/170px-HTML5_logo_and_wordmark.svg.png" />
                          </div>
                          <h3 className="text-muted">HTML & CSS</h3>
                          <div className="overflow">
                              <div className="d-flex">
                                  <small className="mr-auto">Chapter 1</small>
                                  <span className="curriculum-chapterDuration">17:21</span>
                              </div>
                              <div className="d-flex flex-column align-items-start">
                                  <h4 className="curriculum-heading">
                                      Introduction
                                  </h4>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>Overview</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>Blueprint</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>Git & Version Control</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>HTML</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>HTML</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>CSS Basics</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                              <div className="d-flex flex-row justify-content-between align-self-center my-3 py-3 curriculum-row">
                                  <i className="fa fa-check" style={{ color: 'green' }} />
                                  <span>Javascript Basics</span>
                                  <span className="curriculum-chapterDuration">18:20</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="col-md-9 pl-0">
                      {
                          this.state.error.length > 0 &&
                          <div className="row">
                              <div className="col-md-5 offset-md-4">
                                  <h2 className="common-UppercaseTitle">Oh no!</h2>
                                  <h4 className="common-IntroText">{this.state.error}</h4>
                                  <Link to="/pricing" className="common-Button common-Button--default">
                                      Subscribe
                                  </Link>
                              </div>
                          </div>
                      }
                      { this.state.isFetching && <i className="fas fa-7x fa-circle-notch" style={{ color: '#6772e5' }} /> }
                      {
                          this.state.canPlay &&
                          <ReactPlayer
                              url={this.state.signedUrl}
                              width="100%"
                              height="100%"
                              style={{
                                  width: '100%',
                                  height: '100%',
                                  minWidth: '100%',
                                  minHeight: '100%'
                              }}
                              playing
                              controls
                          />
                      }
                  </div>
              </div>
          </Container>
      )
  }
}

export default connect(mapStateToProps)(Watch);
