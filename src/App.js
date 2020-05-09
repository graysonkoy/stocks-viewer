import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { StocksNavbar } from "./components/StocksNavbar"

import { Home } from "./pages/Home"
import { StocksList } from "./pages/StocksList"
import { StockViewer } from "./pages/StockViewer"
import { Login } from "./pages/Login"

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
            <Route exact path="/login" component={Login}/>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;