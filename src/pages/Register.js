import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"
import { Form, FormGroup, Label, Input, Button, Card, CardBody, Alert } from "reactstrap"

import { Login, Register } from "../api/api"

function RegisterForm(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState(null);
    let history = useHistory();

    const tryRegister = e => {
        Register(email, password)
        .then(data => {
            if (data.success) {
                // Try to log in the newly created user
                Login(email, password)
                .then(loginData => {
                    history.push("/stocks");
                });
            }
            
            setError(null);
        })
        .catch(err => {
            let errorMessage = "Error: " + err.message;

            setError(errorMessage);
        })

        e.preventDefault();
    }

    return (
        <div className="center">
            <Form className="register-form" onSubmit={e => tryRegister(e)}>
                <Card>
                    <CardBody>
                        {error ? <Alert color="danger">{error}</Alert> : null}

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter a email"
                                value={email} onChange={e => setEmail(e.target.value)}/>
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="Enter a password"
                                value={password} onChange={e => setPassword(e.target.value)}/>
                        </FormGroup>

                        <Button className="btn-block" type="submit" color="primary">Register</Button>

                        <hr/>
                        
                        <Link to="/login">Already have an account?</Link>
                    </CardBody>
                </Card>
            </Form>
        </div>
    );
}

export function RegisterPage(props) {
    return (
        <div>
            <h1>Register</h1>

            <br/>
            
            <RegisterForm/>
        </div>
    );
}