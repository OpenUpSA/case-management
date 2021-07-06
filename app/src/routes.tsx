import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import Clients from "./pages/clients";
import NotFound from "./pages/not-found";
import ClippedDrawer from "./pages/clippedDrawer";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route exact path="/login" component={Login} />
      <Route exact path="/dirk" component={ClippedDrawer} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/clients" component={Clients} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;
