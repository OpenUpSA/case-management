import React, { useEffect } from "react";
import { useHistory, useParams, Prompt } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, getLegalCase, getMeeting, updateMeeting } from "../../api";
import { ILegalCase, IClient, IMeeting, LocationState } from "../../types";
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
import RateReviewIcon from "@material-ui/icons/RateReview";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@mui/material/CircularProgress";

import MeetingForm from "../../components/meeting/form";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();

  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting, setMeeting] = React.useState<IMeeting>();
  const [changed, setChanged] = React.useState<boolean>(false);
  const [locationError, setLocationError] = React.useState<boolean>(false);
  const [meetingTypeError, setMeetingTypeError] =
    React.useState<boolean>(false);
  const [notesError, setNotesError] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const saveMeeting = async (saveMeeting: IMeeting  ) => {
    try {
      setIsLoading(true)
      const { id, location, meeting_type, notes } = await updateMeeting({...saveMeeting, id: parseInt(params.id)});
      setIsLoading(false)
      if (typeof location === "object") {
        setLocationError(true);
        setMeetingTypeError(false);
        setNotesError(false);
        return false;
      } else if (typeof meeting_type === "object") {
        setMeetingTypeError(true);
        setLocationError(false);
        setNotesError(false);
        return false;
      } else if (typeof notes === "object") {
        setNotesError(true);
        setLocationError(false);
        setMeetingTypeError(false);
        return false;
      } else {
        setNotesError(false);
        setLocationError(false);
        setMeetingTypeError(false);
      }

      id &&
        history.push({
          pathname: `/meetings/${id}`,
          state: {
            open: true,
            message: "Meeting edit successful",
            severity: "success",
          },
        });
    } catch (e) {
      setIsLoading(false)
      setShowSnackbar({
        open: true,
        message: "Meeting edit failed",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      const meetingId = parseInt(params.id);
      const dataMeeting = await getMeeting(meetingId);
      const dataLegalCase = await getLegalCase(dataMeeting.legal_case);
      setMeeting(dataMeeting);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
    }
    fetchData();
  }, [params.id]);

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
      <Container maxWidth="md">
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              notes: { value: string };
              location: { value: string };
              meeting_date: { value: string };
              meeting_type: { value: string };
              name: { value: string };
            };

            saveMeeting({
              legal_case: meeting?.legal_case || 0,
              notes: target.notes.value,
              location: target.location.value,
              meeting_date: target.meeting_date.value,
              meeting_type: target.meeting_type.value,
              name: target.name.value,
            } );
          }}
        >
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
                  onClick={() => {
                    history.push(`/meetings/${meeting?.id}`);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Cancel changes")}</ListItemText>
                </MenuItem>
              </MoreMenu>
            </Grid>
            <Grid style={{ position: "relative" }} item className={classes.zeroWidthOnMobile}>
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                disabled={isLoading}
                startIcon={<RateReviewIcon />}
                type="submit"
                onClick={() => setChanged(false)}
              >
                {i18n.t("Save meeting")}
              </Button>
              {isLoading && (
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
            </Grid>
          </Grid>
          <Prompt
            when={changed}
            message={() =>
              "You have already made some changes\nAre you sure you want to leave?"
            }
          />
          <MeetingForm
            meeting={meeting}
            readOnly={false}
            changed={changed}
            setChanged={setChanged}
            locationError={locationError}
            notesError={notesError}
            meetingTypeError={meetingTypeError}
          />
        </form>
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
