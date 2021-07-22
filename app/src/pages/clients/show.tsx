import i18n from "../../i18n";
import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Container,
  ListItemIcon,
} from "@material-ui/core";

import Layout from "../../components/layout";
import { getClient, deleteClient } from "../../api";
import { IClient } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import DeleteIcon from "@material-ui/icons/Delete";
import ClientForm from "../../components/client/form";
import MoreMenu from "../../components/moreMenu";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [client, setClient] = React.useState<IClient>();

  const destroyClient = () => {
    if (
      window.confirm(i18n.t("Are you sure you want to delete this client?"))
    ) {
      deleteClient(parseInt(params.id));
      history.push("/clients");
    }
  };

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
        <Grid className={classes.pageBar} container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <PersonIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{client?.preferred_name}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <MoreMenu>
              <ListItem onClick={destroyClient}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete client")}</ListItemText>
              </ListItem>
            </MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<PermIdentityIcon />}
              onClick={() => {
                history.push(`/clients/${client?.id}/edit`);
              }}
            >
              {i18n.t("Edit client")}
            </Button>
          </Grid>
        </Grid>
        {client ? <ClientForm client={client} detailedView={true} /> : ""}
      </Container>
    </Layout>
  );
};

export default Page;
