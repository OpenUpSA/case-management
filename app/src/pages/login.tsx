import React from "react";
import { useHistory } from "react-router-dom";
import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";

import { RedirectIfLoggedIn, UserInfo } from "../auth";
import { authenticate } from "../api";
import { FormControl, Grid, Input, InputLabel } from "@material-ui/core";
import { useStyles } from "../utils";

const Page = () => {
  RedirectIfLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const [loginError, setLoginError] = React.useState<boolean>();

  const validateLogin = async (username: string, password: string) => {
    try {
      const credentials = {
        username: username,
        password: password,
      };
      const { token, user_id } = await authenticate(credentials);
      if (token && user_id) {
        const userInfo = UserInfo.getInstance();
        userInfo.setAccessToken(token);
        userInfo.setUserId(user_id.toString());
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
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="email"
                shrink={true}
              >
                {i18n.t("Email address")}:
              </InputLabel>
              <Input
                id="email"
                disableUnderline={true}
                className={classes.textField}
                aria-describedby="my-helper-text"
                autoComplete="email"
                autoFocus
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="password"
                shrink={true}
              >
                {i18n.t("Password")}:
              </InputLabel>
              <Input
                id="password"
                type="password"
                disableUnderline={true}
                className={classes.textField}
                aria-describedby="my-helper-text"
                autoComplete="password"
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 3, marginBottom: 2 }}
            >
              {i18n.t("Login")}
            </Button>
          </Grid>
        </Grid>
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
