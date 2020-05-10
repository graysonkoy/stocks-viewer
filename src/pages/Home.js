import React from "react";
import { Link as RouteLink } from "react-router-dom"
import { Jumbotron, Button, Media } from "reactstrap"

export function Home(props) {
	return (
		<Media className="home-content center">
			<Media className="home-image" left>
				<img src="home.jpg" alt="Buildings"/>
			</Media>

			<Media right className="home-main">
				<h1 className="display-3">Stocks</h1>
				<p className="lead">Welcome to the stocks viewer.</p>
				<Button className="btn btn-lg" color="primary" tag={RouteLink} to="/stocks">View stocks</Button>
			</Media>
		</Media>
	)
}