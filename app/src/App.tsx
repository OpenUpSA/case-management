import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import "@fontsource/roboto";
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