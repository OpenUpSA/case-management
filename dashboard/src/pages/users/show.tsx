import i18n from "../../i18n";
import React, { useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Button, Container } from "@material-ui/core";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@material-ui/core/Grid";
import SettingsIcon from "@material-ui/icons/Settings";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";

import Layout from "../../components/layout";
import { getUser } from "../../api";
import { IUser, LocationState } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import UserForm from "../../components/user/form";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const userId = parseInt(params.id);

  const [user, setUser] = React.useState<IUser>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setUser(await getUser(userId));
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setShowSnackbar({
          open: true,
          message: "Account details cannot be loaded",
          severity: "error",
        });
      }
    }
    fetchData();
  }, [userId]);

  // set location.state?.open! to false on page load
  useEffect(() => {
    history.push({ state: { open: false } });
  }, [history]);

  useEffect(() => {
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

  return (
    <Layout>
      <Breadcrumbs
        className={classes.breadcrumbs}
        separator="›"
        aria-label="breadcrumb"
      >
        <div>{i18n.t("Your account")}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid
          className={classes.pageBar}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item>
            <SettingsIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{user ? user.name || user.email : ""}</strong>
            </Typography>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<PermIdentityIcon />}
              onClick={() => {
                history.push(`/users/${user?.id}/edit`);
              }}
            >
              {i18n.t("Edit your account")}
            </Button>
          </Grid>
        </Grid>
        {isLoading && (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
        {user ? <UserForm user={user} /> : ""}
      </Container>
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </Layout>
  );
};

export default Page;
