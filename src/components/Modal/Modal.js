import React, { Component } from 'react';
import './Modal.css';

export default class Modal extends Component {
  render() {
      return (
          <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title" id="exampleModalLabel">{this.props.title}</h2>
                  <h5 className="modal-subtitle">{this.props.subtitle}</h5>
                </div>
                <div className="modal-body">
                  { this.props.children }
                </div>
                <div className="modal-footer">
                  <button type="button" className="common-Button" data-dismiss="modal">Close
                  </button>
                  <button type="button" className="common-Button common-Button--default">Save changes</button>
                </div>
              </div>
            </div>
          </div>
      )
  }
}
