import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import React from "react";
import LoginPage from "./pages/login";
import LogoutPage from "./pages/logout";

import ClientsPage from "./pages/clients/list";
import ClientPage from "./pages/clients/show";
import ClientEditPage from "./pages/clients/edit";
import ClientNewPage from "./pages/clients/new";
import ClientLegalCasesPage from "./pages/clients/cases";

import LegalCasePage from "./pages/legalCases/show";

import ClientDependentPage from "./pages/clientDependents/show";
import ClientDependentNewPage from "./pages/clientDependents/new";

import UpdateEditPage from "./pages/updates/edit";

import LegalCaseReferralsPage from "./pages/legalCaseReferrals/list";
import LegalCaseReferralsEditPage from "./pages/legalCaseReferrals/edit";

import UserPage from "./pages/users/show";
import UserEditPage from "./pages/users/edit";

import NotFoundPage from "./pages/notFound";
import Navigation from "./components/navigation";
import SiteNoticeDialog from "./components/siteNotice";
import LogsPage from "./pages/logs/list";

import ReactGA from "react-ga4";
import Hotjar from "@hotjar/browser";

import { UserInfo } from "./auth";

import { isLoggedIn } from "./auth";
import RedirectToFile from "./pages/files/redirect";
import RedirectToUpdateFromMeeting from "./pages/meetings/redirectToUpdate";
import RedirectToUpdateFromNote from "./pages/notes/redirectToUpdate";

if (process.env.REACT_APP_GA_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_ID!);
}

if (process.env.REACT_APP_HOTJAR_ID) {
  Hotjar.init(Number(process.env.REACT_APP_HOTJAR_ID), 6);
}

function Routes() {
  const [id, setId] = React.useState<number>();
  const history = useHistory();
  history.listen((location) => {
    ReactGA.set({ page: location.pathname });
  });

  React.useEffect(() => {
    const userInfo = UserInfo.getInstance();
    const userId = Number(userInfo.getUserId());

    setId(userId);

    if (id! > 0) {
      ReactGA.set({ userId: id });
    }
  }, [id]);

  return (
    <>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/logout" component={LogoutPage} />

        <Route exact path="/clients" component={ClientsPage} />
        <Route exact path="/clients/new" component={ClientNewPage} />
        <Route exact path="/clients/:id" component={ClientPage} />
        <Route exact path="/clients/:id/edit" component={ClientEditPage} />
        <Route
          exact
          path="/clients/:id/cases"
          component={ClientLegalCasesPage}
        />
        <Route
          exact
          path="/clients/:id/info"
          component={ClientLegalCasesPage}
        />
        <Route
          exact
          path="/clients/:id/files"
          component={ClientLegalCasesPage}
        />

        <Route exact path="/dependents/:id" component={ClientDependentPage} />
        <Route
          exact
          path="/clients/:id/dependents/new"
          component={ClientDependentNewPage}
        />

        <Route exact path="/cases/:id/" component={LegalCasePage} />
        <Route exact path="/cases/:id/updates" component={LegalCasePage} />
        <Route exact path="/cases/:id/files" component={LegalCasePage} />
        <Route exact path="/cases/:id/referrals" component={LegalCaseReferralsPage} />

        <Route exact path="/referrals/:id" component={LegalCaseReferralsEditPage} />

        <Route exact path="/updates/:id/edit" component={UpdateEditPage} />

        <Route exact path="/meetings/:id/edit" component={RedirectToUpdateFromMeeting} />
        <Route exact path="/notes/:id/edit" component={RedirectToUpdateFromNote} />

        <Route exact path="/users/:id" component={UserPage} />
        <Route exact path="/users/:id/edit" component={UserEditPage} />

        <Route exact path="/updates" component={LogsPage} />

        <Route exact path="/files/:id" component={RedirectToFile} />

        <Route component={NotFoundPage} />
      </Switch>

      {isLoggedIn() ? <SiteNoticeDialog /> : null}
    </>
  );
}

export default Routes;
