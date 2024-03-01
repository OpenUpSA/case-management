import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import Divider from "@mui/material/Divider";
import { Breadcrumbs, Button, IconButton } from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@mui/material/Box";

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

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, [caseId]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={dialogClose}>{i18n.t("Client list")}</Button>
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          Client: {client ? client.preferred_name : ""}
        </Button>
        <div>Case: {legalCase?.case_number}</div>
      </Breadcrumbs>

      <LegalCaseReferralList
        legalCaseReferrals={legalCaseReferrals}
        dialogNewOpen={dialogNewOpen}
        dialogClose={dialogClose}
      ></LegalCaseReferralList>

      <LegalCaseReferralNew
        open={newOpen}
        dialogClose={dialogNewClose}
        legalCase={legalCase}
      ></LegalCaseReferralNew>

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
