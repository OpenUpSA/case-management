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
import TextField from "@mui/material/TextField";
import { format } from "date-fns";

import { ILegalCase, ILegalCaseFile, LocationState } from "../../types";
import { getLegalCaseFiles, createLegalCaseFile } from "../../api";

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
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
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
          getLegalCaseFiles(res.legal_case).then((res) => {
            props.setLegalCaseFiles(res);
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
                  <LinkIcon
                    style={{ visibility: "hidden", color: "#3dd997" }}
                  />
                  <IconButton>
                    <MoreVertIcon sx={{ color: "#000000" }} />
                  </IconButton>
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
      <InputLabel className={classes.caseFileLabel}>
        Recommended case files:{" "}
      </InputLabel>
      <Grid container direction="column">
        <Grid item className={classes.caseFiles}>
          <MeetingRoomIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice to vacate</Typography>
          <CheckIcon style={{ color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice of motion</Typography>
          <CheckIcon style={{ color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{ color: "#000000" }} />
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
