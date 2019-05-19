import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {CardElement, injectStripe} from "react-stripe-elements";
import Crypto from 'crypto-js';
import { Auth } from 'aws-amplify';
import {
    updateUserAttributes,
    fetchVideos,
    processPayment,
} from '../../actions/actions';
import Modal from '../Modal/Modal';
import {
    API_CREATE_SUBSCRIPTION,
    API_KEY,
    PROD_API_KEY,
    IS_PROD,
    ECC_ID,
    getRequestUrl,
} from '../../constants';
import Log from '../../Log';
import './PaymentModal.css';

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    updateUserAttributes: (payload) => dispatch(updateUserAttributes(payload)),
    fetchVideos: (username) => dispatch(fetchVideos(username)),
    processPayment: (payload) => dispatch(processPayment(payload)),
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
     * Handles submitting the form to convert
     * card details into a Stripe Token for use with stripe API's
     * @param event Object event object.
     * @returns {Promise<void>}
     */
    async handleSubmitClick(event) {
        event.preventDefault();

        const {fields} = this.state;
        const {firstName, lastName} = fields;

        // If any of the fields are blank do not submit the request
        if (firstName.length === 0 || lastName.length === 0) {
            this.setState({error: 'Some of the fields were left blank!', success: false, loading: false});
            return;
        }

        this.setState({ loading: true});

        try {
            const { token } = await this.props.stripe.createToken({name: `${firstName} ${lastName}`});
            Log.info('Stripe Token: ', token);

            this.props.processPayment({
                name: `${firstName} ${lastName}`,
                email: this.props.user.email,
                token,
                'cognito:username': this.props.auth.user['cognito:username'],
                deviceKey: this.props.user.deviceKey,
                refreshToken: this.props.user.refreshToken,
                customerId: this.props.user['custom:customer_id']
            })
                .then(() => this.props.fetchVideos(`user-${this.props.user['cognito:username']}`)
                    .then(async () => {
                        // Decrypt localStorage info
                        const bytes  = Crypto.AES.decrypt(localStorage.getItem('ECC_ID'), ECC_ID);
                        const original = bytes.toString(Crypto.enc.Utf8);

                        // Completely revoke all previous (stale) user tokens
                        // and re-authenticate the user with new info (now cache/session is up to date)
                        await Auth.signOut({ global: true });
                        await Auth.signIn(this.props.user.email, original);

                        // Finally stop loading, close the modal and redirect to the /videos page
                        this.setState({ loading: false });
                        this.closeButton.current.click();
                        this.props.onSuccessfulPayment();
                }));
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
                {
                    this.state.nestedModal && (
                        <Modal
                            open={this.state.nestedModal}
                            id="payment-confirm"
                            title="Confirm Payment"
                            subtitle="Please authenticate to confirm your subscription"
                        >

                        </Modal>
                    )
                }


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
                                    <label className="cc" htmlFor="cc">Credit Card</label>
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
                                    You will be billed $7.00 monthly starting at the end of
                                    your free trial and recurring on
                                    the {moment().format('Do')} of the month. You
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

