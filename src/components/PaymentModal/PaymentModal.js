import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CardElement, injectStripe} from "react-stripe-elements";
import {fetchVideos, loginSuccess, processPayment, updateUserAttributes,} from '../../actions/actions';
import './PaymentModal.css';

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    updateUserAttributes: (payload) => dispatch(updateUserAttributes(payload)),
    fetchVideos: (username) => dispatch(fetchVideos(username)),
    processPayment: (payload) => dispatch(processPayment(payload)),
    loginSuccess: (data) => dispatch(loginSuccess(data)),
});

/**
 * Handles Showing the modal users enter their credit card
 * details into.
 */
class PaymentModal extends Component {
    constructor(props) {
        super(props);

        // Holds a reference to the close button so we can programmatically close the modal
        this.closeButton = React.createRef();

        this.state = {
            loading: false, // If the request is processing we don't want users to accidentally submit duplicate payments
            isCardComplete: false,
            fields: {
                firstName: '',
                lastName: '',
                amount: 2500,
            },
            missingValues: {
                firstName: false,
                lastName: false,
            },
        };
    }

    /**
     * Updates the first name and last name fields with proper values
     * the user enters
     * @param fieldName String the field name to update (either firstName or lastName)
     * @param e Object the event object to retrieve the value entered from.
     */
    updateField = (fieldName, e) => {
        let value = e.target.value;
        const valid = e.target.validity.valid || value.length === 0;
        this.setState({
            fields: {
                ...this.state.fields,
                [fieldName]: valid ? value : this.state.fields[fieldName], // Only apply to state if its value
            }
        });
    };

    /**
     * Updates state when the credit card form from React elements
     * is filled out
     * @param complete Boolean true if the form is complete and flase otherwise
     */
    handleCardFieldChange = ({complete}) => {
        this.setState({
            isCardComplete: complete
        });
    };

    /**
     * Closes a modal if a user clicks chrome's "back" button
     */
    componentWillUnmount() {
        this.closeButton.current.click();
    }

    /**
     * Handles submitting the form to convert
     * card details into a Stripe Token for use with stripe API's
     * @param event Object event object.
     * @returns {Promise<void>}
     */
    async handleSubmitClick(event) {
        event.preventDefault();

        const {fields, isCardComplete } = this.state;
        const {firstName, lastName} = fields;

        // If any of the fields are blank do not submit the request
        if (firstName.length === 0 || lastName.length === 0 || !isCardComplete) {
            this.props.onFailedPayment('Some of the fields were left blank or there were errors in the form');
            return;
        }

        this.setState({ loading: true});

        try {
            const { token } = await this.props.stripe.createToken({ name: `${firstName} ${lastName}`});

            this.props.processPayment({
                name: `${firstName} ${lastName}`,
                email: this.props.user.email,
                token,
                username: this.props.user.userName,
                customerId: this.props.user.customer_id,
                plan: this.props.plan
            }).then(() => {
                this.props.fetchVideos(`user-${this.props.user.userName}`);

                // Finally stop loading, close the modal and redirect to the /videos page
                this.setState({ loading: false });
                this.closeButton.current.click();
                this.props.onSuccessfulPayment();
            }).catch(err => this.props.onFailedPayment(err.messages[0]));
        } catch(err) {
            this.props.onFailedPayment(err.message);
        }
    };

    /**
     * Handles showing a warning or error if the field is not filled correctly
     * @param fieldName String name of the field corresponding to
     */
    handleFieldBlur = (fieldName) => {
        if (this.state.fields[fieldName].length === 0) {
            this.setState({
                missingValues: {
                    ...this.state.missingValues,
                    [fieldName]: true,
                }
            })
        }
    };


    render() {
        return (
            <div className="modal" id="payment-modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Subscribe to Ignite</h5>
                        </div>
                        <form onSubmit={(e) => this.handleSubmitClick(e)}>
                            <div className="modal-body" style={{background: '#fff'}}>
                                <div className="form-row text firstname">
                                    <label className="firstname" htmlFor="firstname">Your first name</label>
                                    <input
                                        onBlur={() => this.handleFieldBlur('firstName')}
                                        onChange={(e) => this.updateField('firstName', e)}
                                        value={this.state.fields.firstName}
                                        id="firstname"
                                        name="firstname"
                                        type="text"
                                        placeholder="Jürgen"
                                        className={`${this.state.missingValues['firstName'] ? 'missing-value' : ''}`}
                                        required
                                    />
                                </div>
                                <div className="form-row text lastname">
                                    <label className="lastname" htmlFor="lastname">Your last name</label>
                                    <input
                                        onBlur={() => this.handleFieldBlur('lastName')}
                                        onChange={(e) => this.updateField('lastName', e)}
                                        value={this.state.fields.lastName}
                                        id="lastname"
                                        name="lastname"
                                        type="text"
                                        placeholder="Windcaller"
                                        className={`${this.state.missingValues['lastName'] ? 'missing-value' : ''}`}
                                        required
                                    />
                                </div>
                                <div className="form-row text cc">
                                    <label className="cc" htmlFor="cc">Bank Card</label>
                                    <CardElement
                                        className="card-field"
                                        onChange={this.handleCardFieldChange}
                                        style={{
                                            base: {
                                                fontSize: '17px',
                                                fontWeight: 'lighter',
                                                fontFamily: "Camphor,Open Sans,Segoe UI,sans-serif",
                                        }
                                        }}
                                    />
                                </div>
                                <p className="text-muted px-2 mt-3">
                                    You will be billed {this.props.plan.amount} starting at the end of
                                    your free trial and recurring {this.props.plan.recurring}. You
                                    can unsubscribe at any time by visiting your profile page.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="common-Button" data-dismiss="modal" ref={this.closeButton}>Close</button>
                                {
                                    this.state.loading ?
                                        <button type="button" className="common-Button common-Button--default"
                                                disabled>Processing <i className="fas fa-circle-notch"/></button> :
                                        <button className="common-Button common-Button--default" type="submit">Place
                                            Order</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(PaymentModal));

