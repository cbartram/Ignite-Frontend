import React from "react";
import "./NotFound.css";
import Container from "../Container/Container";

/**
 * A functional component which is shown when the rout returns a 404
 * @returns {*}
 */
export default () =>
    <Container>
        <div className="NotFound">
            <h3>Sorry, page not found!</h3>
        </div>
    </Container>;