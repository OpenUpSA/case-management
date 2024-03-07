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
import CircularProgress from "@mui/material/CircularProgress";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";

import Layout from "../../components/layout";
import {
  getLegalCases,
  getClient,
  deleteClient,
  createLegalCase,
} from "../../api";
import { ILegalCase, IClient, LocationState, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";

import MoreMenu from "../../components/moreMenu";
import SnackbarAlert from "../../components/general/snackBar";
import ClientTabs from "../../components/client/clientTabs";

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
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const dataLegalCases = await getLegalCases(clientId);
        setLegalCases(dataLegalCases);

        if (clientId) {
          setClient(await getClient(clientId));
        }
      } catch (e: any) {
        setShowSnackbar({
          open: true,
          message: e.message,
          severity: "error",
        });
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
    try {
      setDeleteLoader(true);
      if (
        window.confirm(i18n.t("Are you sure you want to delete this client?"))
      ) {
        await deleteClient(clientId);
        history.push({
          pathname: "/clients",
          state: {
            open: true,
            message: "Client delete successful",
            severity: "success",
          },
        });
      }
      setDeleteLoader(false);
    } catch (e) {
      setDeleteLoader(false);
      setShowSnackbar({
        open: true,
        message: "Client delete failed",
        severity: "error",
      });
    }
  };

  const newCaseHandler = async () => {
    try {
      setIsLoading(true);
      const { id } = await createLegalCase(dataForCase);
      setIsLoading(false);
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
      setIsLoading(false);
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
                style={{ position: "relative" }}
                onClick={destroyClient}
                disabled={deleteLoader}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete client")}</ListItemText>
                {deleteLoader && (
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
              </MenuItem>
              <MenuItem
                style={{ position: "relative" }}
                onClick={() =>
                  history.push(`/clients/${clientId}/dependents/new`)
                }
                disabled={deleteLoader}
              >
                <ListItemIcon>
                  <EscalatorWarningIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Add dependent")}</ListItemText>
              </MenuItem>
            </MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              disableElevation={true}
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              disabled={isLoading || client === undefined}
              onClick={newCaseHandler}
            >
              {i18n.t("New case")}
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    zIndex: 10000,
                    left: "50%",
                  }}
                />
              )}
            </Button>
          </Grid>
        </Grid>

        <ClientTabs
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setShowSnackbar={setShowSnackbar}
          legalCases={legalCases ? legalCases : []}
          client={client}
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
