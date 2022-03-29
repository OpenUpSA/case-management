import React, { useRef } from "react";
import { useStyles } from "../../utils";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/Upload";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import WorkIcon from "@mui/icons-material/Work";
import LinkIcon from "@mui/icons-material/Link";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { ILegalCase, ILegalCaseFile, LocationState } from "../../types";
import {
  getLegalCaseFiles,
  createLegalCaseFile,
  deleteLegalCaseFile,
  renameLegalCaseFile,
} from "../../api";
import { format } from "date-fns";
import {
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import i18n from "../../i18n";
import ProgressBar from "../general/progressBar";
import SnackbarAlert from "../../components/general/snackBar";

type Props = {
  legalCase: ILegalCase;
  legalCaseFiles: ILegalCaseFile[] | undefined;
  setLegalCaseFiles: React.Dispatch<
    React.SetStateAction<ILegalCaseFile[] | undefined>
  >;
};

export default function CaseFileTab(props: Props) {
  const classes = useStyles();
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const [fileDescription, setFileDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [renameDialog, setRenameDialog] = React.useState<boolean>(false);
  const [renameDialogInput, setRenameDialogInput] =
    React.useState<ILegalCaseFile>({
      description: "",
      id: 0,
      legal_case: 0,
      upload: "",
    });
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [triggerClick, setTriggerClick] = React.useState({
    show: false,
    val: 0,
  });

  React.useEffect(() => {
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

  const onFileChange = async (event: any) => {
    createLegalCaseFile(
      props.legalCase.id,
      event.target.files[0],
      fileDescription,
      (e: any) => {
        const { loaded, total } = e;
        const percent = Math.floor((loaded * 100) / total);

        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => {
            setProgress(0);
            setShowSnackbar({
              open: true,
              message: "File upload successful",
              severity: "success",
            });
          }, 1000);
        }
      }
    )
      .then((res: any) => {
        setFileDescription("");
        if (res.legal_case) {
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
        }
      })
      .catch(() => {
        setShowSnackbar({
          open: true,
          message: "File upload failed",
          severity: "error",
        });
      });
  };
  const showOpenFileDialog = () => {
    if (!uploadFileRef.current) throw Error("uploadFileRef is not assigned");
    uploadFileRef.current.click();
  };

  const dialogClose = () => {
    setOpen(false);
    setFileDescription("");
  };

  const renameFile = async (file: ILegalCaseFile) => {
    renameLegalCaseFile(file)
      .then((res:any) => {
        if (res.status === 200) {
          setShowSnackbar({
            open: true,
            message: "File renamed successfully",
            severity: "success",
          });
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
        }else{
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
            {props.legalCaseFiles?.length} {i18n.t("Case Files")}
          </strong>
        </Grid>
        <Grid item>
          <InputLabel
            className={classes.inputLabel}
            htmlFor="sort_table"
            shrink={true}
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
        <Grid item className={classes.zeroWidthOnMobile}>
          <input
            ref={uploadFileRef}
            type="file"
            onChange={onFileChange}
            hidden
          />
          <Button
            className={classes.canBeFab}
            color="primary"   
            variant="contained"
            startIcon={<UploadIcon />}
            style={{ textTransform: "none" }}
            onClick={() => setOpen(true)}
          >
            {i18n.t("Upload file")}
          </Button>
          <Dialog open={open} onClose={dialogClose} fullWidth maxWidth="sm">
            <DialogTitle>Upload file</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="File description"
                type="text"
                fullWidth
                variant="standard"
                value={fileDescription}
                onChange={(e: React.ChangeEvent<{ value: any }>) => {
                  setFileDescription(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={dialogClose}>Cancel</Button>
              <Button
                color="primary"
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => {
                  showOpenFileDialog();
                  setOpen(false);
                }}
              >
                {i18n.t("Choose file")}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <Grid
        xs={12}
        className={classes.containerMarginBottom}
        style={{ display: "none" }}
      >
        <Input
          id="table_search"
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
      {progress > 0 && <ProgressBar progress={progress} />}

      <InputLabel
        className={classes.caseFileLabel}
        style={{ paddingTop: "20px" }}
      >
        All case files:{" "}
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
                  className={classes.caseFilesItem}
                  style={{ flexGrow: 1 }}
                >
                  <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
                  <Typography>
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
                <Grid item className={classes.caseFilesItem}>
                  <CheckIcon style={{ color: "#3dd997", marginLeft: 15 }} />
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
                  {triggerClick.show && triggerClick.val === legalCaseFile?.id && (
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
                              upload: legalCaseFile!.upload!,
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
                              id="table_search"
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
        <Grid container justify="center">
          <CircularProgress style={{ position: "absolute", left: "50%" }} />
        </Grid>
      )}
      <InputLabel className={classes.caseFileLabel}>
        Recommended case files:{" "}
      </InputLabel>
      <Grid container direction="column">
        <Grid item className={classes.caseFiles}>
          <MeetingRoomIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice to vacate</Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice of motion</Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <GavelIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Eviction order</Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <ReceiptLongIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>
            Proof of rental payment
          </Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <HistoryEduIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Lease agreement</Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <WorkIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>
            Record of attempt to find legal council
          </Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
      </Grid>
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
