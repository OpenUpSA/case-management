import React, { useEffect, useContext } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Button,
  Container,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Input,
} from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@material-ui/icons/Person";
import MoreMenu from "../../components/moreMenu";

import Layout from "../../components/layout";
import {
  deleteLegalCase,
  getClient,
  getLegalCase,
  updateLegalCase,
  getLogs,
  getMeetings,
} from "../../api";
import {
  ILegalCase,
  IClient,
  IMeeting,
  LocationState,
  SnackbarState,
  ILog,
  ICaseType,
} from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import DeleteIcon from "@material-ui/icons/Delete";
import CaseTabs from "../../components/legalCase/caseTabs";
import SnackbarAlert from "../../components/general/snackBar";
import CircularProgress from "@mui/material/CircularProgress";
import { LegalCaseStates } from "../../contexts/legalCaseStateConstants";
import { CaseTypesContext } from "../../contexts/caseTypesContext";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const caseId = parseInt(params.id);

  const [contextCaseTypes] = useContext(CaseTypesContext);
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meetings, setMeetings] = React.useState<IMeeting[]>();
  const [status, setStatus] = React.useState<string>(legalCase?.state || "");
  const [caseHistory, setCaseHistory] = React.useState<ILog[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  const destroyLegalCase = async () => {
    try {
      setDeleteLoader(true);
      if (
        window.confirm(i18n.t("Are you sure you want to delete this case?"))
      ) {
        await deleteLegalCase(caseId);
        history.push({
          pathname: `/cases/`,
          state: {
            open: true,
            message: "Case delete successful",
            severity: "success",
          },
        });
      }
      setDeleteLoader(false);
    } catch (e) {
      setDeleteLoader(false);
      setShowSnackbar({
        open: true,
        message: "Case delete failed",
        severity: "error",
      });
    }
  };

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
        setIsLoading(true);
        const dataLegalCase = await getLegalCase(caseId);
        const dataMeetings = await getMeetings(caseId);
        const historyData = await getLogs(caseId, "LegalCase");
        const dataClient = await getClient(dataLegalCase.client);

        setStatus(dataLegalCase.state);
        setLegalCase(dataLegalCase);
        setClient(dataClient);
        setCaseHistory(historyData);
        setMeetings(dataMeetings);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        setShowSnackbar({
          open: true,
          message: e.message,
          severity: "error",
        });
      }
    }
    fetchData();
  }, [caseId]);

  const statusPatch = async (arg: any) => {
    try {
      setIsLoading(true);
      const updatedStatus: ILegalCase = {
        id: legalCase!.id,
        summary: legalCase!.summary,
        case_number: legalCase!.case_number,
        state: arg,
        client: legalCase!.client,
        case_types: legalCase!.case_types,
        case_offices: legalCase!.case_offices,
      };
      const { id } = await updateLegalCase(updatedStatus);
      setIsLoading(false);
      if (id) {
        setShowSnackbar({
          open: true,
          message: "Case edit successful",
          severity: "success",
        });
        updateCase();
        updateHistory();
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Case edit failed",
        severity: "error",
      });
    }
  };

  const updateCase = async () => {
    const dataLegalCase = await getLegalCase(caseId);
    setLegalCase(dataLegalCase);
  };

  const updateHistory = async () => {
    const historyData = await getLogs(caseId, "LegalCase");
    setCaseHistory(historyData);
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
            <div>Case: {legalCase?.case_number}</div>
          </Breadcrumbs>
        </Container>
      </header>
      <header className={classes.underBreadCrumbHeader}>
        <Container maxWidth="md">
          <PersonIcon className={classes.underBreadCrumbHeaderIcon} />
          <span>
            <a
              className={classes.underBreadCrumbHeaderLink}
              onClick={() => history.push(`/clients/${client?.id}/cases`)}
            >
              {client ? client.preferred_name : ""}
            </a>
          </span>
        </Container>
      </header>
      <header className={classes.pageBarHead}>
        <Container maxWidth="md" style={{ position: "relative" }}>
          <Grid
            className={classes.pageBarTemp}
            container
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Grid item>
              <Button
                onClick={() => history.push(`/clients/${client?.id}/cases`)}
                className={classes.fullHeightContainedButton}
              >
                <ArrowBackIcon />
              </Button>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h5" className={classes.lineHeightSmall}>
                {legalCase && (
                  <strong>
                    {contextCaseTypes
                      ?.filter(
                        (caseType: ICaseType) =>
                          legalCase.case_types.indexOf(caseType.id) > -1
                      )
                      .map((caseType: ICaseType) => caseType.title)
                      .join(", ")}{" "}
                    case
                  </strong>
                )}
                <br />
                <small>{legalCase?.case_number}</small>
              </Typography>
            </Grid>
            <Grid item className={classes.selectStatus}>
              <p>Case status:&nbsp;</p>
              <Select
                id="demo-simple-select"
                disableUnderline
                className={classes.select}
                input={<Input />}
                value={status}
                onChange={(event: SelectChangeEvent<string>) => {
                  setStatus(event.target.value as any);
                  statusPatch(event.target.value as any);
                }}
                style={{ width: "200px", fontSize: "13px" }}
                renderValue={() => status}
              >
                {LegalCaseStates?.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <MoreMenu>
                <MenuItem
                  style={{ position: "relative" }}
                  disabled={deleteLoader}
                  onClick={destroyLegalCase}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Delete case")}</ListItemText>
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
        </Container>
      </header>
      <Container maxWidth="md">
        <CaseTabs
          legalCase={legalCase!}
          setLegalCase={setLegalCase}
          meetings={meetings ? meetings : []}
          standalone={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setShowSnackbar={setShowSnackbar}
          caseHistory={caseHistory ? caseHistory : []}
          setCaseHistory={setCaseHistory}
          setStatus={setStatus}
        />

        {isLoading && (
          <Grid container justifyContent="center">
            <CircularProgress
              sx={{ position: "absolute", top: 10, left: "50%", zIndex: 100 }}
            />
          </Grid>
        )}
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
