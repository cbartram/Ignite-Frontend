import React, { Component } from 'react';
import './Container.css';
import Navbar from "../Navbar/Navbar";

export default class Container extends Component {
    render() {
        return (
            <div className="container-fluid">
                <Navbar/>
                {this.props.children}
                {/*<Footer />*/}
            </div>
        );
    }
}