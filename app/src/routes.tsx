import { Switch, Route } from "react-router-dom";
import React from "react";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";

import ClientsPage from "./pages/clients/list";
import ClientPage from "./pages/clients/show";
import ClientEditPage from "./pages/clients/edit";
import ClientNewPage from "./pages/clients/new";
import ClientLegalCasesPage from "./pages/clients/cases";

import LegalCasesPage from "./pages/legalCases/list";
import LegalCasePage from "./pages/legalCases/show";
import LegalCaseNewPage from "./pages/legalCases/new";

import MeetingsPage from "./pages/meetings/list";
import MeetingPage from "./pages/meetings/show";
import MeetingEditPage from "./pages/meetings/edit";
import MeetingNewPage from "./pages/meetings/new";

import UserPage from "./pages/users/show";
import UserEditPage from "./pages/users/edit";

import NotFoundPage from "./pages/notFound";

import Navigation from "./components/navigation";

import LogsPage from "./pages/logs/list";

function Routes() {
  return (
    <div>
      <Navigation />
      <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />

          <Route exact path="/clients" component={ClientsPage} />
          <Route exact path="/clients/new" component={ClientNewPage} />
          <Route exact path="/clients/:id" component={ClientPage} />
          <Route exact path="/clients/:id/edit" component={ClientEditPage} />
          <Route
            exact
            path="/clients/:id/cases"
            component={ClientLegalCasesPage}
          />

          <Route exact path="/cases" component={LegalCasesPage} />
          <Route exact path="/cases/:id" component={LegalCasePage} />
          <Route
            exact
            path="/clients/:id/cases/new"
            component={LegalCaseNewPage}
          />

          <Route exact path="/meetings" component={MeetingsPage} />
          <Route exact path="/meetings/:id" component={MeetingPage} />
          <Route exact path="/meetings/:id/edit" component={MeetingEditPage} />
          <Route
            exact
            path="/cases/:id/meetings/new"
            component={MeetingNewPage}
          />

          <Route exact path="/users/:id" component={UserPage} />
          <Route exact path="/users/:id/edit" component={UserEditPage} />

          <Route exact path="/updates" component={LogsPage} />

          <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export default Routes;
