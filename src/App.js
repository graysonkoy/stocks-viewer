import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { StocksNavbar } from "./components/StocksNavbar"

import { Home } from "./pages/Home"
import { StocksList } from "./pages/StocksList"
import { StockViewer } from "./pages/StockViewer"
import { RegisterPage } from "./pages/Register"
import { LoginPage } from "./pages/Login"
import { LogoutPage } from "./pages/Logout"

import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <StocksNavbar/>

        <div className="container pt-4">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/stocks" component={StocksList}/>
            <Route exact path="/stocks/:symbol" component={StockViewer}/>
            <Route exact path="/register" component={RegisterPage}/>
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/logout" component={LogoutPage}/>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;