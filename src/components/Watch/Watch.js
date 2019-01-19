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
          <Container>
            <div className="d-flex flex-row justify-content-center mt-3">
                {
                  this.state.isFetching && <i className="fas fa-7x fa-circle-notch" style={{ color: '#6772e5' }} />
                }
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
                {
                  this.state.canPlay &&
                  <ReactPlayer
                      url={this.state.signedUrl}
                      playing
                  />
                }
            </div>
          </Container>
      )
  }
}

export default connect(mapStateToProps)(Watch);
