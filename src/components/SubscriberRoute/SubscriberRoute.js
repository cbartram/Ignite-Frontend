import React from "react";
import { Route, Redirect } from "react-router-dom";

const SubscriberRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {

        // User is not logged in or they just logged out
        if(rest.user === null)
            return <Redirect to="/login" />;

        if (rest.isAuthenticated === true && rest.user['custom:premium'] === 'true') {
            return <Component {...props} />;
        } else {
            return <Redirect to="/videos"/>
        }
    }} />
);


export default SubscriberRoute;
