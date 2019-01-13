import React, { Component } from 'react';
import Logo from '../../resources/images/logo.png';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default class Navbar extends Component {
    render() {
        return (
            <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm fixed-top">
                <a className="navbar-brand" href="/">
                    <img src={Logo} width="40" height="40" alt="Triangle Logo" />
                </a>
                <h5 className="my-0 mr-md-auto font-weight-normal">Ignite</h5>
                <nav className="my-2 my-md-0 mr-md-3">
                    <Link className="p-2 text-dark" to="/">Home</Link>
                    <Link className="p-2 text-dark" to="/login">Login</Link>
                    <Link className="p-2 text-dark" to="/register">Sign Up</Link>
                    <Link className="p-2 text-dark" to="#support">Support</Link>
                </nav>
            </div>
        )
    }
}