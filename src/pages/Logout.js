import React, { useState } from "react";
import { Link } from "react-router-dom"
import { Button } from "reactstrap"

import { Logout } from "../api/api"

export function LogoutPage(props) {
	let loggedOut = Logout();

    return (
    	<div>
	    	<h1>You have been logged out</h1>

	    	<br/>

	    	<Button tag={Link} exact to="/" color="primary">Home page</Button>
	    </div>
    );
}