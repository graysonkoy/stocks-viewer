import React from "react";
import { Link as RouteLink } from "react-router-dom"
import { Jumbotron, Button } from "reactstrap"

export function Home(props) {
    return (
        <Jumbotron>
            <h1 className="display-3">Stocks</h1>
            <p className="lead">Welcome to the stocks website.</p>
            <hr className="my-2"/>
            <br/>
            <Button tag={RouteLink} to="/stocks" color="primary">View stocks</Button>
        </Jumbotron>
    )
}