import React from "react";
import { useHistory } from "react-router-dom";
import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";

import { RedirectIfLoggedIn, Tokens } from "../auth";
import { authenticate } from "../api";

const Page = () => {
  RedirectIfLoggedIn();
  let history = useHistory();
  const [loginError, setLoginError] = React.useState<boolean>();

  const validateLogin = async (username: string, password: string) => {
    try {
      const { token } = await authenticate(username, password);
      if (token) {
        const tokens = Tokens.getInstance();
        tokens.setAccessToken(token);
        history.push("/clients");
      } else {
        setLoginError(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <LayoutSimple>
      <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
        {i18n.t("Login")}
      </Typography>

      {loginError ? (
        <Typography component="p" style={{ color: "#990000", marginTop: 8 }}>
          {i18n.t("Login error")}
        </Typography>
      ) : null}

      <Box
        component="form"
        onSubmit={(event: React.SyntheticEvent) => {
          event.preventDefault();
          setLoginError(false);
          const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
          };
          validateLogin(target.email.value, target.password.value);
        }}
        style={{ marginTop: 1 }}
      >
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
          color="primary"
          style={{ marginTop: 3, marginBottom: 2 }}
        >
          {i18n.t("Login")}
        </Button>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Link
            style={{ display: "none" }}
            href="/forgot-password"
            variant="body2"
          >
            {i18n.t("Forgot password")}
          </Link>
        </div>
      </Box>
    </LayoutSimple>
  );
};

export default Page;
