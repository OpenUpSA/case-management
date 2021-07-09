import { Component } from "react";

import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";

import { RouteComponentProps } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";

class Page extends Component<RouteComponentProps> {
  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.history.push("/clients");
  };

  public render(): any {
    return (
      <LayoutSimple>
        <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
          {i18n.t("Login")}
        </Typography>

        <Box component="form" onSubmit={this.handleSubmit} style={{ marginTop: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={i18n.t("Email Address")}
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={i18n.t("Password")}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ marginTop: 3, marginBottom: 2 }}
          >
            {i18n.t("Login")}
          </Button>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Link href="/forgot-password" variant="body2">
              {i18n.t("Forgot password")}
            </Link>
          </div>
        </Box>
      </LayoutSimple>
    );
  }
}

export default Page;
