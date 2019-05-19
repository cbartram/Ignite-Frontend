import React, {Component} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {Auth} from 'aws-amplify';
import {updateUserAttributes, fetchVideos} from '../../actions/actions';
import './PaymentModal.css';
import Log from '../../Log';
import {updateCache} from '../../util';
import {CardElement, injectStripe} from "react-stripe-elements";
import {API_CREATE_SUBSCRIPTION, API_KEY, getRequestUrl, IS_PROD, PROD_API_KEY} from '../../constants';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    updateUserAttributes: (payload) => dispatch(updateUserAttributes(payload)),
    fetchVideos: (username) => dispatch(fetchVideos(username)),
});

class PaymentModal extends Component {
    constructor(props) {
        super(props);

        // Holds a reference to the close button so we can programmatically close the modal
        this.closeButton = React.createRef();

        this.state = {
            error: null, // Was there an error processing payment?
            success: false, // Was the request successful?
            loading: false, // If the request is processing we don't want users to accidentally submit duplicate payments
            fields: {
                firstName: '',
                lastName: '',
                amount: 2500,
            },
            isCardComplete: false,
            missingValues: {
                firstName: false,
                lastName: false,
            },
        };
    }

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

        this.setState({ loading: true});

        try {
            const { token } = await this.props.stripe.createToken({name: `${firstName} ${lastName}`});
            Log.info('Stripe Token: ', token);
        } catch(err) {
            this.props.pushAlert('danger', 'Payment Failed', `There was an issue processing your payment: ${err.message}`)
        } finally {
            this.setState({ loading: false });
        }

        // this.props.onSubmit(this.state.storage, { token, error });
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

    /**
     * Handles making the POST request containing the CC details to the backend.
     * This also updates the user attributes in AWS Cognito with stripe details for the plan, customer,
     * and subscription objects.
     */
    checkout = () => {
        this.setState({loading: true}, async () => {
            Log.info('[INFO] Attempting to process card information');
            const {
                creditCard,
                firstName,
                lastName,
                cvc,
                expirationMonth,
                expirationYear,
                amount
            } = this.state.fields;
            // If any of the fields are blank do not submit the request
            if (creditCard.length === 0 || firstName.length === 0 || amount < 200 || lastName.length === 0 || cvc.length === 0 || expirationMonth.length === 0 || expirationYear.length === 0) {
                this.setState({error: 'Some of the fields were left blank!', success: false, loading: false});
                return;
            }

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': IS_PROD ? PROD_API_KEY : API_KEY,
                },
                // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
                body: JSON.stringify({
                    headers: {},
                    method: 'POST',
                    path: API_CREATE_SUBSCRIPTION,
                    parameters: {}, // Query params
                    body: {
                        'cognito:username': this.props.auth.user['cognito:username'],
                        deviceKey: this.props.auth.user.deviceKey,
                        refreshToken: this.props.auth.user.refreshToken,
                        number: creditCard,
                        exp_month: expirationMonth,
                        exp_year: expirationYear,
                        cvc: cvc,
                        name: `${firstName} ${lastName}`,
                        amount,
                        customer_id: this.props.auth.user['custom:customer_id']
                    }
                }),
            };

            // Attempt to make the API call
            try {
                let response = await (await fetch(getRequestUrl(API_CREATE_SUBSCRIPTION), params)).json();

                Log.info(response);
                // Something went wrong with the request
                if (response.errorMessage) {
                    this.setState({error: response.errorMessage, success: false, loading: false});
                    this.props.onFailedPayment(response.errorMessage);
                } else if (response.body.error) {
                    this.setState({error: response.body.error.message, success: false, loading: false});
                    this.props.onFailedPayment(response.body.error.message);
                } else if (response.statusCode > 200 || response.status > 200) {
                    this.setState({error: response.body.messages.join(','), success: false, loading: false});
                    this.props.onFailedPayment(response.body.messages.join(','));
                } else {
                    // Update redux with the new user attributes
                    this.props.updateUserAttributes({
                        ...response.body.user,
                        'custom:at_period_end': 'false',
                        'custom:unsub_timestamp': 'null'
                    });
                    this.props.fetchVideos(`user-${response.body.user['cognito:username']}`);
                    localStorage.clear();
                    // TODO THIS ISNT WORKING ANYMORE
                    // updateCache({
                    //     idToken: response.body.user.jwtToken,
                    //     refreshToken: response.body.user.refreshToken,
                    //     deviceKey: response.body.user.deviceKey,
                    //     userData: JSON.stringify({
                    //         UserAttributes:[{ Name: "custom:customer_id", Value: response.body.user['custom:customer_id']},
                    //                 { Name:"custom:subscription_id", Value: response.body.user['custom:subscription_id']},
                    //                 { Name:"sub", Value: response.body.user.sub},
                    //                 { Name:"email_verified", Value: response.body.user.email_verified },
                    //                 { Name:"custom:unsub_timestamp", Value: response.body.user['custom:unsub_timestamp']},
                    //                 { Name:"custom:plan_id", Value: response.body.user['custom:plan_id']},
                    //                 { Name:"custom:at_period_end", Value: response.body.user['custom:at_period_end']},
                    //                 { Name:"custom:last_name", Value:response.body.user['custom:last_name']},
                    //                 { Name:"custom:plan", Value: response.body.user['custom:plan']},
                    //                 { Name:"custom:profile_picture", Value: response.body.user["custom:profile_picture"]},
                    //                 { Name:"custom:first_name", Value: response.body.user["custom:first_name"]},
                    //                 { Name:"custom:premium", Value: response.body.user["custom:premium"]},
                    //                 { Name:"email", Value: response.body.user.email }
                    //             ],
                    //     Username: response.body.user['cognito:username']
                    //     }),
                    // });

                    // Ensures that the user only see's a success message if the operation was actually successful.
                    if (response.status === 200 && response.body.statusCode === 200) {

                        // Close the modal
                        this.closeButton.current.click();

                        // Reset all the fields and show a success message
                        this.setState({
                            success: true,
                            loading: false,
                            error: '',
                            fields: {
                                firstName: '',
                                lastName: '',
                                amount: 2500,
                            },
                            missingValues: {
                                firstName: false,
                                lastName: false,
                            }
                        }, () => {
                            // Push an alert to the stack
                            this.props.onSuccessfulPayment();
                        });
                    }
                }
            } catch (err) {
                Log.error(err);
                this.props.onFailedPayment(err.message);
                this.setState({error: err.message, success: false, loading: false});
            }
        });
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
                                <CardElement
                                    className="card-field mt-3 ml-3 mr-2"
                                    onChange={this.handleCardFieldChange}
                                    style={{
                                        base: {fontSize: "18px", fontFamily: '"Open Sans", sans-serif'}
                                    }}
                                />
                                <p className="text-muted px-2 mt-3">
                                    You will be billed $7.00 monthly starting today and recurring on
                                    the {moment().format('Do')} of the month. You
                                    can unsubscribe at any time by visiting your profile page.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="common-Button" data-dismiss="modal"
                                        ref={this.closeButton}>Close
                                </button>
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

