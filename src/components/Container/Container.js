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
            <div className="container-fluid" style={this.props.style}>
                <Navbar
                    sidebar={this.props.sidebar}
                    disableScroll={() => document.body.style.overflow = "hidden"}
                    restoreScroll={() => document.body.style.overflow = "scroll"}
                />
                    <div className="possibly-scrollable-div">
                        {this.props.children}
                    </div>
                <Footer noMargin={this.props.noFooterMargin}/>
            </div>
        );
    }
}
