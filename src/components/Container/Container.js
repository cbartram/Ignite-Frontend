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
                {/* Used to offset the navbar's position*/}
                <div style={{marginTop: this.props.marginTop || 90}}>
                    {this.props.children}
                </div>
                <Footer {...this.props} />
            </div>
        );
    }
}
