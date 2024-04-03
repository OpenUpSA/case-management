import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import { Breadcrumbs, Button, Container } from "@material-ui/core";

import Layout from "../../components/layout";
import {
  getClient,
  getLegalCase,
  getLegalCaseReferral,
  getLegalCaseReferrals,
} from "../../api";
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
import LegalCaseReferralEdit from "../../components/legalCaseReferral/edit";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const legalCaseReferralId = parseInt(params.id);
  const [open] = useState<boolean>(true);
  const [editOpen, setEditOpen] = useState<boolean>(true);

  const [legalCaseReferral, setLegalCaseReferral] =
    useState<ILegalCaseReferral>();
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

  const dialogEditOpen = () => {
    setEditOpen(true);
  };

  const dialogEditClose = () => {
    history.push(`/cases/${legalCase?.id}/referrals`);
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
      const dataLegalCaseReferral = await getLegalCaseReferral(
        legalCaseReferralId
      );
      const dataLegalCase = await getLegalCase(
        dataLegalCaseReferral.legal_case
      );
      const dataLegalCaseReferrals = await getLegalCaseReferrals(
        dataLegalCaseReferral.legal_case
      );
      const dataClient = await getClient(dataLegalCase.client);

      setLegalCaseReferral(dataLegalCaseReferral);
      setLegalCase(dataLegalCase);
      setLegalCaseReferrals(dataLegalCaseReferrals);
      setClient(dataClient);
    } catch (e: any) {
      setShowSnackbar({
        open: true,
        message: e.message,
        severity: "error",
      });
      history.goBack();
    }
  };

  useEffect(() => {
    fetchData();
  }, [legalCaseReferralId]);

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
        dialogNewOpen={dialogEditOpen}
        dialogClose={dialogClose}
        updateListHandler={fetchData}
      ></LegalCaseReferralList>

      {legalCaseReferral && (
        <LegalCaseReferralEdit
          open={editOpen}
          dialogClose={dialogEditClose}
          legalCaseReferral={legalCaseReferral}
          setLegalCaseReferral={setLegalCaseReferral}
          updateListHandler={fetchData}
        ></LegalCaseReferralEdit>
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
