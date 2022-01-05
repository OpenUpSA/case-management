import i18n from "../../i18n";
import React, { useEffect } from "react";
import { useParams, useHistory, Prompt } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Button, Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SettingsIcon from "@material-ui/icons/Settings";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../../components/layout";
import { getUser, updateUser } from "../../api";
import { IUser, LocationState } from "../../types";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";
import { useStyles } from "../../utils";
import UserForm from "../../components/user/form";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const userId = parseInt(params.id);
  const [user, setUser] = React.useState<IUser>();
  const [changed, setChanged] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const saveUser = async (user: IUser) => {
    try {
      setIsLoading(true);
      const updatedUser = {
        ...user,
        id: userId,
      };
      const response = await updateUser(updatedUser);
      setIsLoading(false);
      if (response.id) {
        const userInfo = UserInfo.getInstance();
        userInfo.setName(response.name);
        userInfo.setCaseOffice(response.case_office);
        userInfo.setEmail(response.email);
        history.push({
          pathname: `/users/${response.id}`,
          state: {
            open: true,
            message: "Account edit successful",
            severity: "success",
          },
        });
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Account edit failed",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      setUser(await getUser(userId));
    }
    fetchData();
  }, [userId]);

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
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              name: { value: string };
              membership_number: { value: string };
              contact_number: { value: string };
              email: { value: string };
              case_office: { value: string };
            };

            //TODO: Better way to handle empty/null case_office selection
            let case_office = parseInt(target.case_office.value);

            saveUser({
              name: target.name.value,
              membership_number: target.membership_number.value,
              contact_number: target.contact_number.value,
              email: target.email.value,
              case_office: case_office === 0 ? null : case_office,
            });
          }}
        >
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
            <Grid
              style={{ position: "relative" }}
              item
              className={classes.zeroWidthOnMobile}
            >
              <Button
                type="submit"
                className={classes.canBeFab}
                color="primary"
                disabled={isLoading}
                variant="contained"
                startIcon={<PermIdentityIcon />}
                onClick={() => {
                  setChanged(false);
                  if (!changed) {
                    history.push(`/users/${user?.id}/edit`);
                  }
                }}
              >
                {i18n.t("Save your account")}
              </Button>
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Grid>
          </Grid>
          <Prompt
            when={changed}
            message={() =>
              "You have already made some changes\nAre you sure you want to leave?"
            }
          />
          {user ? (
            <UserForm
              user={user}
              readOnly={false}
              changed={changed}
              setChanged={setChanged}
            />
          ) : (
            ""
          )}
        </form>
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
