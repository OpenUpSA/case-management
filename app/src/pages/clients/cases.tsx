import React, { useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";

import Layout from "../../components/layout";
import {
  getLegalCases,
  getClient,
  deleteClient,
  createLegalCase,
} from "../../api";
import { ILegalCase, IClient, LocationState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";

import ClientDetails from "../../components/client/clientDetails";
import LegalCasesTable from "../../components/legalCase/table";
import MoreMenu from "../../components/moreMenu";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const clientId = parseInt(params.id);
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [client, setClient] = React.useState<IClient>();
  const [dataForCase, setDataForCase] = React.useState<any>({
    client: "",
    users: "",
    case_offices: "",
  });
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  // set location.state?.open! to false on page load
  useEffect(() => {
    history.push({ state: { open: false } });
  }, []);

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

  useEffect(() => {
    async function fetchData() {
      const dataLegalCases = await getLegalCases(clientId);
      setLegalCases(dataLegalCases);

      if (clientId) {
        setClient(await getClient(clientId));
      }
    }
    fetchData();
    const userInfo = UserInfo.getInstance();
    const userId = Number(userInfo.getUserId());
    const case_office = Number(userInfo.getCaseOffice());
    setDataForCase({
      client: clientId,
      users: [userId],
      case_offices: case_office > 0 ? [case_office] : [1],
    });
  }, [clientId]);

  const destroyClient = async () => {
    if (
      window.confirm(i18n.t("Are you sure you want to delete this client?"))
    ) {
      await deleteClient(clientId);
      history.push("/clients");
    }
  };

  const newCaseHandler = async () => {
    try {
      const { id } = await createLegalCase(dataForCase);
      if (id) {
        history.push({
          pathname: `/cases/${id}`,
          state: {
            open: true,
            message: "New case created",
            severity: "success",
          },
        });
      }
    } catch (e) {
      setShowSnackbar({
        open: true,
        message: "New case failed",
        severity: "error",
      });
    }
  };

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <div>Client: {client ? client.preferred_name : ""}</div>
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
                  history.push(`/clients/${clientId}/edit`);
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Edit client")}</ListItemText>
              </MenuItem>
              <MenuItem onClick={destroyClient}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete client")}</ListItemText>
              </MenuItem>
            </MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              disabled={client ? false : true}
              onClick={newCaseHandler}
            >
              {i18n.t("New case")}
            </Button>
          </Grid>
        </Grid>

        <ClientDetails client={client} />
        <hr className={classes.hr} />

        <LegalCasesTable
          legalCases={legalCases ? legalCases : []}
          standalone={false}
        />
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
