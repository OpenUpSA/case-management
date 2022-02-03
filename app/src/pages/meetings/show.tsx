import React, { useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import {
  getClient,
  getLegalCase,
  getMeeting,
  deleteMeeting,
  getLegalCaseFile,
} from "../../api";
import {
  ILegalCase,
  IClient,
  IMeeting,
  LocationState,
  ILegalCaseFile,
} from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
  MenuItem,
} from "@material-ui/core";
import { useStyles } from "../../utils";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteIcon from "@material-ui/icons/Delete";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ListItemText from "@material-ui/core/ListItemText";
import MoreMenu from "../../components/moreMenu";

import MeetingForm from "../../components/meeting/form";
import SnackbarAlert from "../../components/general/snackBar";
import CircularProgress from "@mui/material/CircularProgress";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting, setMeeting] = React.useState<IMeeting>();
  const [meetingFile, setMeetingFile] = React.useState<ILegalCaseFile>();

  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);

  const destroyMeeting = async () => {
    try {
      setDeleteLoader(true);
      if (
        window.confirm(i18n.t("Are you sure you want to delete this meeting?"))
      ) {
        await deleteMeeting(parseInt(params.id));
        history.push({
          pathname: `/cases/${legalCase?.id}`,
          state: {
            open: true,
            message: "Meeting delete successful",
            severity: "success",
          },
        });
      }
      setDeleteLoader(false);
    } catch (error) {
      setDeleteLoader(false);
      setShowSnackbar({
        open: true,
        message: "Meeting delete failed",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const meetingId = parseInt(params.id);
        const dataMeeting = await getMeeting(meetingId);
        const dataLegalCase = await getLegalCase(dataMeeting.legal_case);
        if (dataMeeting.legal_case_file) {
          const dataMeetingFile = await getLegalCaseFile(
            dataMeeting.legal_case_file
          );
          setMeetingFile(dataMeetingFile);
        }
        setMeeting(dataMeeting);
        setLegalCase(dataLegalCase);
        setClient(await getClient(dataLegalCase.client));
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
  }, [params.id]);

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

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          Client: {client ? client.preferred_name : ""}
        </Button>
        <Button
          disabled={legalCase ? false : true}
          onClick={() => history.push(`/cases/${legalCase?.id}`)}
        >
          Case: {legalCase?.case_number}
        </Button>
        <div>Meeting: {meeting?.meeting_type}</div>
      </Breadcrumbs>
      <Container maxWidth="md" style={{ position: "relative" }}>
        <form>
          <Grid
            className={classes.pageBar}
            container
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Grid item>
              <ChatIcon color="primary" style={{ display: "flex" }} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h6">
                <strong>{meeting?.meeting_type}</strong>
              </Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <MenuItem
                  style={{ position: "relative" }}
                  disabled={deleteLoader}
                  onClick={destroyMeeting}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Delete meeting")}</ListItemText>
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
            <Grid item className={classes.zeroWidthOnMobile}>
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<RateReviewIcon />}
                onClick={() => {
                  history.push(`/meetings/${meeting?.id}/edit`);
                }}
              >
                {i18n.t("Edit meeting")}
              </Button>
            </Grid>
          </Grid>

          <MeetingForm
            meeting={meeting}
            showFile={true}
            meetingFile={meetingFile}
          />
        </form>
        {isLoading && (
          <Grid container justify="center">
            <CircularProgress
              sx={{ position: "absolute", top: "42vh", left: "50%" }}
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
