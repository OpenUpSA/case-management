import React from "react";
import { useHistory } from "react-router-dom";
import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import { RedirectIfLoggedIn, UserInfo } from "../auth";
import { authenticate, getUser } from "../api";
import { FormControl, Grid, Input, InputLabel } from "@material-ui/core";
import { useStyles } from "../utils";
import { LocationState } from "../types";
import SnackbarAlert from "../components/general/snackBar";

const Page = () => {
  RedirectIfLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const [loginError, setLoginError] = React.useState<boolean>();
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });

  React.useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar({
          open: false,
          message: "",
          severity: undefined,
        });
      }, 6000);
    };
    resetState();
  }, [showSnackbar.open]);

  const validateLogin = async (username: string, password: string) => {
    try {
      const credentials = {
        username: username,
        password: password,
      };
      const { token, user_id } = await authenticate(credentials);
      const { name, case_office, email } = await getUser(user_id);

      if (token && user_id) {
        const userInfo = UserInfo.getInstance();
        userInfo.setAccessToken(token);
        userInfo.setUserId(user_id.toString());
        userInfo.setName(name);
        userInfo.setCaseOffice(case_office);
        userInfo.setEmail(email);
        history.push("/clients");
      } else {
        setLoginError(true);
        setShowSnackbar({
          open: true,
          message: "Login failed",
          severity: "error",
        });
      }
    } catch (e) {
      setShowSnackbar({
        open: true,
        message: "Login failed",
        severity: "error",
      });
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
      </Box>
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </LayoutSimple>
  );
};

export default Page;
