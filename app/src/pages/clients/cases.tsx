import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import Layout from "../../components/layout";
import { getLegalCases, getClient } from "../../api";
import { ILegalCase, IClient } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import MoreMenu from "../../components/moreMenu";

import ClientForm from "../../components/client/form";
import LegalCasesTable from "../../components/legalCase/table";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const clientId = parseInt(params.id);
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [client, setClient] = React.useState<IClient>();

  useEffect(() => {
    async function fetchData() {
      const dataLegalCases = await getLegalCases(clientId);
      setLegalCases(dataLegalCases);

      if (clientId) {
        setClient(await getClient(clientId));
      }
    }
    fetchData();
  }, [clientId]);

  return (
    <Layout>
      {client ? (
        <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
          <Button onClick={() => history.push("/clients")}>
            {i18n.t("Client list")}
          </Button>
          <div>{client?.preferred_name}</div>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
          <div>{i18n.t("Case list")}</div>
        </Breadcrumbs>
      )}
      <Container maxWidth="md">
        <Grid
          className={classes.pageBar}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item>
            <PersonIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>
                {client ? client.preferred_name : i18n.t("Case list")}
              </strong>
            </Typography>
          </Grid>
          <Grid item>
            <MoreMenu>
              <MenuItem
                onClick={() => {
                  history.push(`/clients/${clientId}`);
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("View client")}</ListItemText>
              </MenuItem>
            </MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              onClick={() => {
                history.push(`/clients/${client?.id}/cases/new`);
              }}
            >
              {i18n.t("New case")}
            </Button>
          </Grid>
        </Grid>

        <ClientForm client={client} />
        <hr className={classes.hr} />

        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <strong>
              {legalCases ? legalCases.length : "0"} {i18n.t("Cases")}
            </strong>
          </Grid>
        </Grid>

        <LegalCasesTable legalCases={legalCases} standalone={false} />
      </Container>
    </Layout>
  );
};

export default Page;
