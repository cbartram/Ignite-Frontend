import React, { Component } from 'react';
import Logo from '../../resources/images/logo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {hideErrors, logout} from '../../actions/actions';
import { Auth } from 'aws-amplify';
import Log from '../../Log';
import './Navbar.css';
import Sidebar from "../Sidebar/Sidebar";

const mapStateToProps = state => ({
    auth: state.auth,
    videos: state.videos,
});

const mapDispatchToProps = dispatch => ({
   logout: () => dispatch(logout()),
   hideErrors: () => dispatch(hideErrors()),
});

/**
 * Shows the Navbar at the top of the page.
 */
class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false, // True if the sidebar is active
            query: '',
        }
    }

    /**
     * Handles logging the user out by removing cookies/session history
     * @returns {Promise<void>}
     */
    async logout() {
        Log.info('Logging out...');
        try {
            await Auth.signOut();
            this.props.logout();
        } catch(err) {
            Log.error('Failed to logout user...', err)
        }
    }


    /**
     * Hides any errors when each of the links are clicked.
     */
    handleLinkClick() {
        this.props.hideErrors();
    }

    render() {
        const authLinks = [
            <Link className="p-3 text-dark" to="/videos" key="videos" onClick={() => this.handleLinkClick()}>Videos</Link>,
            <Link className="p-3 text-dark" to="/library" key="library" onClick={() => this.handleLinkClick()}>Library</Link>,
            <Link className="p-3 text-dark" to="/pricing" key="pricing" onClick={() => this.handleLinkClick()}>Pricing</Link>,
        ];
        const standardLinks = [
            <Link className="p-3 text-dark" to="/login" key="login" onClick={() => this.handleLinkClick()}>Login</Link>,
            <Link className="p-3 text-dark" to="/signup" key="signup" onClick={() => this.handleLinkClick()}>Sign Up</Link>,
            <Link className="p-3 text-dark" to="/pricing" key="pricing" onClick={() => this.handleLinkClick()}>Pricing</Link>,
        ];

        return (
            <div>
            <div className="navbar navbar-expand-lg px-md-4 bg-white border-bottom shadow-sm">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse d-flex flex-column flex-md-row align-items-center" style={{ ...this.props.style, zIndex: 50, position: 'relative'}}>
                    <a className="navbar-brand" href="/">
                        <img src={Logo} width="30" height="30" alt="Ignite Logo" />
                    </a>
                    <h5 className="my-0 mr-md-auto font-weight-normal">Ignite</h5>
                    <div className="nav-links my-2 my-md-0 mr-md-3">
                        { this.props.auth.user ? authLinks.map(link => link) : standardLinks.map(link => link) }
                        <Link className="p-3 text-dark" to="/support" onClick={() => this.handleLinkClick()}>Support</Link>
                    </div>
                    <ul className="dropdown-list">
                        {
                            this.props.auth.user && (
                                <li className="nav-item dropdown">
                                    <button className="btn btn-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown">
                                        <div className="avatar-container">
                                            <img src={this.props.auth.user['custom:profile_picture']} alt="Profile" className="avatar-image" height="30" width="30" />
                                        </div>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right header-nav-item-profile-dropdown mt-2 py-0">
                                        <h4 className="dropdown-title">
                                            <Link to="/profile" className="header-nav-item-profile-dropdown-title-link">
                                                <strong className="header-nav-item-profile-dropdown-title-name">
                                                    {`${this.props.auth.user['custom:first_name']} ${this.props.auth.user['custom:last_name']}`}
                                                </strong>
                                                <span className="header-nav-item-profile-dropdown-title-label">View Profile</span>
                                            </Link>
                                        </h4>
                                        <Link className="dropdown-item" to="/profile">Profile</Link>
                                        <Link className="dropdown-item" to="/videos">Videos</Link>
                                        <Link className="dropdown-item" to="/profile">Billing</Link>
                                        <a className="dropdown-item dropdown-secondary" href="#logout" onClick={() => this.logout()}>Sign Out</a>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                    {
                        this.props.sidebar &&
                        <button className="common-Button common-Button--default" onClick={() => this.setState({ active: !this.state.active })}>
                            <span className="fas fa-bars" />
                        </button>
                    }
                </div>
            </div>
                {
                    this.props.sidebar && !this.props.videos.isFetching &&
                    <Sidebar
                        currentVideoName={this.props.videos.activeVideo.name}
                        active={this.state.active}
                        onDismiss={() => this.setState({ active: false })}
                        onSearch={value => this.setState({ query: value })}
                        filter={this.state.query}
                    />
                }
           </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
