import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "reactstrap"
import { spring, AnimatedSwitch } from 'react-router-transition';

import { StocksNavbar } from "./components/StocksNavbar"

import { Home } from "./pages/Home"
import { StocksList } from "./pages/StocksList"
import { StockViewer } from "./pages/StockViewer"
import { RegisterPage } from "./pages/Register"
import { LoginPage } from "./pages/Login"
import { LogoutPage } from "./pages/Logout"

import "./App.css"

function mapStyles(styles) {
	return {
		opacity: styles.opacity,
		transform: `translateX(${styles.left}px)`,
	};
}

function fadeSpring(val) {
	return spring(val, {
		stiffness: 300,
		damping: 20,
	});
}

function slideSpring(val) {
	return spring(val, {
		stiffness: 200,
		damping: 20,
	});
}

function App() {
	return (
		<Router>
			<Container className="App d-flex h-100 flex-column">
				<header className="p-3 mb-3">
					<StocksNavbar/>
				</header>

				<main>
					<AnimatedSwitch
						atEnter={{ opacity: 0, left: 50 }}
						atLeave={{ opacity: fadeSpring(0), left: slideSpring(-100) }}
						atActive={{ opacity: fadeSpring(1), left: slideSpring(0) }}
						mapStyles={mapStyles}
						className="route-wrapper"
					>
						<Route exact path="/" component={Home}/>
						<Route exact path="/stocks" component={StocksList}/>
						<Route exact path="/stocks/:symbol" component={StockViewer}/>
						<Route exact path="/register" component={RegisterPage}/>
						<Route exact path="/login" component={LoginPage}/>
						<Route exact path="/logout" component={LogoutPage}/>
					</AnimatedSwitch>
				</main>
			</Container>
		</Router>
	);
}

export default App;