import i18n from "../../i18n";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { Breadcrumbs, Button, Container } from "@material-ui/core";

import Layout from "../../components/layout";
import { getClient } from "../../api";
import { IClient } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [client, setClient] = React.useState<IClient>();

  useEffect(() => {
    async function fetchData() {
      const clientId = parseInt(params.id);
      setClient(await getClient(clientId));
    }
    fetchData();
  }, [params.id]);

  return (
    <Layout>
      <Breadcrumbs
        className={classes.breadcrumbs}
        separator="›"
        aria-label="breadcrumb"
      >
        <Link to="/clients" component={Button}>
          {i18n.t("Client list")}
        </Link>
        <div>{client?.preferred_name}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <PersonIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{client?.preferred_name}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
            >
              {i18n.t("New case")}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Page;
