import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from "../Container/Container";
import './Tracks.css';

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Tracks extends Component {
    constructor() {
        super();

        this.state = {
            tracks: [{
                name: 'HTML',
                description: 'Learn HTML and how to make some awesome web pages',
                image: 'https://en.wikipedia.org/wiki/File:HTML5_logo_and_wordmark.svg'
            }, {
                name: 'Javascript',
                description: 'Learn what javascript is so you can use it in your websites',
                image: 'https://www.google.com/imgres?imgurl=https://cdn-images-1.medium.com/max/1052/1*DN7ToydkJZEdVaJVK_Nhvw.png'
            }, {
                name: 'Python',
                description: 'Learn what python is so you can do some really neat stuff with data science and machine learning',
                image: 'https://www.python.org/static/opengraph-icon-200x200.png'
            }]
        }
    }

    render() {

        if(this.props.videos.isFetching)
            return (
                <Container>
                    <div className="d-flex justify-content-center mt-5">
                        <i className="fas fa-7x fa-circle-notch" style={{ color: '#6772e5' }} />
                    </div>
                </Container>
            );

        return (
            <Container>
                <div className="d-flex flex-row justify-content-center">
                    <h1>Your Recent Videos</h1>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="d-flex flex-row justify-content-between">
                            {
                                this.props.videos.videoList.map(track => {
                                    return (
                                        <div className="common-Card m-2" key={track.name}>
                                            <div className="cover" />
                                            <h2 className="common-IntroText">{track.name}</h2>
                                            <p className="common-BodyText">
                                                {console.log(track)}
                                                {track.length}
                                            </p>
                                            <span className="text-muted">
                                                {track.percentComplete === 0 ? 'Not Started' : `${track.percentComplete}% complete!`}
                                            </span>
                                            <Link to={`/watch?v=${btoa(unescape(encodeURIComponent(track.id)))}`} className="common-Button common-Button--default mt-2">
                                                Start Now
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Container>
        )
    }
}

export default connect(mapStateToProps)(Tracks);
