import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import "@fontsource/karla";
import { CaseOfficesProvider } from "./contexts/caseOfficesContext";
import { CaseTypesProvider } from "./contexts/caseTypesContext";
import { LanguagesProvider } from "./contexts/languagesContext";

class App extends Component {
  render() {
    return (
      <LanguagesProvider>
        <CaseTypesProvider>
          <CaseOfficesProvider>
            <Router>
              <Routes />
            </Router>
          </CaseOfficesProvider>
        </CaseTypesProvider>
      </LanguagesProvider>
    );
  }
}

export default App;
