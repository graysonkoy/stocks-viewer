import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"
import { Form, FormGroup, Label, Input, Button, Card, CardBody, CardText, Alert } from "reactstrap"

import { Login } from "../api/api"

function LoginForm(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState(null);
    let [redirect, setRedirect] = useState(false);
    let history = useHistory();

    const tryLogin = (email, password) => {
        Login(email, password)
        .then(data => {
            setRedirect(true);

            setError(null);
        })
        .catch(err => {
            setError(err);
        })
    }

    if (redirect) {
        history.push(`/stocks`);
    }

    return (
        <div className="center">
            <Form className="login-form">
                <Card>
                    <CardBody>
                        <CardText>
                            {error ? <Alert color="danger">{error}</Alert> : ""}

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

                            <Button className="btn-block" type="Button" color="primary"
                                 onClick={e => tryLogin(email, password)}>Log in</Button>

                            <hr/>
                            
                            <Link to="/register">Don't have an account?</Link>
                        </CardText>
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