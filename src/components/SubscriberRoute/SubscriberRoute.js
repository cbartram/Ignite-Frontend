import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        if (rest.isAuthenticated === true) {
            return <Component {...props} />;
        } else {
            console.log('You must be a subscriber to access this route!');
            // return <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`}/>
        }
    }} />
);


export default AuthenticatedRoute;
