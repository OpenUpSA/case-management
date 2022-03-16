import React, { useState, useEffect } from "react";
import { IconButton, Input, InputLabel, Button } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

import { LegalCaseStates } from "../../contexts/legalCaseStateConstants";
import { useStyles } from "../../utils";
import {
  createLegalCaseFile,
  getLegalCaseFiles,
  createCaseUpdate,
  updateLegalCase,
  getCaseUpdates,
  getLegalCase,
} from "../../api";
import { ILegalCase, LocationState, ILegalCaseFile } from "../../types";
import i18n from "../../i18n";
import UpdateDialogTabs from "./updateDialogTabs";
import UpdateTable from "./updateTable";
import SnackbarAlert from "../general/snackBar";

type Props = {
  legalCase: ILegalCase;
  setLegalCase: (legalCase: ILegalCase) => void;
  legalCaseFiles: ILegalCaseFile[];
  setLegalCaseFiles: (legalCaseFiles: ILegalCaseFile[]) => void;
  caseUpdates: any;
  setCaseUpdates: (caseUpdates: any) => void;
  setStatus: (status: string) => void;
};

const CaseUpdateTab = (props: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [note, setNote] = useState<any>({ title: "", content: "" });
  const [meeting, setMeeting] = useState<any>({
    meeting_type: "",
    location: "",
    notes: "",
    meeting_date: new Date().toISOString().slice(0, 16),
    advice_was_offered: "",
    advice_offered: "",
  });
  const [tabValue, setTabValue] = useState<number>(0);
  const [attachedFileData, setAttachedFileData] = useState<any>({
    file: null,
    description: "",
  });
  const [fileTabFileName, setFileTabFileName] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
  const [status, setStatus] = useState<string>(props.legalCase.state);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [updateError, setUpdateError] = useState<string>("");

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

  const dialogClose = () => {
    setOpen(false);
    setNote({ title: "", content: "" });
    setAttachedFileData({ file: null, description: "" });
  };

  const onFileChange = async (event: any, fileDescription: string) => {
    setAttachedFileData({
      file: event.target.files[0],
      description: fileDescription,
    });
  };

  const submitNoteUpdate = async () => {
    const upLoadNoteFile = async () => {
      setIsLoading(true);
      createLegalCaseFile(
        props.legalCase.id,
        attachedFileData.file,
        attachedFileData.description,
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
            createNote(res.id);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "Note update failed",
            severity: "error",
          });
        });
    };

    const createNote = async (meetingFileId: number | null) => {
      setIsLoading(true);
      await createCaseUpdate({
        note: {
          title: note.title,
          content: note.content,
          file: meetingFileId,
        },
        legal_case: props.legalCase.id,
      })
        .then((res: any) => {
          setIsLoading(false);

          if (typeof res.note.title === "object") {
            setUpdateError("title");
            return false;
          } else if (typeof res.note.content === "object") {
            setUpdateError("content");
            return false;
          } else {
            setUpdateError("");
          }

          if (res.id) {
            dialogClose();
            refreshUpdates();
            setShowSnackbar({
              open: true,
              message: "Note update successful",
              severity: "success",
            });
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "Note update failed",
            severity: "error",
          });
        });
    };

    try {
      if (attachedFileData.file) {
        await upLoadNoteFile();
      } else {
        await createNote(null);
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Note update failed",
        severity: "error",
      });
    }
  };

  const submitMeetingUpdate = async () => {
    const upLoadMeetingFile = async () => {
      setIsLoading(true);
      createLegalCaseFile(
        props.legalCase.id,
        attachedFileData.file,
        attachedFileData.description,
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
            createMeeting(res.id);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "Meeting update failed",
            severity: "error",
          });
        });
    };

    const createMeeting = async (meetingFileId: number | null) => {
      setIsLoading(true);
      await createCaseUpdate({
        meeting: {
          meeting_type: meeting.meeting_type,
          location: meeting.location,
          notes: meeting.notes,
          meeting_date: meeting.meeting_date,
          file: meetingFileId,
          advice_was_offered: meeting.advice_was_offered,
          advice_offered: meeting.advice_offered,
        },
        legal_case: props.legalCase.id,
      })
        .then((res: any) => {
          setIsLoading(false);

          if (typeof res.meeting.meeting_type === "object") {
            setUpdateError("meeting_type");
            return false;
          } else if (typeof res.meeting.location === "object") {
            setUpdateError("location");
            return false;
          } else if (typeof res.meeting.notes === "object") {
            setUpdateError("notes");
            return false;
          } else {
            setUpdateError("");
          }

          if (res.id) {
            dialogClose();
            refreshUpdates();
            setShowSnackbar({
              open: true,
              message: "Meeting update successful",
              severity: "success",
            });
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "Meeting update failed",
            severity: "error",
          });
        });
    };

    try {
      if (attachedFileData.file) {
        await upLoadMeetingFile();
      } else {
        await createMeeting(null);
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Meeting update failed",
        severity: "error",
      });
    }
  };

  const submitFileUpdate = async () => {
    const upLoadFile = async () => {
      setIsLoading(true);
      createLegalCaseFile(
        props.legalCase.id,
        selectedFiles,
        fileTabFileName,
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
            setUpdateError("");
            createFile(res.id);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setUpdateError("file_upload");
        });
    };

    const createFile = async (meetingFileId: number | null) => {
      setIsLoading(true);
      await createCaseUpdate({
        files: [meetingFileId],
        legal_case: props.legalCase.id,
      })
        .then((res: any) => {
          setIsLoading(false);

          if (res.id) {
            dialogClose();
            refreshUpdates();
            setShowSnackbar({
              open: true,
              message: "File update successful",
              severity: "success",
            });
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setShowSnackbar({
            open: true,
            message: "File update failed",
            severity: "error",
          });
        });
    };

    try {
      await upLoadFile();
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "File update failed",
        severity: "error",
      });
    }
  };

  const statusPatch = async () => {
    try {
      setIsLoading(true);
      const updatedStatus: ILegalCase = {
        ...props.legalCase,
        state: status,
      };
      const { id } = await updateLegalCase(updatedStatus);
      if (id) {
        updateCase();
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onDrop = (files: any) => {
    if (files.length > 0) {
      setSelectedFiles(files[0]);
      setFileTabFileName(files[0].name);
    }
  };

  const submitHandler = () => {
    if (tabValue === 0) {
      submitNoteUpdate();
    } else if (tabValue === 1) {
      submitMeetingUpdate();
    } else if (tabValue === 2) {
      submitFileUpdate();
    }

    statusChanged && statusPatch();
  };

  const refreshUpdates = async () => {
    const dataLegalCaseFiles = await getLegalCaseFiles(
      props.legalCase.id as number
    );
    props.setLegalCaseFiles(dataLegalCaseFiles);
    const updates = await getCaseUpdates(props.legalCase.id as number);
    props.setCaseUpdates(updates);
  };

  const updateCase = async () => {
    const dataLegalCase = await getLegalCase(props.legalCase.id as number);
    props.setLegalCase(dataLegalCase);
  };

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      alignItems="center"
      className={classes.containerMarginBottom}
    >
      <Grid item xs={12} md={12}>
        <Button
          className={classes.bigCanBeFab}
          fullWidth
          color="primary"
          variant="contained"
          startIcon={<AddCommentIcon />}
          onClick={() => setOpen(true)}
        >
          {i18n.t("Add new update")}
        </Button>
        <Dialog open={open} onClose={dialogClose} fullWidth maxWidth="md">
          <Box style={{ margin: 20 }}>
            <Grid
              container
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item>
                <DialogTitle
                  style={{ padding: 5, fontWeight: "bold", fontSize: 24 }}
                >
                  {i18n.t("New update")}
                </DialogTitle>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.closeButton}
                  size={"small"}
                  onClick={dialogClose}
                >
                  <CloseIcon fontSize={"large"} style={{ color: "black" }} />
                </IconButton>
              </Grid>
            </Grid>
            <UpdateDialogTabs
              onFileChange={onFileChange}
              note={note}
              setNote={setNote}
              meeting={meeting}
              setMeeting={setMeeting}
              progress={progress}
              onDrop={onDrop}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              fileTabFileName={fileTabFileName}
              setFileTabFileName={setFileTabFileName}
              setTabValue={setTabValue}
              updateError={updateError}
            />
            <Box
              className={classes.centerItems}
              style={{
                borderTop: "1px solid rgb(0,0,0,0.2)",
                paddingTop: "20px",
                marginBottom: "20px",
              }}
            >
              <InputLabel
                className={classes.dialogLabel}
                style={{ paddingRight: 15 }}
                htmlFor="status"
              >
                {i18n.t("Also update case status")}:
              </InputLabel>
              <Select
                id="status"
                className={classes.select}
                style={{ flexGrow: 1 }}
                disableUnderline
                input={<Input />}
                value={status}
                renderValue={() => status}
                onChange={(event: SelectChangeEvent<string>) => {
                  setStatus(event.target.value);
                  setStatusChanged(true);
                  props.setStatus(event.target.value);
                }}
              >
                {LegalCaseStates?.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <DialogActions style={{ padding: 0 }}>
              <Button
                fullWidth
                onClick={dialogClose}
                className={classes.dialogCancel}
              >
                {i18n.t("Cancel")}
              </Button>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                className={classes.dialogSubmit}
                onClick={() => submitHandler()}
                disabled={isLoading}
                style={{ position: "relative" }}
              >
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
                {i18n.t("Submit update")}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Grid>
      <Grid item style={{ flexGrow: 1 }}>
        <strong>
          {props.caseUpdates.length} {i18n.t("Case Updates")}
        </strong>
      </Grid>
      <Grid item>
        <InputLabel
          className={classes.inputLabel}
          htmlFor="sort_table"
          style={{ marginRight: "-20px" }}
        >
          {i18n.t("Sort")}:
        </InputLabel>
      </Grid>
      <Grid item>
        <Select
          id="sort_table"
          className={classes.select}
          disableUnderline
          input={<Input />}
          value="alphabetical"
        >
          <MenuItem key="alphabetical" value="alphabetical">
            {i18n.t("Alphabetical")}
          </MenuItem>
        </Select>
      </Grid>
      <UpdateTable
        caseUpdates={props.caseUpdates}
        legalCaseFiles={props.legalCaseFiles ? props.legalCaseFiles : []}
      />
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </Grid>
  );
};

export default CaseUpdateTab;
