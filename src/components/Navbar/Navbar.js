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
            this.props.history.push('/login');
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
        return (
            <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm fixed-top">
                <a className="navbar-brand" href="/">
                    <img src={Logo} width="40" height="40" alt="Triangle Logo" />
                </a>
                <h5 className="my-0 mr-md-auto font-weight-normal">Ignite</h5>
                <nav className="my-2 my-md-0 mr-md-3">
                    <Link className="p-2 text-dark" to="/" onClick={() => this.handleLinkClick()}>Home</Link>
                    <Link className="p-2 text-dark" to="/login" onClick={() => this.handleLinkClick()}>Login</Link>
                    <Link className="p-2 text-dark" to="/signup" onClick={() => this.handleLinkClick()}>Sign Up</Link>
                    <Link className="p-2 text-dark" to="#support" onClick={() => this.handleLinkClick()}>Support</Link>
                </nav>
                {
                    (this.props.auth.user !== null && typeof this.props.auth.user !== 'undefined') &&
                    <button className="btn btn-outline-primary" onClick={() => this.logout()}>Logout</button>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);