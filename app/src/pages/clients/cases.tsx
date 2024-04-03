import React, { useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import { Breadcrumbs, Container, Button } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

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
            <div>Client: {client ? client.preferred_name : ""}</div>
          </Breadcrumbs>
        </Container>
      </header>
      <header className={classes.underBreadCrumbHeader}>
        <Container maxWidth="md">
          <PersonIcon className={classes.underBreadCrumbHeaderIcon} />
          <span>{client ? client.preferred_name : ""}</span>
        </Container>
      </header>
      <Container maxWidth="md">
        <ClientTabs
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setShowSnackbar={setShowSnackbar}
          legalCases={legalCases ? legalCases : []}
          client={client}
          newCaseHandler={newCaseHandler}
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
