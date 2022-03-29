import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import "@fontsource/karla";

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
