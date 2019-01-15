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
            <Link className="p-2 text-dark" to="/tracks" key="tracks" onClick={() => this.handleLinkClick()}>Tracks</Link>,
            <Link className="p-2 text-dark" to="/library" key="library" onClick={() => this.handleLinkClick()}>Library</Link>,

        ];
        const standardLinks = [
            <Link className="p-2 text-dark" to="/login" key="login" onClick={() => this.handleLinkClick()}>Login</Link>,
            <Link className="p-2 text-dark" to="/signup" key="signup" onClick={() => this.handleLinkClick()}>Sign Up</Link>,
            <Link className="p-2 text-dark" to="/pricing" key="pricing" onClick={() => this.handleLinkClick()}>Pricing</Link>
        ];

        return (
            <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm fixed-top">
                <a className="navbar-brand" href="/">
                    <img src={Logo} width="30" height="30" alt="Ignite Logo" />
                </a>
                <h5 className="my-0 mr-md-auto font-weight-normal">Ignite</h5>
                <nav className="my-2 my-md-0 mr-md-3">
                    <Link className="p-2 text-dark" to="/" onClick={() => this.handleLinkClick()}>Home</Link>
                    {
                        this.props.auth.user ? authLinks.map(link => link) : standardLinks.map(link => link)
                    }
                    <Link className="p-2 text-dark" to="/community" onClick={() => this.handleLinkClick()}>Community</Link>
                    <Link className="p-2 text-dark" to="/support" onClick={() => this.handleLinkClick()}>Support</Link>
                </nav>
                <ul style={{ listStyle: 'none' }}>
                    {
                        this.props.auth.user && (
                            <li className="nav-item dropdown">
                                <button className="btn btn-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown">
                                    Welcome
                                </button>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" href="#action">Action</a>
                                    <a className="dropdown-item" href="#another">Another action</a>
                                    <div className="dropdown-divider" />
                                    <a className="dropdown-item" href="#logout" onClick={() => this.logout()}>Logout</a>
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
