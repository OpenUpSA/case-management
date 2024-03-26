import React, { useContext, useEffect } from "react";
import { useStyles, VisuallyHiddenInput } from "../../utils";
import SearchIcon from "@material-ui/icons/Search";
import UploadIcon from "@mui/icons-material/Upload";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import LinkIcon from "@mui/icons-material/Link";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";

import {
  IClient,
  IClientFile,
  SnackbarState,
  ILegalCaseFile,
  ILegalCase,
  ICaseType,
} from "../../types";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import {
  getClientFiles,
  deleteClientFile,
  deleteLegalCaseFile,
  renameClientFile,
  renameLegalCaseFile,
  createClientFile,
  getLegalCases,
  getLegalCaseFiles,
} from "../../api";
import {
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Button,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import i18n from "../../i18n";
import SnackbarAlert from "../general/snackBar";
import { CaseTypesContext } from "../../contexts/caseTypesContext";

type Props = {
  client: IClient;
};

export default function ClientFileTab(props: Props) {
  const [contextCaseTypes] = useContext(CaseTypesContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [clientFileRenameDialog, setClientFileRenameDialog] =
    React.useState<boolean>(false);
  const [clientFileRenameDialogInput, setClientFileRenameDialogInput] =
    React.useState<any>({
      description: "",
      id: 0,
    });
  const [legalCaseFileRenameDialog, setLegalCaseFileRenameDialog] =
    React.useState<boolean>(false);
  const [legalCaseFileRenameDialogInput, setLegalCaseFileRenameDialogInput] =
    React.useState<any>({
      description: "",
      id: 0,
    });
  const [allFiles, setAllFiles] = React.useState<
    (IClientFile | ILegalCaseFile)[]
  >([]);
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [triggerClick, setTriggerClick] = React.useState({
    show: false,
    val: "",
  });

  const refreshUpdates = async () => {
    setIsLoading(true);
    const clientId = props.client.id;

    const dataClientFiles = await getClientFiles(clientId);
    const dataLegalCases = await getLegalCases(clientId);

    setLegalCases(dataLegalCases);

    let dataLegalCaseFiles: ILegalCaseFile[] = [];
    for (const legalCase of dataLegalCases) {
      const legalCaseFiles = await getLegalCaseFiles(legalCase.id);
      dataLegalCaseFiles = dataLegalCaseFiles.concat(legalCaseFiles);
    }

    let dataAllFiles = [dataClientFiles, dataLegalCaseFiles].flat();
    // Combined id
    for (const file of dataAllFiles) {
      file.combinedId =
        ("client" in file ? "clientFile-" : "legalCaseFile-") + file.id;
    }
    setAllFiles(dataAllFiles);
    setIsLoading(false);
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
      refreshUpdates();
    }
    fetchData();
  });

  const clientFileRename = async (file: IClientFile) => {
    renameClientFile(file)
      .then((res: any) => {
        if (res.id) {
          setShowSnackbar({
            open: true,
            message: "File renamed successfully",
            severity: "success",
          });
          setTriggerClick({ show: false, val: file.combinedId || "" });
          setIsLoading(true);
          getClientFiles(res.client)
            .then((res) => {
              setIsLoading(false);
              refreshUpdates();
            })
            .catch((e) => {
              setIsLoading(false);
              setShowSnackbar({
                open: true,
                message: e.message,
                severity: "error",
              });
            });
        } else {
          setShowSnackbar({
            open: true,
            message: "File rename failed",
            severity: "error",
          });
        }
      })
      .catch(() => {
        setShowSnackbar({
          open: true,
          message: "File rename failed",
          severity: "error",
        });
      });
  };

  const clientFileDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setDeleteLoader(true);
      deleteClientFile(id)
        .then(() => {
          setDeleteLoader(false);
          setShowSnackbar({
            open: true,
            message: "File delete successful",
            severity: "success",
          });
          setIsLoading(true);
          getClientFiles(props.client.id)
            .then((res) => {
              setIsLoading(false);
              refreshUpdates();
            })
            .catch((e) => {
              setIsLoading(false);
              setShowSnackbar({
                open: true,
                message: e.message,
                severity: "error",
              });
            });
        })
        .catch((err: any) => {
          setDeleteLoader(false);
          setShowSnackbar({
            open: true,
            message: "File delete failed",
            severity: "error",
          });
        });
    } else {
      return;
    }
  };

  const legalCaseFileRename = async (file: ILegalCaseFile) => {
    renameLegalCaseFile(file)
      .then((res: any) => {
        if (res.id) {
          setShowSnackbar({
            open: true,
            message: "File renamed successfully",
            severity: "success",
          });
          setTriggerClick({ show: false, val: file.combinedId || "" });
          setIsLoading(true);
          getLegalCaseFiles(res.client)
            .then((res) => {
              setIsLoading(false);
              refreshUpdates();
            })
            .catch((e) => {
              setIsLoading(false);
              setShowSnackbar({
                open: true,
                message: e.message,
                severity: "error",
              });
            });
        } else {
          setShowSnackbar({
            open: true,
            message: "File rename failed",
            severity: "error",
          });
        }
      })
      .catch(() => {
        setShowSnackbar({
          open: true,
          message: "File rename failed",
          severity: "error",
        });
      });
  };

  const legalCaseFileDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setDeleteLoader(true);
      deleteLegalCaseFile(id)
        .then(() => {
          setDeleteLoader(false);
          setShowSnackbar({
            open: true,
            message: "File delete successful",
            severity: "success",
          });
          setIsLoading(true);
          getLegalCaseFiles(props.client.id)
            .then((res) => {
              setIsLoading(false);
              refreshUpdates();
            })
            .catch((e) => {
              setIsLoading(false);
              setShowSnackbar({
                open: true,
                message: e.message,
                severity: "error",
              });
            });
        })
        .catch((err: any) => {
          setDeleteLoader(false);
          setShowSnackbar({
            open: true,
            message: "File delete failed",
            severity: "error",
          });
        });
    } else {
      return;
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        className={classes.containerMarginBottom}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <strong>
            {allFiles?.length} {i18n.t("files")}
          </strong>
        </Grid>
        <Grid item>
          <Button
            disableElevation={true}
            component="label"
            startIcon={<UploadIcon />}
            className={classes.bigCanBeFab}
            fullWidth
            color="primary"
            variant="contained"
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={(e: any) => {
                createClientFile(
                  props.client.id,
                  e.target.files[0],
                  e.target.files[0].name,
                  (e: any) => {
                    const { loaded, total } = e;
                    const percent = Math.floor((loaded * 100) / total);
                    setShowSnackbar({
                      open: true,
                      message: `Uploading file: ${percent}%`,
                      severity: "info",
                    });
                    if (percent === 100) {
                      setTimeout(() => {
                        refreshUpdates();
                      }, 1000);

                      setShowSnackbar({
                        open: true,
                        message: "File update successful",
                        severity: "success",
                      });
                    }
                  }
                )
                  .then((res: any) => {
                    setIsLoading(false);
                  })
                  .catch((err: any) => {
                    setIsLoading(false);
                    setShowSnackbar({
                      open: true,
                      message: "File upload failed",
                      severity: "error",
                    });
                  });
              }}
            />
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.containerMarginBottom}
        style={{ display: "none" }}
      >
        <Input
          id="table_search11111111"
          fullWidth
          placeholder={i18n.t("Enter a meeting location, type, or note...")}
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          }
          disableUnderline={true}
          className={classes.textField}
          aria-describedby="my-helper-text"
          value={"Enter a meeting location, type, or note..."}
        />
      </Grid>
      {allFiles && allFiles.length > 0 ? (
        <div>
          {allFiles
            .slice(0)
            .reverse()
            .map((file) => (
              <Grid
                container
                key={file.combinedId}
                className={classes.caseFiles}
              >
                <Grid
                  item
                  className={`${classes.caseFilesItem} ${classes.noOverflow}`}
                  style={{ flexGrow: 1 }}
                >
                  <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
                  <Typography
                    className={classes.noOverflow}
                    style={{ maxWidth: "70%" }}
                  >
                    <a href={file.upload} target="_blank" rel="noreferrer">
                      {file.description}
                    </a>
                  </Typography>
                </Grid>
                <Grid item className={classes.caseFilesItem}>
                  <Divider
                    sx={{ marginRight: 2 }}
                    orientation="vertical"
                    variant="middle"
                    flexItem
                  />
                  <p>
                    {"legal_case" in file && (
                      <>
                        {contextCaseTypes
                          .filter((caseType: ICaseType) =>
                            legalCases
                              ?.filter(
                                (legalCase) => legalCase.id === file.legal_case
                              )[0]
                              .case_types.includes(caseType.id)
                          )
                          .map((caseType: ICaseType) => caseType.title)
                          .join(", ")}{" "}
                        (
                        {
                          legalCases?.filter(
                            (legalCase) => legalCase.id === file.legal_case
                          )[0].case_number
                        }
                        )
                      </>
                    )}
                  </p>
                </Grid>
                <Grid item className={classes.caseFilesItem}>
                  <Divider
                    sx={{ marginLeft: 2, marginRight: 2 }}
                    orientation="vertical"
                    variant="middle"
                    flexItem
                  />
                  <p>
                    {format(
                      new Date(file.updated_at || new Date().toISOString()),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </Grid>
                <Grid
                  item
                  className={classes.caseFilesItem}
                  style={{ position: "relative" }}
                >
                  <IconButton
                    onClick={() => {
                      setTriggerClick({ show: true, val: file?.combinedId! });
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  {triggerClick.show &&
                    triggerClick.val === file?.combinedId && (
                      <ClickAwayListener
                        onClickAway={() =>
                          setTriggerClick({ show: false, val: "" })
                        }
                      >
                        <div className={classes.fileMoreMenu}>
                          {"client" in file ? (
                            <>
                              <Button
                                style={{
                                  position: "relative",
                                  textTransform: "capitalize",
                                }}
                                disabled={false}
                                onClick={() => {
                                  setClientFileRenameDialogInput({
                                    description: file!.description!,
                                    id: file!.id!,
                                    client: file!.client!,
                                  });
                                  setClientFileRenameDialog(true);
                                }}
                              >
                                <ListItemIcon>
                                  <EditIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                  {i18n.t("Rename file")}
                                </ListItemText>
                              </Button>

                              <Dialog
                                open={clientFileRenameDialog}
                                onClose={() => setClientFileRenameDialog(false)}
                                fullWidth
                                maxWidth="sm"
                              >
                                <DialogTitle>Rename file</DialogTitle>
                                <DialogContent>
                                  <Input
                                                            fullWidth
                                    disableUnderline={true}
                                    className={classes.textField}
                                    aria-describedby="Rename file"
                                    value={
                                      clientFileRenameDialogInput.description
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<{ value: any }>
                                    ) => {
                                      setClientFileRenameDialogInput({
                                        ...clientFileRenameDialogInput,
                                        description: e.target.value,
                                      });
                                    }}
                                  />
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() =>
                                      setClientFileRenameDialog(false)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    disableElevation={true}
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                      clientFileRename(
                                        clientFileRenameDialogInput
                                      );
                                      setClientFileRenameDialog(false);
                                    }}
                                  >
                                    {i18n.t("Submit")}
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <Button
                                style={{
                                  position: "relative",
                                  textTransform: "capitalize",
                                }}
                                disabled={deleteLoader}
                                onClick={() => clientFileDelete(file!.id!)}
                              >
                                <ListItemIcon>
                                  <DeleteIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                  {i18n.t("Delete file")}
                                </ListItemText>
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
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                style={{
                                  position: "relative",
                                  textTransform: "capitalize",
                                }}
                                disabled={false}
                                onClick={() => {
                                  setLegalCaseFileRenameDialogInput({
                                    description: file!.description!,
                                    id: file!.id!,
                                    legal_case: file!.legal_case!,
                                  });
                                  setLegalCaseFileRenameDialog(true);
                                }}
                              >
                                <ListItemIcon>
                                  <EditIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                  {i18n.t("Rename file")}
                                </ListItemText>
                              </Button>

                              <Dialog
                                open={legalCaseFileRenameDialog}
                                onClose={() =>
                                  setLegalCaseFileRenameDialog(false)
                                }
                                fullWidth
                                maxWidth="sm"
                              >
                                <DialogTitle>Rename file</DialogTitle>
                                <DialogContent>
                                  <Input
                                                            fullWidth
                                    disableUnderline={true}
                                    className={classes.textField}
                                    aria-describedby="Rename file"
                                    value={
                                      legalCaseFileRenameDialogInput.description
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<{ value: any }>
                                    ) => {
                                      setLegalCaseFileRenameDialogInput({
                                        ...legalCaseFileRenameDialogInput,
                                        description: e.target.value,
                                      });
                                    }}
                                  />
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() =>
                                      setLegalCaseFileRenameDialog(false)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    disableElevation={true}
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                      legalCaseFileRename(
                                        legalCaseFileRenameDialogInput
                                      );
                                      setLegalCaseFileRenameDialog(false);
                                    }}
                                  >
                                    {i18n.t("Submit")}
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <Button
                                style={{
                                  position: "relative",
                                  textTransform: "capitalize",
                                }}
                                disabled={deleteLoader}
                                onClick={() => legalCaseFileDelete(file!.id!)}
                              >
                                <ListItemIcon>
                                  <DeleteIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                  {i18n.t("Delete file")}
                                </ListItemText>
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
                              </Button>
                            </>
                          )}
                        </div>
                      </ClickAwayListener>
                    )}
                </Grid>
              </Grid>
            ))}
        </div>
      ) : (
        !isLoading && (
          <Grid container className={classes.caseFiles}>
            <Grid
              item
              className={classes.caseFilesItem}
              style={{ flexGrow: 1 }}
            >
              <WorkIcon style={{ margin: "0px 15px 0px 10px" }} />
              <Typography>{i18n.t("Upload a file above")}</Typography>
            </Grid>
            <Grid item className={classes.caseFilesItem}>
              <LinkIcon style={{ visibility: "hidden", color: "#3dd997" }} />
              <IconButton>
                <MoreVertIcon sx={{ color: "#000000" }} />
              </IconButton>
            </Grid>
          </Grid>
        )
      )}
      {isLoading && (
        <Grid container justifyContent="center">
          <CircularProgress style={{ position: "absolute", left: "50%" }} />
        </Grid>
      )}

      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </>
  );
}
