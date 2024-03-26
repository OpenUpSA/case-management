import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import { Breadcrumbs, Button, Container } from "@material-ui/core";

import Layout from "../../components/layout";
import {
  getClient,
  getLegalCase,
  getLogs,
  getMeetings,
  getCaseUpdate,
} from "../../api";
import {
  ILegalCase,
  IClient,
  IMeeting,
  LocationState,
  SnackbarState,
  ILog,
  ILegalCaseFile,
} from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import SnackbarAlert from "../../components/general/snackBar";
import UpdateDialog from "../../components/legalCase/updateDialog";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const caseUpdateId = parseInt(params.id);

  const [caseUpdate, setCaseUpdate] = useState<any>();
  const [legalCaseFiles, setLegalCaseFiles] = useState<ILegalCaseFile[]>([]);
  const [caseUpdates, setCaseUpdates] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(true);
  const [legalCase, setLegalCase] = useState<ILegalCase>();
  const [client, setClient] = useState<IClient>();
  const [meetings, setMeetings] = useState<IMeeting[]>();
  const [status, setStatus] = useState<string>(legalCase?.state || "");
  const [caseHistory, setCaseHistory] = useState<ILog[]>([]);
  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

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
        const dataCaseUpdate = await getCaseUpdate(caseUpdateId);
        const dataLegalCase = await getLegalCase(dataCaseUpdate.legal_case);
        const dataMeetings = await getMeetings(dataCaseUpdate.legal_case);
        const historyData = await getLogs(
          dataCaseUpdate.legal_case,
          "LegalCase"
        );
        const dataClient = await getClient(dataLegalCase.client);

        setCaseUpdate(dataCaseUpdate);
        setStatus(dataLegalCase.state);
        setLegalCase(dataLegalCase);
        setClient(dataClient);
        setCaseHistory(historyData);
        setMeetings(dataMeetings);
      } catch (e: any) {
        setShowSnackbar({
          open: true,
          message: e.message,
          severity: "error",
        });
      }
    }
    fetchData();
  }, [caseUpdateId]);

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
            <div>Case: {legalCase?.case_number}</div>
          </Breadcrumbs>
        </Container>
      </header>
      {legalCase && (
        <UpdateDialog
          open={open}
          setOpen={setOpen}
          setStatus={setStatus}
          legalCase={legalCase}
          setLegalCase={setLegalCase}
          legalCaseFiles={legalCaseFiles}
          setLegalCaseFiles={setLegalCaseFiles}
          setCaseUpdates={setCaseUpdates}
          editView={true}
          selectedUpdate={caseUpdate}
          setCaseHistory={setCaseHistory}
        />
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
