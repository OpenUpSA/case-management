import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import NotFound from "./pages/not-found";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/forgot-password" component={ForgotPassword} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;
