import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import "@fontsource/roboto";
import { CaseOfficesProvider } from "./contexts/caseOfficesContext";

class App extends Component {
  render() {
    return (
      <CaseOfficesProvider>
        <Router>
          <Routes />
        </Router>
      </CaseOfficesProvider>
    );
  }
}

export default App;
