import { useEffect, useState, useRef } from "react";
import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  FormHelperText,
  Button,
} from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import UploadIcon from "@mui/icons-material/Upload";

import i18n from "../../i18n";
import { IMeeting, LocationState } from "../../types";
import { useStyles } from "../../utils";

type Props = {
  meeting?: IMeeting;
  readOnly: boolean;
  changed?: boolean;
  setChanged?: any;
  locationError?: boolean;
  notesError?: boolean;
  meetingTypeError?: boolean;
  showUploadButton: boolean;
  onFileChange?: (event: any, fileDescription: string) => Promise<void>;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [fileDescription, setFileDescription] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const [showSnackbar, setShowSnackbar] = useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [meeting, setMeeting] = useState<IMeeting>({
    location: "",
    meeting_date: new Date().toISOString().slice(0, 16),
    meeting_type: "",
    legal_case: 0,
    notes: "",
    name: "",
  });

  useEffect(() => {
    if (props.meeting) {
      setMeeting(props.meeting);
    }
  }, [props.meeting]);

  const showOpenFileDialog = () => {
    if (!uploadFileRef.current) throw Error("uploadFileRef is not assigned");
    uploadFileRef.current.click();
  };

  const dialogClose = () => {
    setOpen(false);
    setFileDescription("");
  };

  return (
    <div>
      <Grid
        className={classes.pageBar}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Grid
          item
          xs={props.showUploadButton ? 9 : 12}
          md={props.showUploadButton ? 9 : 12}
        >
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="name"
              shrink={true}
            >
              {i18n.t("Description")}:
            </InputLabel>
            <Input
              id="name"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  name: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        {props.showUploadButton && (
          <Grid item className={classes.zeroWidthOnMobile} xs={3} md={3}>
            <input
              ref={uploadFileRef}
              type="file"
              onChange={(event) =>
                props.onFileChange
                  ? props.onFileChange(event, fileDescription)
                  : null
              }
              hidden
            />
            <Button
              color="primary"
              variant="contained"
              className={classes.meetingFileButton}
              startIcon={<UploadIcon />}
              style={{ textTransform: "none" }}
              onClick={() => setOpen(true)}
            >
              {i18n.t("Upload file")}
            </Button>
            <Dialog open={open} onClose={dialogClose} fullWidth maxWidth="sm">
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
        )}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="location"
              shrink={true}
            >
              {i18n.t("Location")}:
            </InputLabel>
            <Input
              id="location"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  location: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
            {props.locationError && (
              <FormHelperText error id="location-error">
                Location cannot be empty
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="meeting_type"
              shrink={true}
            >
              {i18n.t("Meeting type")}:
            </InputLabel>
            <Input
              id="meeting_type"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.meeting_type}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  meeting_type: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
            {props.meetingTypeError && (
              <FormHelperText error id="meeting-type-error">
                Meeting type cannot be empty
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="meeting_date"
              shrink={true}
            >
              {i18n.t("Meeting date")}:
            </InputLabel>
            <Input
              id="meeting_date"
              type="datetime-local"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={new Date(meeting.meeting_date || 0)
                .toISOString()
                .slice(0, 16)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  meeting_date: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="notes"
              shrink={true}
            >
              {i18n.t("Notes")}:{" "}
              {props.notesError && (
                <FormHelperText style={{ fontSize: 16 }} error id="notes-error">
                  Note cannot be empty
                </FormHelperText>
              )}
            </InputLabel>
            <Input
              id="notes"
              multiline
              rows={25}
              style={props.notesError ? { marginTop: 40 } : {}}
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  notes: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
};

export default Component;
