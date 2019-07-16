import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import {Image, Search,} from 'semantic-ui-react';
import {findQuestions, getSignedUrl, hideErrors, logout, updateActiveVideo,} from '../../actions/actions';
import {Auth} from 'aws-amplify';
import Log from '../../Log';
import './Navbar.css';
import Sidebar from "../Sidebar/Sidebar";
import Logo from '../../resources/images/logo.png';
import {IS_PROD} from "../../constants";
import {matchSearchQuery} from "../../util";

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user,
    videos: state.videos,
    quizzes: state.quizzes.quizList
});

const mapDispatchToProps = dispatch => ({
   logout: () => dispatch(logout()),
   hideErrors: () => dispatch(hideErrors()),
   findQuestions: (payload) => dispatch(findQuestions(payload)),
   getSignedUrl: (payload) => dispatch(getSignedUrl(payload)),
   updateActiveVideo: (payload) => dispatch(updateActiveVideo(payload)),
});

/**
 * Shows the Navbar at the top of the page.
 */
class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false, // True if the sidebar is active
            results: [], // Holds the results of the search
            data: [], // Holds the full list of data being searched
            value: '',
            query: '', // Used in the sidebar
            isLoading: false,
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleResultSelect = this.handleResultSelect.bind(this);
    }

    /**
     * Formats data appropriately for the dropdown by
     * combining all videos into 1 big list
     */
    componentDidMount() {
        // Navbar is also used on pages where the users are logged out
        // ensure quizzes and videos are defined before mapping over them
            const quizList = this.props.quizzes.map(quiz => ({
                id: quiz.id,
                complete: quiz.complete,
                title: quiz.name,
                chapter: quiz.chapter,
                type: 'QUIZ',
                name: quiz.name,
                childKey: quiz.id,
                // as: Navbar.renderSearchRow,
            }));
            const masterList = this.props.videos.videoList
                .reduce((acc, curr) => [...acc, ...curr.videos], [])
                .map(video => ({
                    ...video,
                    title: video.name,
                    name: video.name,
                    type: 'VIDEO',
                    childKey: `${video.chapter}.${video.sortKey}`,
                    // as: Navbar.renderSearchRow,
                }))
                .concat(quizList);

            this.setState({data: masterList});
    }

    /**
     * Renders a single row in the search dropdown
     */
    renderSearchRow(item) {
        return (
            <div className="d-flex align-items-center px-3 py-2 search-row-item">
                <div className={`modal-sq-pill ${item.type === 'VIDEO' ? 'teal-label' : 'green-label' }`}>
                    { item.type === 'VIDEO' ? <strong>V</strong> : <strong>Q</strong>}
                </div>
                <div className="d-flex flex-column">
                    {matchSearchQuery(this.state.value, item.name, item.type === 'QUIZ')}
                    <small className="text-muted">Chapter {item.chapter}</small>
                </div>
            </div>
        )
    }

    /**
     * Handles re-directing a user to the appropriately selected
     * content
     * @param e Object React Synthetic event object from the click handler
     * @param item Object item being selected { name, chapter, type }
     */
    handleResultSelect(e, { result }) {
        if(result.type === 'QUIZ') {
            this.props.history.push(`/quiz?q=${btoa(result.id)}${result.complete ? '&retake=true' : '' }`);
        } else {
            this.setState({ isLoading: true }, async () => {

                const vid = `${result.chapter}.${result.sortKey}`;
                try {
                    // Fetch data for the video including its signed url, questions, and set it as active
                    await this.props.getSignedUrl({
                        video: result,
                        resourceUrl: `${IS_PROD ? 'https://d2hhpuhxg00qg.cloudfront.net' : 'https://dpvchyatyxxeg.cloudfront.net'}/chapter${result.chapter}/${result.s3Name}.mov`,
                        subscriptionId: this.props.user.subscription_id,
                    });

                    await this.props.findQuestions(vid);
                    this.setState({ isLoading: false });
                    this.props.history.push('/watch');
                } catch(err) {
                    Log.error(err);
                    this.setState({ isLoading: false });
                }
            });
        }
    }

    /**
     * Handles performing a simple search for videos or quizzes
     * @param e Event object
     * @param value String search query
     */
    handleSearchChange(e, { value }) {
        let { data } = this.state;

        // A simple filter should work for this use case
        data = data.filter(videoOrQuiz => videoOrQuiz.title.toUpperCase().includes(value.toUpperCase()));

        this.setState({results: data, value})
    }

    /**
     * Handles logging the user out by removing cookies/session history
     * @returns {Promise<void>}
     */
    async logout() {
        Log.info('Logging out...');
        try {
            await Auth.signOut({ global: true });
            this.props.logout();
        } catch(err) {
            Log.error('Failed to logout user...', err)
        }
    }

    /**
     * Unlocks the ability to scroll once this component
     * un mounts
     */
    componentWillUnmount() {
        this.props.restoreScroll();
    }


    /**
     * Hides any errors when each of the links are clicked.
     */
    handleLinkClick() {
        this.props.hideErrors();
    }

    render() {
        const authLinks = [
            <Link className="nav-item nav-link p-3 text-dark" to="/videos" key="videos" onClick={() => this.handleLinkClick()}>Videos</Link>,
            <Link className="nav-item nav-link p-3 text-dark" to="/pricing" key="pricing" onClick={() => this.handleLinkClick()}>Pricing</Link>,
        ];
        const standardLinks = [
            <Link className="nav-item nav-link p-3 text-dark" to="/login" key="login" onClick={() => this.handleLinkClick()}>Login</Link>,
            <Link className="nav-item nav-link p-3 text-dark" to="/signup" key="signup" onClick={() => this.handleLinkClick()}>Sign Up</Link>,
            <Link className="nav-item nav-link p-3 text-dark" to="/pricing" key="pricing" onClick={() => this.handleLinkClick()}>Pricing</Link>,
        ];

        return (
            <div>
            <div className="navbar navbar-expand-md bg-white border-bottom shadow-sm">
                <a className="navbar-brand" href="/">
                    <img src={Logo} width="30" height="30" alt="Ignite Logo" />
                </a>
                {
                    this.props.auth.isAuthenticated &&
                    <Search
                        className="global-search"
                        placeholder="Search"
                        loading={this.state.isLoading}
                        onResultSelect={(e, f) => this.handleResultSelect(e, f)}
                        onSearchChange={debounce(this.handleSearchChange, 300, { leading: true })}
                        results={this.state.results}
                        value={this.state.value}
                        resultRenderer={(item) => this.renderSearchRow(item)}
                    />
                }
                <div className="ml-auto">
                    <div className="navbar-nav">
                    { this.props.auth.user ? authLinks.map(link => link) : standardLinks.map(link => link) }
                    <Link className="nav-item nav-link p-3 text-dark" to="/support" onClick={() => this.handleLinkClick()}>Support</Link>
                        <ul className="dropdown-list">
                            {
                                this.props.auth.user && (
                                    <li className="nav-item dropdown user-avatar">
                                        <button className="btn btn-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown">
                                            <Image src="https://a0.muscache.com/im/users/27691369/profile_pic/1423840072/original.jpg?aki_policy=profile_small" avatar />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right header-nav-item-profile-dropdown mt-2 py-0">
                                            <h4 className="dropdown-title">
                                                <Link to="/profile" className="header-nav-item-profile-dropdown-title-link dropdown-link">
                                                    <strong className="header-nav-item-profile-dropdown-title-name">
                                                        {this.props.auth.user.name}
                                                    </strong>
                                                    <span className="header-nav-item-profile-dropdown-title-label">View Profile</span>
                                                </Link>
                                            </h4>
                                            <Link className="dropdown-item dropdown-link" to="/profile">Profile</Link>
                                            <Link className="dropdown-item dropdown-link" to="/videos">Videos</Link>
                                            <Link className="dropdown-item dropdown-link" to="/profile">Billing</Link>
                                            <a className="dropdown-item dropdown-link dropdown-secondary" href="#logout" onClick={() => this.logout()}>Sign Out</a>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                        {
                            this.props.sidebar &&
                            <button className="common-Button common-Button--default mt-2" onClick={() => this.setState({ active: !this.state.active }, () => this.props.disableScroll())}>
                                Video List <span className="fas fa-bars" />
                            </button>
                        }
                      </div>
                </div>
            </div>
            {
                this.props.sidebar && !this.props.videos.isFetching &&
                <Sidebar
                    currentVideoName={isNil(this.props.videos.activeVideo) ? 'Loading...' : this.props.videos.activeVideo.name}
                    active={this.state.active}
                    onDismiss={() => this.setState({ active: false }, () => this.props.restoreScroll())}
                    onSearch={value => this.setState({ query: value })}
                    filter={this.state.query}
                />
            }
           </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
