import React, { useEffect } from "react";
import { useHistory, useParams, Prompt } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
  MenuItem,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@mui/material/CircularProgress";

import MeetingForm from "../../components/meeting/form";
import MoreMenu from "../../components/moreMenu";
import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, getLegalCase, createMeeting } from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import SnackbarAlert from "../../components/general/snackBar";
import { createLegalCaseFile } from "../../api";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting] = React.useState<IMeeting>({
    location: "",
    meeting_date: new Date().toISOString().slice(0, 16),
    meeting_type: "",
    legal_case: 0,
    notes: "",
    name: "",
  });
  const [changed, setChanged] = React.useState<boolean>(false);
  const [locationError, setLocationError] = React.useState<boolean>(false);
  const [meetingTypeError, setMeetingTypeError] =
    React.useState<boolean>(false);
  const [notesError, setNotesError] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [meetingFileData, setMeetingFileData] = React.useState<any>({
    file: null,
    description: "",
  });

  const newMeeting = async (newMeeting: IMeeting) => {
    const upLoadFile = async () => {
      setIsLoading(true);
      createLegalCaseFile(
        legalCase?.id,
        meetingFileData.file,
        meetingFileData.description,
        (e: any) => {
          const { loaded, total } = e;
          const percent = Math.floor((loaded * 100) / total);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => {
              setProgress(0);
            }, 1000);
          }
        }
      )
        .then((res: any) => {
          setIsLoading(false);
          if (res.id) {
            createNewMeeting(newMeeting, res.id);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setShowSnackbar(true);
        });
    };

    const createNewMeeting = async (
      newMeeting: IMeeting,
      meetingFileId: number | null
    ) => {
      setIsLoading(true);
      await createMeeting({
        ...newMeeting,
        legal_case: parseInt(params.id),
        legal_case_file: meetingFileId,
      })
        .then((response: any) => {
          setIsLoading(false);
          if (typeof response.location === "object") {
            setLocationError(true);
            setMeetingTypeError(false);
            setNotesError(false);
            return false;
          } else if (typeof response.meeting_type === "object") {
            setMeetingTypeError(true);
            setLocationError(false);
            setNotesError(false);
            return false;
          } else if (typeof response.notes === "object") {
            setNotesError(true);
            setLocationError(false);
            setMeetingTypeError(false);
            return false;
          } else {
            setNotesError(false);
            setLocationError(false);
            setMeetingTypeError(false);
          }

          response.id &&
            history.push({
              pathname: `/meetings/${response.id}`,
              state: {
                open: true,
                message: "New meeting created",
                severity: "success",
              },
            });
        })
        .catch((e) => {
          setIsLoading(false);
          setShowSnackbar(true);
        });
    };

    try {
      if (meetingFileData.file) {
        await upLoadFile();
      } else {
        await createNewMeeting(newMeeting, null);
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar(true);
    }
  };

  const onFileChange = async (event: any, fileDescription: string) => {
    setMeetingFileData({
      file: event.target.files[0],
      description: fileDescription,
    });
  };

  useEffect(() => {
    async function fetchData() {
      const caseId = parseInt(params.id);
      const dataLegalCase = await getLegalCase(caseId);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
    }
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar(false);
      }, 6000);
    };
    resetState();
  }, [showSnackbar]);

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
        <div>{i18n.t("New meeting")}</div>
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

            newMeeting({
              notes: target.notes.value,
              location: target.location.value,
              meeting_date: target.meeting_date.value,
              meeting_type: target.meeting_type.value,
              name: target.name.value,
            } as IMeeting);
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
              <Typography variant="h6">{i18n.t("New meeting")}</Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <MenuItem
                  onClick={() => {
                    history.push(`/cases/${legalCase?.id}`);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Cancel changes")}</ListItemText>
                </MenuItem>
              </MoreMenu>
            </Grid>
            <Grid
              style={{ position: "relative" }}
              item
              className={classes.zeroWidthOnMobile}
            >
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<RateReviewIcon />}
                disabled={isLoading}
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
            showUploadButton={true}
            onFileChange={onFileChange}
            progress={progress}
          />
        </form>
      </Container>
      {showSnackbar && (
        <SnackbarAlert
          open={showSnackbar}
          message={"New meeting failed"}
          severity={"error"}
        />
      )}
    </Layout>
  );
};

export default Page;
