import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * Parses the query string from the URL.
 * @param name String name of the query param to parse
 * @param url String url to parse from
 * @returns {*}
 */
const queryString = (name = null, url = window.location.href) => {
    let question = url.indexOf("?");
    let hash = url.indexOf("#");
    if(hash=== -1 && question === -1) return {};
    if(hash === -1) hash = url.length;
    let query = question === -1 || hash === question+1 ? url.substring(hash) : url.substring(question + 1, hash);
    let result = {};
    query.split("&").forEach((part) => {
        if(!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        let eq = part.indexOf("=");
        let key = eq > -1 ? part.substr(0,eq) : part;
        let val = eq > -1 ? decodeURIComponent(part.substr(eq+1)) : "";
        let from = key.indexOf("[");
        if(from === -1) {
            result[decodeURIComponent(key)] = val;
        } else {
            let to = key.indexOf("]",from);
            let index = decodeURIComponent(key.substring(from+1,to));
            key = decodeURIComponent(key.substring(0,from));
            if(!result[key]) result[key] = [];
            if(!index) result[key].push(val);
            else result[key][index] = val;
        }
    });

    if(name) {
        return result[name];
    }

    return result;
};


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
                let shouldUseRedirect =
                    redirect === "" ||
                    redirect === null ||
                    typeof redirect === 'undefined' ||
                    Object.keys(redirect).length === 0 ? '/videos' : redirect;

                return <Redirect to={shouldUseRedirect ? '/videos' : redirect } />
            }
        }}/>
    )
};

export default Avenue;
