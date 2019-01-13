import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Container from "../Container/Container";
import { Auth } from 'aws-amplify';
import './Login.css';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    /**
     * Ensures both form fields are filled out and valid
     * @returns {boolean} True if they are valid and false otherwise
     */
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    /**
     * Updates our local state with the user's email/password combo using the id attribute
     * from each JSX form field element
     * @param event Object JS event object.
     */
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    /**
     * Handles using AWS Amplify to submit our Authentication request to Cognito User pool.
     * @param event
     * @returns {Promise<void>}
     */
    handleSubmit = async event => {
        event.preventDefault();

        try {
            const res = await Auth.signIn(this.state.email, this.state.password);

            console.log(res);

            alert("Logged in");
        } catch (err) {
            console.log('[ERROR] Failed to Authenticate User: ', err);
        }
    };

    render() {
        return (
            <Container>
                <div className="Login">
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </FormGroup>
                        <Button
                            block
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}