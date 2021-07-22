import { Switch, Route } from "react-router-dom";

import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgotPassword";

import ClientsPage from "./pages/clients/list";
import ClientPage from "./pages/clients/show";
import ClientLegalCasesPage from "./pages/clients/cases";

import LegalCasesPage from "./pages/legalCases/list";
import LegalCasePage from "./pages/legalCases/show";

import MeetingsPage from "./pages/meetings/list";
import MeetingPage from "./pages/meetings/show";
import MeetingEditPage from "./pages/meetings/edit";
import MeetingNewPage from "./pages/meetings/new";

import NotFoundPage from "./pages/notFound";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/forgot-password" component={ForgotPasswordPage} />
      
      <Route exact path="/clients" component={ClientsPage} />
      <Route exact path="/clients/:id" component={ClientPage} />
      <Route exact path="/clients/:id/cases" component={ClientLegalCasesPage} />
      <Route exact path="/cases" component={LegalCasesPage} />
      <Route exact path="/cases/:id" component={LegalCasePage} />
      
      <Route exact path="/meetings" component={MeetingsPage} />
      <Route exact path="/meetings/:id" component={MeetingPage} />
      <Route exact path="/meetings/:id/edit" component={MeetingEditPage} />
      <Route exact path="/cases/:id/meetings/new" component={MeetingNewPage} />

      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default Routes;
