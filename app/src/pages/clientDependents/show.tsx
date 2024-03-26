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
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../../components/layout";
import {
  getClient,
  getClientDependent,
  deleteClientDependent,
} from "../../api";
import { IClient, IClientDependent, LocationState, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";

import ClientDependentDetails from "../../components/clientDependent/clientDependentDetails";
import MoreMenu from "../../components/moreMenu";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const clientDependentId = parseInt(params.id);
  const [clientDependent, setClientDependent] =
    React.useState<IClientDependent>();
  const [client, setClient] = React.useState<IClient>();
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });
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
        if (clientDependentId) {
          setClientDependent(await getClientDependent(clientDependentId));
          const clientId = (await getClientDependent(clientDependentId)).client;
          if (clientId) {
            setClient(await getClient(clientId));
          }
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
  }, [clientDependentId]);

  const destroyClientDependent = async () => {
    try {
      setDeleteLoader(true);
      if (
        window.confirm(
          i18n.t("Are you sure you want to delete this dependent?")
        )
      ) {
        await deleteClientDependent(clientDependentId);
        history.push({
          pathname: `/clients/${client?.id}/cases`,
          state: {
            open: true,
            message: "Dependent delete successful",
            severity: "success",
          },
        });
      }
      setDeleteLoader(false);
    } catch (e) {
      setDeleteLoader(false);
      setShowSnackbar({
        open: true,
        message: "Dependent delete failed",
        severity: "error",
      });
    }
  };

  return (
    <Layout>
      <header className={classes.breadCrumbHeader}>
        <Container maxWidth="md">
          <Breadcrumbs
            className={classes.breadcrumbs}
            aria-label="breadcrumb"
            separator="&#9656;"
          >
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          Client: {client ? client.preferred_name : ""}
        </Button>
        <div>
          Dependent: {clientDependent ? clientDependent.preferred_name : ""}
        </div>
      </Breadcrumbs>
        </Container>
      </header>

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
                {clientDependent ? clientDependent.preferred_name : ""}
              </strong>
            </Typography>
          </Grid>
          <Grid item>
            <MoreMenu>
              <MenuItem
                style={{ position: "relative" }}
                onClick={destroyClientDependent}
                disabled={deleteLoader}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete dependent")}</ListItemText>
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
            </MoreMenu>
          </Grid>
        </Grid>

        <ClientDependentDetails clientDependent={clientDependent} />
        <hr className={classes.hr} />
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
