import React, { Component } from 'react';
import Logo from '../../resources/images/logo.png';
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
                    <a className="p-2 text-dark" href="#about">About</a>
                    <a className="p-2 text-dark" href="#examples">Examples</a>
                    <a className="p-2 text-dark" href="#sponsor">Sponsor</a>
                    <a className="p-2 text-dark" href="https://github.com/cbartram/nanoleaf-layout">Github</a>
                    <a className="p-2 text-dark" href="#support">Support</a>
                </nav>
            </div>
        )
    }
}