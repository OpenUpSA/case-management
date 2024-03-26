import React, { useEffect } from "react";
import { useStyles, VisuallyHiddenInput } from "../../utils";
import SearchIcon from "@material-ui/icons/Search";
import UploadIcon from "@mui/icons-material/Upload";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import LinkIcon from "@mui/icons-material/Link";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";

import { ILegalCase, ILegalCaseFile, ILog, SnackbarState } from "../../types";
import UpdateDialog from "./updateDialog";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import {
  getLegalCaseFiles,
  deleteLegalCaseFile,
  renameLegalCaseFile,
  createLegalCaseFile,
  getCaseUpdates,
} from "../../api";
import {
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Button,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import i18n from "../../i18n";
import SnackbarAlert from "../general/snackBar";

type Props = {
  legalCase: ILegalCase;
  legalCaseFiles: ILegalCaseFile[];
  setStatus: (status: string) => void;
  setCaseUpdates: (caseUpdates: any) => void;
  setLegalCase: (legalCase: ILegalCase) => void;
  setLegalCaseFiles: (files: ILegalCaseFile[]) => void;
  setCaseHistory: (caseHistory: ILog[]) => void;
};

export default function CaseFileTab(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [renameDialog, setRenameDialog] = React.useState<boolean>(false);
  const [renameDialogInput, setRenameDialogInput] = React.useState<any>({
    description: "",
    id: 0,
    legal_case: 0,
  });
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [triggerClick, setTriggerClick] = React.useState({
    show: false,
    val: 0,
  });

  const refreshUpdates = async () => {
    const dataLegalCaseFiles = await getLegalCaseFiles(
      props.legalCase.id as number
    );
    props.setLegalCaseFiles(dataLegalCaseFiles);
    const updates = await getCaseUpdates(props.legalCase.id as number);
    props.setCaseUpdates(updates);
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

  const renameFile = async (file: ILegalCaseFile) => {
    renameLegalCaseFile(file)
      .then((res: any) => {
        if (res.id) {
          setShowSnackbar({
            open: true,
            message: "File renamed successfully",
            severity: "success",
          });
          setTriggerClick({ show: false, val: 0 });
          setIsLoading(true);
          getLegalCaseFiles(res.legal_case)
            .then((res) => {
              setIsLoading(false);
              props.setLegalCaseFiles(res);
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

  const deleteFile = async (id: number) => {
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
          getLegalCaseFiles(props.legalCase.id)
            .then((res) => {
              setIsLoading(false);
              props.setLegalCaseFiles(res);
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
            {props.legalCaseFiles?.length} {i18n.t("Case files")}
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
                createLegalCaseFile(
                  props.legalCase.id,
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

          <UpdateDialog
            open={open}
            setOpen={setOpen}
            setStatus={props.setStatus}
            legalCase={props.legalCase}
            setLegalCase={props.setLegalCase}
            setLegalCaseFiles={props.setLegalCaseFiles}
            setCaseUpdates={props.setCaseUpdates}
            setCaseHistory={props.setCaseHistory}
          />
        </Grid>
      </Grid>
      <Grid
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
      <InputLabel
        className={classes.caseFileLabel}
        style={{ paddingTop: "20px" }}
      >
        {i18n.t("All case files")}:
      </InputLabel>
      {props.legalCaseFiles && props.legalCaseFiles.length > 0 ? (
        <div>
          {props.legalCaseFiles
            .slice(0)
            .reverse()
            .map((legalCaseFile) => (
              <Grid
                container
                key={legalCaseFile.id}
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
                    <a
                      href={legalCaseFile.upload}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {legalCaseFile.description}
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
                    {format(
                      new Date(
                        legalCaseFile.updated_at || new Date().toISOString()
                      ),
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
                      setTriggerClick({ show: true, val: legalCaseFile?.id! });
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  {triggerClick.show &&
                    triggerClick.val === legalCaseFile?.id && (
                      <ClickAwayListener
                        onClickAway={() =>
                          setTriggerClick({ show: false, val: 0 })
                        }
                      >
                        <div className={classes.fileMoreMenu}>
                          <Button
                            style={{
                              position: "relative",
                              textTransform: "capitalize",
                            }}
                            disabled={false}
                            onClick={() => {
                              setRenameDialogInput({
                                description: legalCaseFile!.description!,
                                id: legalCaseFile!.id!,
                                legal_case: legalCaseFile!.legal_case!,
                              });
                              setRenameDialog(true);
                            }}
                          >
                            <ListItemIcon>
                              <EditIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{i18n.t("Rename file")}</ListItemText>
                          </Button>
                          <Dialog
                            open={renameDialog}
                            onClose={() => setRenameDialog(false)}
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
                                value={renameDialogInput.description}
                                onChange={(
                                  e: React.ChangeEvent<{ value: any }>
                                ) => {
                                  setRenameDialogInput({
                                    ...renameDialogInput,
                                    description: e.target.value,
                                  });
                                }}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setRenameDialog(false)}>
                                Cancel
                              </Button>
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                  renameFile(renameDialogInput);
                                  setRenameDialog(false);
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
                            onClick={() => deleteFile(legalCaseFile!.id!)}
                          >
                            <ListItemIcon>
                              <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{i18n.t("Delete file")}</ListItemText>
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
                        </div>
                      </ClickAwayListener>
                    )}
                </Grid>
              </Grid>
            ))}
        </div>
      ) : (
        <Grid container className={classes.caseFiles}>
          <Grid item className={classes.caseFilesItem} style={{ flexGrow: 1 }}>
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
