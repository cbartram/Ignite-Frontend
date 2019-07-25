import React, {Component} from 'react';
import isUndefined from 'lodash/isUndefined';
import gql from 'graphql-tag';
import {Mutation} from "react-apollo";
import {CardElement, injectStripe} from "react-stripe-elements";
import Card from "../../../components/Card/Card"
import LoaderButton from '../../../components/LoaderButton/LoaderButton'
import './UpdatePaymentCard.css';

const UPDATE_CARD = gql`
    mutation AddTodo($customerId: String!, $token: String!) {
        updateCard(customerId: $customerId, token: $token) {
            id
        }
    }
`;

class UpdatePaymentCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            complete: false,
            loading: false,
        };
        this.handleCardFieldChange = this.handleCardFieldChange.bind(this);
    }

    /**
     * Updates local state when the card details are fully filled out
     * @param completed Boolean true if the form has been filled out completely
     */
    handleCardFieldChange({complete}) {
        this.setState({complete});
    }

    render() {
        return (
            <Mutation
                mutation={UPDATE_CARD}
                onCompleted={() => {
                    this.setState({loading: false});
                    this.props.onSuccess();
                }}
                onError={(err) => {
                    console.log(err);
                    this.props.onError(err);
                    this.setState({loading: false})
                }}
            >
                {(updateCard) => (
                    <Card cardTitle="Update Payment" classNames={['pb-0']}>
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
                        <LoaderButton
                            isLoading={this.state.loading}
                            className="ml-3 mt-3"
                            disabled={!this.state.complete}
                            onClick={async () => {
                                const {token} = await this.props.stripe.createToken();
                                if (!isUndefined(token)) {
                                    try {
                                        this.setState({loading: true});
                                        updateCard({variables: {customerId: this.props.customerId, token: token.id}});
                                    } catch (err) {
                                        this.setState({loading: false});
                                        this.props.onError(err);
                                    }
                                }
                            }}
                            text="Update Payment Method"
                            loadingText="Updating..."
                        />

                    </Card>
                )}
            </Mutation>
        )
    }
}

export default injectStripe(UpdatePaymentCard);
