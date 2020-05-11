import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"
import { Form, FormGroup, Label, Input, Button, Card, CardBody, Alert } from "reactstrap"

import { Login } from "../api/api"

function LoginForm(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState(null);
    let history = useHistory();

    const tryLogin = e => {
        Login(email, password)
        .then(data => {
            history.push("/stocks");

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
            <Form className="login-form" onSubmit={e => tryLogin(e)}>
                <Card>
                    <CardBody>
                        {error ? <Alert color="danger">{error}</Alert> : null}

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter your email"
                                value={email} onChange={e => setEmail(e.target.value)}/>
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="Enter your password"
                                value={password} onChange={e => setPassword(e.target.value)}/>
                        </FormGroup>

                        <Button className="btn-block" type="submit" color="primary">Log in</Button>

                        <hr/>
                        
                        <Link to="/register">Don't have an account?</Link>
                    </CardBody>
                </Card>
            </Form>
        </div>
    );
}

export function LoginPage(props) {
    return (
        <div>
            <h1>Login</h1>

            <br/>

            <LoginForm/>
        </div>
    )
}