import React, { useEffect } from "react";
import { useHistory, useParams, Prompt } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import {
  getClient,
  getLegalCase,
  getLegalCaseFile,
  createLegalCaseFile,
  deleteLegalCaseFile,
  getMeeting,
  updateMeeting,
} from "../../api";
import {
  ILegalCase,
  IClient,
  IMeeting,
  SnackbarState,
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
  const [meetingFile, setMeetingFile] = React.useState<ILegalCaseFile>();
  const [changed, setChanged] = React.useState<boolean>(false);
  const [locationError, setLocationError] = React.useState<boolean>(false);
  const [meetingTypeError, setMeetingTypeError] =
    React.useState<boolean>(false);
  const [notesError, setNotesError] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [meetingFileData, setMeetingFileData] = React.useState<any>({
    file: null,
    description: "",
  });
  const [progress, setProgress] = React.useState<number>(0);
  const [fileToDelete, setFileToDelete] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const meetingId = parseInt(params.id);
      const dataMeeting = await getMeeting(meetingId);
      const dataLegalCase = await getLegalCase(dataMeeting.legal_case);
      if (dataMeeting.file) {
        const dataMeetingFile = await getLegalCaseFile(dataMeeting.file);
        setMeetingFile(dataMeetingFile);
      }
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

  const saveMeeting = async (saveMeeting: IMeeting) => {
    const upLoadFile = async () => {
      if (!fileToDelete && meeting?.file) {
        await deleteLegalCaseFile(meeting?.file as number);
      }
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
            updateCaseMeeting(saveMeeting, res.id);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "Meeting edit failed",
            severity: "error",
          });
        });
    };

    const updateCaseMeeting = async (
      saveMeeting: IMeeting,
      meetingFileId: number | null | undefined
    ) => {
      setIsLoading(true);
      await updateMeeting({
        ...saveMeeting,
        id: parseInt(params.id),
        file: meetingFileId,
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
                message: "Meeting edit successful",
                severity: "success",
              },
            });
        })
        .catch(() => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "Meeting edit failed",
            severity: "error",
          });
        });
    };

    try {
      if (fileToDelete) {
        await deleteLegalCaseFile(meeting?.file as number);
      }
      if (meetingFileData.file) {
        await upLoadFile();
      } else {
        await updateCaseMeeting(
          saveMeeting,
          fileToDelete ? null : meetingFile?.id
        );
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Meeting edit failed",
        severity: "error",
      });
    }
  };

  const onFileChange = async (event: any, fileDescription: string) => {
    setMeetingFileData({
      file: event.target.files[0],
      description: fileDescription,
    });
  };

  const deleteFile = async () => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setFileToDelete(true);
    } else {
      return;
    }
  };
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
            });
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
            <Grid
              style={{ position: "relative" }}
              item
              className={classes.zeroWidthOnMobile}
            >
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
                {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",     
                    zIndex: 10000,
                    left: "50%",
                  }}
                />
              )}
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
            meetingFile={meetingFile}
            readOnly={false}
            changed={changed}
            setChanged={setChanged}
            locationError={locationError}
            notesError={notesError}
            meetingTypeError={meetingTypeError}
            showUploadButton={true}
            buttonText={meetingFile ? "Change file" : "Upload file"}
            onFileChange={onFileChange}
            progress={progress}
            deleteFile={deleteFile}
            fileToDelete={fileToDelete}
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
