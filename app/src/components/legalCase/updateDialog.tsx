import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IconButton,
  Input,
  InputLabel,
  Button,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";

import { LegalCaseStates } from "../../contexts/legalCaseStateConstants";
import { useStyles } from "../../utils";
import {
  createLegalCaseFile,
  getLegalCaseFiles,
  createCaseUpdate,
  updateLegalCase,
  getCaseUpdates,
  getLegalCase,
  updateNote,
  updateMeeting,
  deleteCaseUpdate,
  getLogs,
} from "../../api";
import { ILegalCase, SnackbarState, ILegalCaseFile, ILog } from "../../types";
import i18n from "../../i18n";
import UpdateDialogTabs from "./updateDialogTabs";
import SnackbarAlert from "../general/snackBar";
import MoreMenu from "../moreMenu";

type Props = {
  open: boolean;
  legalCase: ILegalCase;
  setOpen: (open: boolean) => void;
  setStatus: (status: string) => void;
  setLegalCase: (legalCase: ILegalCase) => void;
  legalCaseFiles?: ILegalCaseFile[];
  setLegalCaseFiles: (legalCaseFiles: ILegalCaseFile[]) => void;
  setCaseUpdates: (caseUpdates: any) => void;
  editView?: boolean;
  selectedUpdate?: any;
  setCaseHistory: (caseHistory: ILog[]) => void;
};

const UpdateDialog = (props: Props) => {
  const history = useHistory();
  const classes = useStyles();
  const [status, setStatus] = useState<string>(props.legalCase.state);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [note, setNote] = useState<any>({
    title: "",
    content: "",
  });
  const [attachedFileData, setAttachedFileData] = useState<any>({
    file: null,
    description: "",
  });
  const [meeting, setMeeting] = useState<any>({
    meeting_type: "",
    location: "",
    notes: "",
    meeting_date: new Date().toISOString().slice(0, 16),
    advice_was_offered: "",
    advice_offered: "",
  });
  const [fileTabFileName, setFileTabFileName] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [updateError, setUpdateError] = useState<string>("");
  const [tabValue, setTabValue] = useState<number>(0);
  const [updateFileId, setUpdateFileId] = useState<null | number>(null);
  const [updateId, setUpdateId] = useState<null | number>(null);
  const [updatePrimaryId, setUpdatePrimaryId] = useState<null | number>(null);
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);

  useEffect(() => {
    function setUpdateVals() {
      if (props.selectedUpdate && props.selectedUpdate.note !== null) {
        setNote({
          title: props.selectedUpdate.note.title,
          content: props.selectedUpdate.note.content,
        });
        setMeeting({
          meeting_type: "",
          location: "",
          notes: "",
          meeting_date: new Date().toISOString().slice(0, 16),
          advice_was_offered: "",
          advice_offered: "",
        });
        props.selectedUpdate.note.file !== null
          ? setUpdateFileId(props.selectedUpdate.note.file)
          : setUpdateFileId(null);
        setUpdateId(props.selectedUpdate.note.id);
        setUpdatePrimaryId(props.selectedUpdate.id);
        setTabValue(0);
      } else if (
        props.selectedUpdate &&
        props.selectedUpdate.meeting !== null
      ) {
        setMeeting({
          meeting_type: props.selectedUpdate.meeting.meeting_type,
          location: props.selectedUpdate.meeting.location,
          notes: props.selectedUpdate.meeting.notes,
          meeting_date: props.selectedUpdate.meeting.meeting_date,
          advice_was_offered: props.selectedUpdate.meeting.advice_was_offered,
          advice_offered: props.selectedUpdate.meeting.advice_offered,
        });
        setNote({
          title: "",
          content: "",
        });
        props.selectedUpdate.meeting.file !== null
          ? setUpdateFileId(props.selectedUpdate.meeting.file)
          : setUpdateFileId(null);
        setUpdateId(props.selectedUpdate.meeting.id);
        setUpdatePrimaryId(props.selectedUpdate.id);
        setTabValue(1);
      } else if (props.selectedUpdate && props.selectedUpdate.files > 0) {
        setUpdateFileId(+props.selectedUpdate.files.join());
        setMeeting({
          meeting_type: "",
          location: "",
          notes: "",
          meeting_date: new Date().toISOString().slice(0, 16),
          advice_was_offered: "",
          advice_offered: "",
        });
        setNote({
          title: "",
          content: "",
        });
        setTabValue(2);
        setUpdateId(props.selectedUpdate.id);
        setUpdatePrimaryId(props.selectedUpdate.id);
      }
    }
    if (props.editView) {
      setUpdateVals();
    }
  }, [props.selectedUpdate, props.editView, tabValue]);

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
    props.setOpen(false);
    history.push(`/cases/${props.legalCase.id}/updates`);
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

    const createNote = async (fileId: number | null) => {
      setIsLoading(true);
      await createCaseUpdate({
        note: {
          title: note.title,
          content: note.content,
          file: fileId,
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
            updateHistory();
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

    const createMeeting = async (fileId: number | null) => {
      setIsLoading(true);
      await createCaseUpdate({
        meeting: {
          meeting_type: meeting.meeting_type,
          location: meeting.location,
          notes: meeting.notes,
          meeting_date: meeting.meeting_date,
          file: fileId,
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
          } else if (typeof res.meeting.meeting_date === "object") {
            setUpdateError("meeting_date");
            return false;
          } else {
            setUpdateError("");
          }

          if (res.id) {
            dialogClose();
            refreshUpdates();
            updateHistory();
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

    const createFile = async (fileId: number | null) => {
      setIsLoading(true);
      await createCaseUpdate({
        files: [fileId],
        legal_case: props.legalCase.id,
      })
        .then((res: any) => {
          setIsLoading(false);

          if (res.id) {
            dialogClose();
            refreshUpdates();
            updateHistory();
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

  const updateNoteUpdate = async () => {
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
            editNote(res.id);
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

    const editNote = async (fileId: number | null) => {
      setIsLoading(true);
      await updateNote({
        ...note,
        id: updateId,
        file: fileId,
      })
        .then((res: any) => {
          setIsLoading(false);

          if (typeof res.title === "object") {
            setUpdateError("title");
            return false;
          } else if (typeof res.content === "object") {
            setUpdateError("content");
            return false;
          } else {
            setUpdateError("");
          }
          if (res.id) {
            dialogClose();
            refreshUpdates();
            updateHistory();
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
        await editNote(updateFileId);
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

  const updateMeetingUpdate = async () => {
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
            editMeeting(res.id);
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

    const editMeeting = async (fileId: number | null) => {
      setIsLoading(true);
      await updateMeeting({
        ...meeting,
        id: updateId,
        file: fileId,
      })
        .then((res: any) => {
          setIsLoading(false);

          if (typeof res.meeting_type === "object") {
            setUpdateError("meeting_type");
            return false;
          } else if (typeof res.location === "object") {
            setUpdateError("location");
            return false;
          } else if (typeof res.notes === "object") {
            setUpdateError("notes");
            return false;
          } else if (typeof res.meeting_date === "object") {
            setUpdateError("meeting_date");
            return false;
          } else {
            setUpdateError("");
          }

          if (res.id) {
            dialogClose();
            refreshUpdates();
            updateHistory();
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
        await editMeeting(updateFileId);
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

  const destroyUpdate = async () => {
    try {
      setDeleteLoader(true);
      if (
        window.confirm(i18n.t("Are you sure you want to delete this update?"))
      ) {
        await deleteCaseUpdate(updatePrimaryId as number);
        setShowSnackbar({
          open: true,
          message: "Case update deleted",
          severity: "success",
        });
        dialogClose();
        refreshUpdates();
        updateHistory();
      }
      setDeleteLoader(false);
    } catch (e) {
      setDeleteLoader(false);
      setShowSnackbar({
        open: true,
        message: "Case update delete failed",
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
        updateHistory();
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
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

  const updateHistory = async () => {
    const historyData = await getLogs(props.legalCase?.id!, "LegalCase");
    props.setCaseHistory(historyData);
  };

  const submitHandler = () => {
    if (!props.editView && tabValue === 0) {
      submitNoteUpdate();
    } else if (!props.editView && tabValue === 1) {
      submitMeetingUpdate();
    } else if (!props.editView && tabValue === 2) {
      submitFileUpdate();
    }

    if (props.editView && tabValue === 0) {
      updateNoteUpdate();
    } else if (props.editView && tabValue === 1) {
      updateMeetingUpdate();
    }
    statusChanged && statusPatch();
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={dialogClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            height: "90vh",
          },
        }}
      >
        <DialogTitle className={classes.dialogTitle}>
          <Box display="flex" alignItems="center">
          <Box flexGrow="1">
              {props.editView ? i18n.t("Edit update") : i18n.t("New update")}
            </Box>
            {props.editView && (
              <Box>
                <MoreMenu>
                  <MenuItem
                    style={{ position: "relative" }}
                    disabled={deleteLoader}
                    onClick={() => destroyUpdate()}
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{i18n.t("Delete update")}</ListItemText>
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
              </Box>
            )}
            <Box sx={{width: "50px"}}>
              <IconButton
                className={classes.closeButton}
                size={"medium"}
                onClick={dialogClose}
              >
                <CloseIcon className={classes.closeButtonIcon} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <Box style={{ margin: 20 }}>
          <UpdateDialogTabs
            onFileChange={onFileChange}
            note={note}
            setNote={setNote}
            meeting={meeting}
            setMeeting={setMeeting}
            progress={progress}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            fileTabFileName={fileTabFileName}
            setFileTabFileName={setFileTabFileName}
            tabValue={tabValue}
            setTabValue={setTabValue}
            updateError={updateError}
            editView={props.editView}
            legalCaseFiles={props.legalCaseFiles ? props.legalCaseFiles : []}
            updateFileId={updateFileId}
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
              disableElevation={true}
              fullWidth
              color="primary"
              variant="contained"
              className={classes.dialogSubmit}
              onClick={() => submitHandler()}
              disabled={isLoading || (props.editView && tabValue === 2)}
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
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </>
  );
};

export default UpdateDialog;
