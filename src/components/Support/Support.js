import React, { Component } from 'react';
import { connect } from 'react-redux';
import withContainer from '../withContainer';
import Card from '../Card/Card';
import './Support.css';

const mapStateToProps = state => ({
  auth: state.auth,
});

class Support extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: '',
      message: '',
    }
  }

  componentDidMount() {
    console.log(this.props.auth);
  }

  /**
   * Handles updating local state with values in the form fields
   * @param value String value of the form field
   * @param type String key in the state to update
   */
  handleChange(value, type) {
    this.setState({ [type]: value });
  }

  submit() {

  }


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
                  <input className="form-field-default mb-3" placeholder="Subject" onChange={(e) => this.handleChange(e.target.value, 'subject')}>
                  </input>
                  <textarea className="form-field-default mb-3" placeholder="Message" rows="10" maxLength="400" onChange={(e) => this.handleChange(e.target.value, 'message')}>
                  </textarea>
                  <button className="common-Button common-Button--default" onClick={() => this.submit()}>
                    Send <i className="fas fa-paper-plane" />
                  </button>
                </Card>
              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(connect(mapStateToProps)(Support))
