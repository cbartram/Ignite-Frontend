import React, { Component } from 'react';
import Logo from '../../resources/images/logo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {hideErrors, logout} from '../../actions/actions';
import { Auth } from 'aws-amplify';
import Log from '../../Log';
import './Navbar.css';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
   logout: () => dispatch(logout()),
   hideErrors: () => dispatch(hideErrors()),
});

/**
 * Shows the Navbar at the top of the page.
 */
class Navbar extends Component {
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
            <div className={`d-flex flex-column flex-md-row align-items-center p-3 px-md-4 bg-white border-bottom shadow-sm`} style={{ ...this.props.style, zIndex: 50, position: 'relative'}}>
                <Link className="navbar-brand" to="/">
                    <img src={Logo} width="30" height="30" alt="Ignite Logo" />
                </Link>
                <h5 className="my-0 mr-md-auto font-weight-normal">Ignite</h5>
                <nav className="my-2 my-md-0 mr-md-3">
                    { this.props.auth.user ? authLinks.map(link => link) : standardLinks.map(link => link) }
                    <Link className="p-3 text-dark" to="/support" onClick={() => this.handleLinkClick()}>Support</Link>
                </nav>
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
                                    <a className="dropdown-item" href="#another">Billing</a>
                                    <a className="dropdown-item dropdown-secondary" href="#logout" onClick={() => this.logout()}>Sign Out</a>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
