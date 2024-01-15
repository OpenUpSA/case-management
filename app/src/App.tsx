import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import "@fontsource/karla";
import { CaseOfficesProvider } from "./contexts/caseOfficesContext";
import { CaseTypesProvider } from "./contexts/caseTypesContext";
import { LanguagesProvider } from "./contexts/languagesContext";
import { InstanceSettingsProvider } from "./contexts/instanceSettingsContext";

class App extends Component {
  render() {
    return (
      <InstanceSettingsProvider>
        <LanguagesProvider>
          <CaseTypesProvider>
            <CaseOfficesProvider>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </CaseOfficesProvider>
          </CaseTypesProvider>
        </LanguagesProvider>
      </InstanceSettingsProvider>
    );
  }
}

export default App;
