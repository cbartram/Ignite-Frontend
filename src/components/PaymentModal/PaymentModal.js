import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../Alert/Alert';
import { updateUserAttributes } from '../../actions/actions';
import './PaymentModal.css';
import Log from '../../Log';

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
   updateUserAttributes: (payload) => dispatch(updateUserAttributes(payload))
});

class PaymentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false, // Is the dropdown for the expiration year visible?
            monthVisible: false, // Is the dropdown for the expiration month visible?
            error: null, // Was there an error processing payment?
            success: false, // Was the request successful?
            loading: false, // If the request is processing we don't want users to accidentally submit duplicate payments
            fields: {
                firstName: '',
                lastName: '',
                creditCard: '',
                expirationMonth: '',
                expirationYear: '',
                cvc: '',
                amount: 2500,
            },
            missingValues: {
                firstName: false,
                lastName: false,
                creditCard: false,
                cvc: false,
            }
        }
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

    /**
     * Updates the month field in the form based on a users selection
     * @param expirationMonth String expiration month that has been selected
     */
    handleMonthSelect = (expirationMonth) => {
        this.setState({
            fields: {
                ...this.state.fields,
                expirationMonth
            }
        });
    };

    /**
     * Updates the year field in the form based on the users selection
     * @param expirationYear
     */
    handleYearSelect = (expirationYear) => {
        this.setState({
            fields: {
                ...this.state.fields,
                expirationYear
            }
        });
    };

    /**
     * Handles showing a warning or error if the field is not filled correctly
     * @param fieldName String name of the field corresponding to
     */
    handleFieldBlur = (fieldName) => {
        if(this.state.fields[fieldName].length === 0) {
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
        this.setState({ loading: true }, async () => {
            console.log('[INFO] Attempting to process card information');
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
            if(creditCard.length === 0 || firstName.length === 0 || amount < 200 || lastName.length === 0 || cvc.length === 0 || expirationMonth.length === 0 || expirationYear.length === 0) {
                this.setState({ error: 'Some of the fields were left blank!', success: false, loading: false });
                return;
            }

            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': 'pgS8gGvkv53xFg4BdgECn38C4CDNZXKj8EqFtQdW'
                },
                // Since this is calling an API these details are crucial for the lambda function to know which route to execute.
                body: JSON.stringify({
                    headers: {},
                    method: 'POST',
                    path: '/billing/subscription/create',
                    parameters: {}, // Query params
                    body: {
                        ['cognito:username']: this.props.auth.user['cognito:username'],
                        deviceKey: this.props.auth.user.deviceKey,
                        refreshToken: this.props.auth.user.refreshToken,
                        number: creditCard,
                        exp_month: expirationMonth,
                        exp_year: expirationYear,
                        cvc: cvc,
                        name: `${firstName} ${lastName}`,
                        amount,
                    }
                }),
            };

            // Attempt to make the API call
            try {
                let response = await (await fetch('https://5c5aslvp9k.execute-api.us-east-1.amazonaws.com/Development/billing/subscription/create', params)).json();

                Log.info(response);
                // Something went wrong with the request
                if(response.errorMessage)
                    this.setState({ error: response.errorMessage, success: false, loading: false });
                else if(response.body.error)
                    this.setState({ error: response.body.error.message, success: false, loading: false });
                else if(response.statusCode > 200)
                    this.setState({ error: response.body.messages.join(','), success: false, loading: false });
                else {
                    // Update redux with the new user attributes
                    this.props.updateUserAttributes(response.body.user);

                    // Re-Signin so AWS Amplify can't retrieve old user data from localStorage
                    // If a user does refresh it will kick them out the login screen
                    // const r = await Auth.signIn(response.body.user['cognito:username']);
                    // console.log('Attempting to re-sign in user: ', r);
                    // todo come back to this there is a bug in AWS amplify'

                    localStorage.clear(); // todo this will force users to re-sign in when they refresh a page

                    // Ensures that the user only see's a success message if the operation was actually successful.
                    if(response.status === 200 && response.body.statusCode === 200) {
                        // Reset all the fields and show a success message
                        this.setState({
                            success: true,
                            loading: false,
                            error: '',
                            fields: {
                                firstName: '',
                                lastName: '',
                                amount: 2500,
                                expirationYear: '',
                                expirationMonth: '',
                                creditCard: '',
                                cvc: ''
                            },
                            missingValues: {
                                firstName: false,
                                lastName: false,
                                creditCard: false,
                                cvc: false,
                            }
                        });
                    }
                }
            } catch(err) {
                Log.error(err);
                this.setState({ error: err.message, success: false, loading: false });
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
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Show the error/success Alerts after the payment is submitted */}
                            {
                                this.state.error &&
                                <Alert type="danger" heading="Error">
                                    <p>
                                        Unfortunately something went wrong processing your payment information. Ensure your
                                        card information is typed correctly and matches the details on your credit or debit card.
                                    </p>
                                    <hr />
                                    <p>
                                        You can try again by resubmitting the form below! Details of the error: &nbsp;
                                        { this.state.error }
                                    </p>
                                </Alert>
                            }

                            {
                                this.state.success &&
                                <Alert type="success" heading="Thank You">
                                    <p>
                                        Your subscription has been created successfully and will automatically renew on { moment().format('MMM Do') }.
                                        Check out our <Link to="/tracks">tracks</Link> and start watching!
                                    </p>
                                    <hr />
                                    <p>
                                        Enjoy your learning!
                                    </p>
                                </Alert>
                            }
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
                                <label className="cc" htmlFor="cc">Credit Card Number</label>
                                <input
                                    onBlur={() => this.handleFieldBlur('creditCard')}
                                    onChange={(e) => this.updateField('creditCard', e)}
                                    value={this.state.fields.creditCard}
                                    pattern="[0-9]*"
                                    id="cc"
                                    name="cc"
                                    type="text"
                                    placeholder="4444 4444 4444 4444"
                                    className={`${this.state.missingValues['creditCard'] ? 'missing-value' : ''}`}
                                    required
                                />
                            </div>
                            <div className="form-row text expiration">
                                <label className="expiration" htmlFor="expirationMonth">Expiration Month</label>
                                <input
                                    id="expirationMonth"
                                    name="expirationMonth"
                                    onBlur={() => this.setState({ monthVisible: false })}
                                    onFocus={() => this.setState({ monthVisible: true })}
                                    onChange={() => {}}
                                    type="text"
                                    pattern="[0-9]*"
                                    placeholder="08"
                                    value={this.state.fields.expirationMonth}
                                    required
                                />
                                <div className={`select-dropdown ${!this.state.monthVisible && 'hidden'}`}>
                                    <ul className="select-results">
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('01')}>
                                            01
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('02')}>
                                            02
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('03')}>
                                            03
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('04')}>
                                            04
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('05')}>
                                            05
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('06')}>
                                            06
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('07')}>
                                            07
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('08')}>
                                            08
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('09')}>
                                            09
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('10')}>
                                            10
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('11')}>
                                            11
                                        </li>
                                        <li className="select-result" onMouseDown={() => this.handleMonthSelect('12')}>
                                            12
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="form-row text expiration">
                                <label className="expiration" htmlFor="expiration">Expiration Year</label>
                                <input
                                    id="expiration"
                                    name="expiration"
                                    onBlur={() => this.setState({ visible: false })}
                                    onFocus={() => this.setState({ visible: true })}
                                    onChange={() => {}}
                                    type="text"
                                    pattern="[0-9]*"
                                    placeholder="18"
                                    value={this.state.fields.expirationYear}
                                    required
                                />
                                <div className={`select-dropdown ${!this.state.visible && 'hidden'}`}>
                                    <ul className="select-results">
                                        {
                                            Array.apply(null, { length: 50 }).map(Number.call, Number)
                                                .map(i => {
                                                    let momentItem = moment().add(i, 'years').format('YYYY');
                                                    return (
                                                        <li className="select-result" key={i} onMouseDown={() => this.handleYearSelect(momentItem)}>
                                                            { momentItem }
                                                        </li>
                                                    )
                                                })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="form-row text security">
                                <label className="security" htmlFor="security">CCV Security Code</label>
                                <input
                                    id="security"
                                    name="security"
                                    type="text"
                                    placeholder="123"
                                    required
                                    onBlur={() => this.handleFieldBlur('cvc')}
                                    onChange={(e) => this.updateField('cvc', e)}
                                    value={this.state.fields.cvc}
                                    pattern="[0-9]*"
                                    className={`${this.state.missingValues['cvc'] ? 'missing-value' : ''}`}
                                />
                            </div>
                            <p className="text-muted px-2 mt-3">
                                You will be billed $25.00 monthly starting today and recurring on the { moment().format('Do') } of the month. You
                                can unsubscribe at any time by visiting your profile page.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="common-Button" data-dismiss="modal">Close</button>
                            {
                                this.state.loading ? <button type="button" className="common-Button common-Button--default" disabled>Processing <i className="fas fa-circle-notch" /></button> :
                                    <button type="button" className="common-Button common-Button--default" onClick={() => this.checkout()}>Place Order</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);

