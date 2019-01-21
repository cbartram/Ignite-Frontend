import React, { Component } from 'react';
import './Container.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

/**
 * Container Component which renders its children and includes the navbar and footer.
 */
export default class Container extends Component {
    render() {
        return (
            <div className="container-fluid">
                <Navbar {...this.props} />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}
