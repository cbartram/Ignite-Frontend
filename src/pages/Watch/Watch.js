import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactPlayer from 'react-player'
import {Link, withRouter} from 'react-router-dom';
import {Auth} from 'aws-amplify/lib/index';
import Markdown from 'react-markdown';
import _ from 'lodash';
import Log from '../../Log';
import {
    logout,
    updateActiveVideo,
    ping,
    askQuestion,
    findQuestions,
    answerQuestion,
} from '../../actions/actions';
import './Watch.css';
import withContainer from "../../components/withContainer";
import Modal from "../../components/Modal/Modal";
import ForumContainer from "./ForumContainer";

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user,
    videos: state.videos,
    activeVideo: state.videos.activeVideo,
    isCreatingPost: state.posts.isFetching,
    posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    updateActiveVideo: (video) => dispatch(updateActiveVideo(video)),
    ping: (payload) => dispatch(ping(payload)),
    askQuestion: (payload) => dispatch(askQuestion(payload)),
    findQuestions: (payload) => dispatch(findQuestions(payload)),
    answerQuestion: (payload) => dispatch(answerQuestion(payload)),
});

class Watch extends Component {
    constructor(props) {
        super(props);

        this.player = null; // The React Player DOM object
        this.pingInterval = null;

        this.state = {
            activeTab: 0, // Active tab for questions, practice, downloads etc...
            activeModalTab: 0,  // Active tab in modal edit/preview
            question: {
                title: '',
                content: '',
            },
            open: false,
            isFetching: false,
            playing: true,
            error: '',
            intervalSet: false, // True if the page is loaded and we are pinging the backend
            didNotify: false, // True if there was an error on the ping() and we have already notified the user. This prevents constant notifications
        }
    }

    componentDidMount() {
        if(this.props.activeVideo.name === 'null') this.props.history.push('/videos?new=true')
    }

    /**
     * Registers a setInterval() where we send the users
     * video data to the server every 30 seconds.
     */
    componentDidUpdate() {
        if (this.player !== null && typeof this.player !== 'undefined') {
            // Ensure we don't set the interval twice
            if (!this.state.intervalSet) {

                // Seek to the proper place in the video
                this.player.seekTo(this.props.videos.activeVideo.scrubDuration.toFixed(0));

                // Ping the server every 30 seconds to tell them about the user's current progress
                this.pingInterval = setInterval(() => {
                    this.props.ping({
                        email: this.props.user.email,
                        chapters: this.props.videos.videoList,
                        activeVideo: this.props.videos.activeVideo,
                        scrubDuration: this.player.getCurrentTime(),
                        started: true,
                        completed: (this.player.getCurrentTime() + 10) >= this.player.getDuration()
                    });

                    // There was an error from the ping and the user doesnt know their video data isnt being saved
                    if (this.props.videos.error !== null && !this.state.didNotify) {
                        Log.warn('Ping failed. Check internet connection', this.props.videos.error);
                        clearInterval(this.pingInterval); // Stop pinging
                        this.props.pushAlert('warning', 'Issue Saving', 'There was an issue saving your video progress. Make sure your wifi is active!');
                        this.setState({didNotify: true});
                    }

                }, 30 * 1000);

                this.setState({intervalSet: true});
            }
        }
    }

    /**
     * Called when a user navigates to a different page.
     * This function clears the ping() interval so its not constantly pinging while a user is not watching a video
     */
    componentWillUnmount() {
        if (this.pingInterval !== null) clearInterval(this.pingInterval);
    }

    /**
     * Handles updating local state whenever the title or content changes while a user is constructing a question
     * @param field String the field to update (either title or content)
     * @param value String the value to update the field with (whatever the user typed)
     */
    onChange(field, value) {
        const {question} = this.state;
        question[field] = value;
        this.setState({question})
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
        } catch (err) {
            Log.error('Failed to logout user...', err)
        }
    }

    /**
     * Holds a reference to the ReactPlayer instance to
     * retrieve real time data about the video
     * @param player
     */
    ref = player => {
        this.player = player;
    };

    /**
     * Creates a new post (question) and if successful
     * the post is stored in redux and updated on this page.
     */
    createPost() {
        if (_.size(this.state.question.title) === 0 || _.size(this.state.question.content) === 0) {
            this.props.pushAlert('danger', 'Empty Fields', 'One of your fields for your post is empty. Make sure you add both a title and some content for your question.');
        } else {
            this.props.askQuestion({
                video_id: `${this.props.videos.activeVideo.chapter}.${this.props.videos.activeVideo.sortKey}`, // Chapter.video (9.6) ch 9 vid 6,
                user: {
                    first_name: this.props.user.name.split(' ')[0],
                    last_name: this.props.user.name.split(' ')[1],
                    email: this.props.user.email,
                    avatar: 'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
                },
                title: this.state.question.title,
                content: this.state.question.content
            }).then(() => {
                // It was successful close the modal and show a success alert
                this.handleClose();
                this.setState({question: {title: '', content: ''}});
                this.props.pushAlert('success', 'Post Created', 'Your question has been posted successfully!');
            }).catch((err) => {
                Log.error(err);
                // It failed show an error
                this.props.pushAlert('danger', 'Failed to Post', 'There was an issue creating a new post. Check your internet connection and try again!');
            });
        }
    }

    /**
     * Creates a new answer using the API
     * and updates redux with the result
     * @param answer
     */
    createAnswer(answer) {
        this.props.answerQuestion(answer)
            .then(() => {
                this.props.pushAlert('success', 'Answer Posted', 'Your answer has been posted successfully!');
            }).catch((err) => {
            Log.error(err);
            // It failed show an error
            this.props.pushAlert('danger', 'Failed to Post', 'There was an issue answering this question. Check your internet connection and try again!');
        });
    }

    /**
     * Renders different content in each of the bootstrap
     * tabs depending on which tab is currently active. Active tab is tracked
     * through local state
     */
    renderTabContent() {
        switch (this.state.activeTab) {
            case 0:
                const video_id = `${this.props.videos.activeVideo.chapter}.${this.props.videos.activeVideo.sortKey}`;

                if (!_.isUndefined(this.props.posts.questions) && !_.isUndefined(this.props.posts.questions[video_id])) {
                    return <ForumContainer
                        questions={this.props.posts.questions[video_id]}
                        onQuestionAsk={() => this.handleShow()}
                        onAnswerPosted={(answer) => this.createAnswer(answer)}
                    />;
                } else {
                    return <div className="d-flex flex-column align-items-center"
                                style={{height: '100%', width: '100%'}}>
                        <span className="fa fa-2x fa-circle-notch mt-4" style={{color: '#6772e5'}}/>
                        <h4 className="common-UppercaseTitle mt-3">Loading...</h4>
                    </div>
                }
            case 1:
                return (
                    <div className="p-2">
                        <div className="d-flex ml-3">
                            <i className="far fa-file-archive fa-3x"/>
                            <div className="flex-column project-files">
                                <p className="ml-2 mb-0">Project Files</p>
                                <p className="text-muted ml-2">Zip File</p>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-2">
                        <div className="d-flex ml-3">
                            <button className="common-Button common-Button--default">
                                View Source Code
                                <i className="fab fa-github pl-2" style={{color: '#FFFFFF'}}/>
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-2">
                        <iframe
                            title="code-sandbox"
                            src="https://codesandbox.io/embed/new?codemirror=1"
                            style={{width: '100%', height: 500, border: 0, borderRadius: 4, overflow: 'hidden'}}
                            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
                        />
                    </div>
                );
        }
    }


    /**
     * Handles closing the modal programmatically
     * and removing items from the DOM which the bootstrap
     * modal creates.
     */
    handleClose() {
        document.body.className = '';
        document.body.removeChild(document.getElementsByClassName('modal-backdrop')[0]);
        this.setState({open: false});
    }

    /**
     * Handles showing the modal when the trigger button is clicked.
     */
    handleShow() {
        document.body.className = 'modal-open';
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';

        // TODO Add event listener to backdrop so that it closes modal on click
        document.body.appendChild(backdrop);
        this.setState({open: true});
    }

    render() {
        if (this.state.isFetching)
            return (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <i className="fas fa-7x fa-circle-notch" style={{color: '#6772e5'}}/>
                </div>
            );

        if (this.state.error.length > 0)
            return (
                <div className="row">
                    <div className="col-md-5 offset-md-4">
                        <h2 className="common-UppercaseTitle">Oh no!</h2>
                        <h4 className="common-IntroText">{this.state.error}</h4>
                        <Link to="/pricing" className="common-Button common-Button--default">
                            Subscribe
                        </Link>
                    </div>
                </div>
            );

        return (
            <div>
                <Modal
                    id="exampleModal"
                    title="Ask Question"
                    subtitle="Ask a question about this video and get an answer"
                    submitText="Start Discussion"
                    cancelText="Cancel"
                    open={this.state.open}
                    isLoading={this.props.isCreatingPost}
                    onClose={() => this.handleClose()}
                    onSubmitClick={() => this.createPost()}
                >
                    <div className="d-flex justify-content-center mb-3">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className="btn btn-secondary active"
                                   onClick={() => this.setState({activeModalTab: 0})}>
                                <input type="radio" name="options" id="option1" autoComplete="off"/>
                                Write &nbsp;
                                <i className="fas fa-pencil-alt"/>
                            </label>
                            <label className="btn btn-secondary" onClick={() => this.setState({activeModalTab: 1})}>
                                <input type="radio" name="options" id="option2" autoComplete="off"/>
                                Preview &nbsp;
                                <i className="fa fa-eye"/>
                            </label>
                        </div>
                    </div>
                    {
                        this.state.activeModalTab === 0 ?
                            <div>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="email" className="form-control" value={this.state.question.title}
                                           placeholder="Enter Question Title"
                                           onChange={({target}) => this.onChange('title', target.value)}/>
                                    <small className="form-text text-muted">Good questions are short
                                        specific and concise!
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label>Content</label>
                                    <textarea className="form-control" value={this.state.question.content}
                                              placeholder="Add question details..." rows="10"
                                              onChange={({target}) => this.onChange('content', target.value)}/>
                                    <small className="form-text text-muted">Hint: You can use <a
                                        href="https://guides.github.com/features/mastering-markdown/" target="_blank"
                                        rel="noopener noreferrer">markdown</a> here!
                                    </small>
                                </div>
                            </div> :
                            <Markdown
                                source={this.state.question.content.length === 0 ? 'Nothing yet!' : this.state.question.content}/>
                    }
                </Modal>
                <ReactPlayer
                    ref={this.ref}
                    url={this.props.activeVideo.signedUrl}
                    width="100%"
                    height="100%"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: '100vh',
                        minHeight: '100%',
                        marginBottom: 20
                    }}
                    playing={this.state.playing}
                    controls
                />
                <div className="video-meta-container p-3">
                    <div className="d-flex">
                        <h2 className="mr-auto">
                            {this.props.activeVideo.name}
                        </h2>
                        <h4 className="text-muted">
                            {this.props.activeVideo.length}
                        </h4>
                    </div>
                    <span className="text-muted">
                          with Christian Bartram
                      </span>
                    <p className="common-BodyText mt-2">
                        {this.props.activeVideo.description}
                    </p>
                </div>
                <div className="tab-container px-3">
                    <ul className="nav nav-tabs">
                        <li>
                            <button className={`tab ${this.state.activeTab === 0 ? 'active-tab' : ''}`}
                                    onClick={() => this.setState({activeTab: 0})}>Questions
                            </button>
                        </li>
                        <li>
                            <button className={`tab ${this.state.activeTab === 1 ? 'active-tab' : ''}`}
                                    onClick={() => this.setState({activeTab: 1})}>Downloads
                            </button>
                        </li>
                        <li>
                            <button className={`tab ${this.state.activeTab === 2 ? 'active-tab' : ''}`}
                                    onClick={() => this.setState({activeTab: 2})}>Github
                            </button>
                        </li>
                        <li>
                            <button className={`tab ${this.state.activeTab === 3 ? 'active-tab' : ''}`}
                                    onClick={() => this.setState({activeTab: 3})}>Practice
                            </button>
                        </li>
                    </ul>
                    <div>
                        {this.renderTabContent()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(Watch)), {
    sidebar: true,
    noFooterMargin: true,
    style: {background: '#fff'}
});
