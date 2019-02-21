import React, { Component } from 'react';
import './Support.css';
import withContainer from "../withContainer";
import Card from "../Card/Card";

class Support extends Component {
  render() {
      return (
          <div>
          <div className="d-flex flex-row justify-content-center">
            <h2 className="common-UppercaseTitle mt-4">Ignite Support</h2>
          </div>
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <Card cardTitle="Send a Message">
                  <p className="common-BodyText">
                    Send us a message and let us know how we can help. We will do our best to respond to your
                    question or concern as soon as possible.
                  </p>
                  <input className="form-field-default mb-3" placeholder="Subject">
                  </input>
                  <textarea className="form-field-default mb-3" placeholder="Message" rows="10" maxLength="400">
                  </textarea>
                  <button className="common-Button common-Button--default">
                    Send <i className="fas fa-paper-plane" />
                  </button>
                </Card>
              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(Support)
