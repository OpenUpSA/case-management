import i18n from "../../i18n";
import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Button,
  Container,
} from "@material-ui/core";

import Layout from "../../components/layout";
import { getUser } from "../../api";
import { IUser } from "../../types";
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
              <strong>
                {user ? user.name || user.email : ""}
              </strong>
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
        {user ? <UserForm user={user} /> : ""}
      </Container>
    </Layout>
  );
};

export default Page;
