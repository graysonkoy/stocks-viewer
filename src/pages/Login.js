import React, { useState } from "react";

import { Form, FormGroup, Label, Input } from "reactstrap"

export function Login(props) {
    return (
        <Form className="login-form">
            <FormGroup>
                <Label for="username">Username</Label>
                <Input id="username" name="username" type="username" placeholder="Enter a username"/>
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter a password"/>
            </FormGroup>
        </Form>
    )
}