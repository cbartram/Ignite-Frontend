import React, {Component} from 'react';
import {connect} from 'react-redux';
import withContainer from '../../components/withContainer';
import Card from '../../components/Card/Card';
import Log from '../../Log';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import {sendEmail} from '../../actions/actions';
import './Support.css';

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  sendEmail: (payload) => dispatch(sendEmail(payload))
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
        await this.props.sendEmail({
          from: this.props.user.email,
          subject: this.state.subject,
          message: this.state.message
        });
        this.props.pushAlert('success', 'Message Sent Successfully', 'Your message has been delivered successfully. We will do our best to respond as soon as possible!');
      } catch(err) {
        Log.error(err);
        this.props.pushAlert('danger', 'Failed to Send Message', 'Something went wrong sending your message. Please refresh the page and try again!')
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

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(Support))
