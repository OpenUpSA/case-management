import i18n from "../../i18n";
import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Button, Container } from "@material-ui/core";

import Layout from "../../components/layout";
import { getUser, updateUser } from "../../api";
import { IUser, Nullable } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import Grid from "@material-ui/core/Grid";
import SettingsIcon from "@material-ui/icons/Settings";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import UserForm from "../../components/user/form";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const userId = parseInt(params.id);
  const [user, setUser] = React.useState<IUser>();
  const [saveError, setSaveError] = React.useState<Nullable<string>>();

  const saveUser = async (user: IUser) => {
    try {
      setSaveError(null);
      const updatedUser = {
        ...user,
        id: userId,
      };
      const response = await updateUser(updatedUser);
      if (response.id) {
        history.push(`/users/${response.id}`);
      } else {
        //TODO: Better validation and error messages needed
        setSaveError(Object.values(response).join("\n"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setUser(await getUser(userId));
    }
    fetchData();
  }, [userId]);

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
            <Grid item className={classes.zeroWidthOnMobile}>
              <Button
                type="submit"
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<PermIdentityIcon />}
                onClick={() => {
                  history.push(`/users/${user?.id}/edit`);
                }}
              >
                {i18n.t("Save your account")}
              </Button>
            </Grid>
          </Grid>
          {saveError ? (
            <p className={classes.formError}>
              {i18n.t("Error saving account details")} {saveError}
            </p>
          ) : null}
          {user ? <UserForm user={user} readOnly={false} /> : ""}
        </form>
      </Container>
    </Layout>
  );
};

export default Page;
