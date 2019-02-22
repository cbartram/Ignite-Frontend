import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import withContainer from '../withContainer';
import Card from '../Card/Card';
import Log from '../../Log';
import LoaderButton from '../LoaderButton/LoaderButton';
import { sendEmail } from '../../util';
import './Support.css';
import Alert from '../Alert/Alert';
import AlertContainer from '../AlertContainer/AlertContainer';
import { Link } from "react-router-dom";

const mapStateToProps = state => ({
  auth: state.auth,
});

/**
 * Shows the Support page
 */
class Support extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: '',
      message: '',
      isSending: false,
      alerts: [],
    }
  }

  /**
   * Handles updating local state with values in the form fields
   * @param value String value of the form field
   * @param type String key in the state to update
   */
  handleChange(value, type) {
    this.setState({ [type]: value });
  }


  /**
   * Submits the form and POST's the data to the server.
   */
  submit() {
    this.setState({ isSending: true }, async () => {
      try {
        const response = await sendEmail(this.props.auth.user.email, this.state.subject, this.state.message);
        this.pushAlert('success', 'Message Sent Successfully', 'Your message has been delivered successfully. We will do our best to respond as soon as possible!')
      } catch(err) {
        Log.error(err);
        this.pushAlert('danger', 'Failed to Send Message', 'Something went wrong sending your message. Please refresh the page and try again!')
      } finally {
        this.setState({ isSending: false });
      }
    });
  }

  /**
   * Ensures both form fields are filled out and valid
   * @returns {boolean} True if they are valid and false otherwise
   */
  validateForm() {
    return this.state.subject.length > 0 && this.state.message.length > 0;
  }

  /**
   * Pushes an alert onto the stack to be
   * visible by users
   */
  pushAlert(type, title, message, id = _.uniqueId()) {
    const { alerts } = this.state;
    // Push an object of props to be passed to the <Alert /> Component
    alerts.push({
      type,
      title,
      id,
      message,
    });

    this.setState({ alerts });
  }

  /**
   * Removes an alert from the stack so that
   * it is no longer rendered on the page
   * @param id Integer the unique alert id
   */
  removeAlert(id) {
    const { alerts } = this.state;
    const newAlerts = [
      ...alerts.filter(alert => alert.id !== id)
    ];

    this.setState({ alerts: newAlerts });
  }


  render() {
      return (
          <div>
            <AlertContainer>
              { this.state.alerts.map((props, index) =>
                  <Alert key={index} onDismiss={() => this.removeAlert(props.id)} {...props}>
                    {props.message}
                    <br />
                    {
                      props.type === 'danger' &&
                      <Link to="/login/reset">reset your password.</Link>
                    }
                  </Alert>
              )
              }
            </AlertContainer>
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
                  <LoaderButton
                      loadingText="Sending..."
                      isLoading={this.state.isSending}
                      disabled={!this.validateForm()}
                      text={<span>Send <i className="fas fa-paper-plane" /></span>}
                      onClick={() => this.submit()}
                  />
                </Card>
              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(connect(mapStateToProps)(Support))
