import React, { Component } from 'react';
import Logo from '../../resources/images/logo.png';
import './Footer.css';

/**
 * The page footer component
 */
export default class Footer extends Component {
    render() {
        return (
            <footer className={`pt-4 ${!this.props.noMargin && 'mt-5'} pt-md-5 border-top`}>
                <div className="row">
                    <div className="col-12 col-md">
                        <img className="mb-2" src={Logo} alt="" width="24"
                             height="24" />
                            <small className="d-block mb-3 text-muted">&copy; 2017-2018</small>
                    </div>
                    <div className="col-6 col-md">
                        <h5>Features</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#cool">Cool stuff</a></li>
                            <li><a className="text-muted" href="#foo">Random feature</a></li>
                            <li><a className="text-muted" href="#team">Team feature</a></li>
                            <li><a className="text-muted" href="#dev">Stuff for developers</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>Resources</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#resource">Resource</a></li>
                            <li><a className="text-muted" href="#mame">Resource name</a></li>
                            <li><a className="text-muted" href="#res">Another resource</a></li>

                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>About</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#team">Team</a></li>
                            <li><a className="text-muted" href="#locations">Locations</a></li>
                            <li><a className="text-muted" href="#privacy">Privacy</a></li>
                            <li><a className="text-muted" href="#terms">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}
