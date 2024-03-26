import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import { Breadcrumbs, Button, Container } from "@material-ui/core";

import Layout from "../../components/layout";
import { getClient, getLegalCase, getLegalCaseReferrals } from "../../api";
import {
  ILegalCase,
  LocationState,
  SnackbarState,
  ILegalCaseReferral,
  IClient,
} from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import SnackbarAlert from "../../components/general/snackBar";

import LegalCaseReferralList from "../../components/legalCaseReferral/list";
import LegalCaseReferralNew from "../../components/legalCaseReferral/new";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const caseId = parseInt(params.id);
  const [open] = useState<boolean>(true);
  const [newOpen, setNewOpen] = useState<boolean>(false);

  const [legalCaseReferrals, setLegalCaseReferrals] = useState<
    ILegalCaseReferral[]
  >([]);
  const [legalCase, setLegalCase] = useState<ILegalCase>();
  const [client, setClient] = useState<IClient>();
  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  const dialogClose = () => {
    history.push(`/cases/${legalCase?.id}`);
  };

  const dialogNewOpen = () => {
    setNewOpen(true);
  };

  const dialogNewClose = () => {
    setNewOpen(false);
  };

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

  const fetchData = async () => {
    try {
      const dataLegalCase = await getLegalCase(caseId);
      const dataLegalCaseReferrals = await getLegalCaseReferrals(caseId);
      const dataClient = await getClient(dataLegalCase.client);

      setLegalCase(dataLegalCase);
      setLegalCaseReferrals(dataLegalCaseReferrals);
      setClient(dataClient);
    } catch (e: any) {
      setShowSnackbar({
        open: true,
        message: e.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [caseId]);

  return (
    <Layout>
      <header className={classes.breadCrumbHeader}>
        <Container maxWidth="md">
          <Breadcrumbs
            className={classes.breadcrumbs}
            aria-label="breadcrumb"
            separator="&#9656;"
          >
        <Button onClick={dialogClose}>{i18n.t("Client list")}</Button>
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          Client: {client ? client.preferred_name : ""}
        </Button>
        <div>Case: {legalCase?.case_number}</div>
      </Breadcrumbs>
        </Container>
      </header>

      <LegalCaseReferralList
        open={open}
        legalCaseReferrals={legalCaseReferrals}
        dialogNewOpen={dialogNewOpen}
        dialogClose={dialogClose}
        updateListHandler={fetchData}
      ></LegalCaseReferralList>

      {legalCase && (
        <LegalCaseReferralNew
          open={newOpen}
          dialogClose={dialogNewClose}
          legalCase={legalCase}
          updateListHandler={fetchData}
        ></LegalCaseReferralNew>
      )}

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
