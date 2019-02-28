import React from "react";
import { Route, Redirect } from "react-router-dom";
import { queryString } from '../../util';

/**
 * Returns specific components for un-authenticated users
 * @param Component JSX The component to render if the user is un-authenticated
 * @param rest Props other props passed into the <Avenue /> component
 * @param props Props to be passed into the rendered component
 * @returns {*}
 * @constructor
 */
const Avenue = ({ component: Component, props: componentProps, ...rest }) => {
    const redirect = queryString('redirect');
    return (
        <Route {...rest} render={(props) => {
            if (rest.isAuthenticated !== true) {
                return <Component {...props} {...componentProps} />;
            } else {
                // If the user is trying to access a route like /login or /signup while logged in
                // redirect them to what has been parsed from the query string
                if(typeof redirect === 'undefined') {
                    return <Redirect to="/videos" />
                } else {
                    if(Object.keys(redirect).length === 0)
                        return <Redirect to="/videos" />;
                    return <Redirect to={redirect}/>
                }
            }
        }}/>
    )
};

export default Avenue;
