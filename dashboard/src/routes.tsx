import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import LogoutPage from "./pages/logout";
import ForgotPassword from "./pages/forgot-password";
import NotFound from "./pages/not-found";
import Navigation from "./components/navigation";
import UserPage from "./pages/users/show";
import UserEditPage from "./pages/users/edit";

function Routes() {
  return (
    <div>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={LogoutPage} />
        <Route exact path="/forgot-password" component={ForgotPassword} />

        <Route exact path="/users/:id" component={UserPage} />
        <Route exact path="/users/:id/edit" component={UserEditPage} />

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default Routes;
