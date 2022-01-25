import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import "@fontsource/roboto";
import { CaseOfficesProvider } from "./contexts/caseOfficesContext";
import { CaseTypesProvider } from "./contexts/caseTypesContext";

class App extends Component {
  render() {
    return (
      <CaseTypesProvider>
        <CaseOfficesProvider>
          <Router>
            <Routes />
          </Router>
        </CaseOfficesProvider>
      </CaseTypesProvider>
    );
  }
}

export default App;
