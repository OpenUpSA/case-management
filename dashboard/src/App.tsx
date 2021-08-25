import { Component } from "react";

import "@fontsource/roboto";

import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default App;
