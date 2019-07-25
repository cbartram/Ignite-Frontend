import React, {Component} from 'react';
import {ApolloConsumer} from "react-apollo";

const withApolloClient = (BaseComponent) => (
    class EhnancedComponent extends Component {
        render() {
            return (
                <ApolloConsumer>
                    {client => <BaseComponent apolloClient={client}/>}
                </ApolloConsumer>
            )
        }
    }
);

export default withApolloClient;
