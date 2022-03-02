import React, { useState, useRef } from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import {
  IconButton,
  Input,
  InputLabel,
  FormHelperText,
  Grid,
} from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import i18n from "../../i18n";
import { TabPanelProps } from "../../types";
import { useStyles } from "../../utils";
import { meetingTypes } from "../../contexts/meetingTypeConstants";
import Dropzone from "react-dropzone";
import ProgressBar from "../general/progressBar";
import { BlackTooltip } from "../general/tooltip";

type Props = {
  onFileChange?: (event: any, fileDescription: string) => Promise<void>;
  note: any;
  setNote: (note: any) => void;
  meeting: any;
  setMeeting: (meeting: any) => void;
  progress: number;
  onDrop: (files: any) => void;
  fileTabFileName: string;
  setFileTabFileName: (fileTabFileName: string) => void;
  selectedFiles: any;
  setSelectedFiles: (selectedFiles: any) => void;
  setTabValue: (tabValue: number) => void;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const UpdateDialogTabs = (props: Props) => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [fileDescription, setFileDescription] = useState<string>("");
  const [stagedFileName, setStagedFileName] = useState<string>("");
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.setTabValue(newValue);
    props.setFileTabFileName("");
    props.setSelectedFiles(undefined);
  };

  const dialogClose = () => {
    setOpen(false);
    setFileDescription("");
  };

  const showOpenFileDialog = () => {
    if (!uploadFileRef.current) throw Error("uploadFileRef is not assigned");
    uploadFileRef.current.click();
  };

  return (
    <DialogContent style={{ padding: 0 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tab panels"
          classes={{ indicator: classes.noIndicator }}
        >
          <Tab
            key="caseInfo"
            className={classes.dialogTabButton}
            icon={
              <InsertDriveFileOutlinedIcon
                style={{ transform: "rotate(180deg)" }}
              />
            }
            label={<Typography>{i18n.t("Note")}</Typography>}
            {...a11yProps(0)}
          />
          <Tab
            key="meetings"
            className={classes.dialogTabButton}
            icon={<ForumOutlinedIcon />}
            label={<Typography>{i18n.t("Meeting")}</Typography>}
            {...a11yProps(1)}
          />
          <Tab
            key="caseFiles"
            className={classes.dialogTabButton}
            icon={<UploadIcon />}
            label={<Typography>{i18n.t("File upload")}</Typography>}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box className={classes.tabBox}>
          <Alert
            severity="info"
            className={classes.updateAlert}
            icon={<HelpOutlineOutlinedIcon fontSize="large" />}
          >
            <p>
              {i18n.t(
                "A note is the quickest way for a case worker to update a case with new information and ensure that anybody working on case is able to keep informed about its progress. "
              )}
              <a href="www.google.com">{i18n.t("Learn more")}</a>
            </p>
          </Alert>
          <Input
            id="title"
            disableUnderline={true}
            fullWidth
            placeholder={i18n.t("Note title")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setNote({ ...props.note, title: e.target.value });
            }}
          />
          <Input
            id="content"
            disableUnderline={true}
            fullWidth
            rows={4}
            multiline
            placeholder={i18n.t("Description of update")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setNote({ ...props.note, content: e.target.value });
            }}
          />
          {props.progress
            ? props.progress > 0 && (
                <Grid>
                  <ProgressBar progress={props.progress} />
                </Grid>
              )
            : null}
          <Box
            className={classes.centerItems}
            sx={{ justifyContent: "space-between", marginBottom: "25px" }}
          >
            <Button
              className={classes.attachmentButton}
              startIcon={<AttachmentIcon className={classes.attachmentIcon} />}
              onClick={() => setOpen(true)}
            >
              {i18n.t("Attach files to note")}
            </Button>
            {stagedFileName.length > 0 && (
              <FormHelperText id="file-selected">
                {i18n.t("New file")}:
                {stagedFileName.length > 24
                  ? stagedFileName.slice(0, 22) + "..."
                  : stagedFileName}
              </FormHelperText>
            )}

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
            <input
              ref={uploadFileRef}
              type="file"
              hidden
              onChange={(event) => {
                if (props.onFileChange) {
                  props.onFileChange(event, fileDescription);
                }
                if (event.target.files) {
                  setStagedFileName(
                    fileDescription.length > 0
                      ? fileDescription
                      : event.target.files[0].name
                  );
                }
              }}
            />
            <Typography
              className={classes.dialogLabel}
              style={{ paddingLeft: "10px" }}
            >
              {i18n.t("Uploaded files will be added to the case file")}
            </Typography>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box className={classes.tabBox}>
          <Alert
            severity="info"
            className={classes.updateAlert}
            icon={<HelpOutlineOutlinedIcon fontSize="large" />}
          >
            <p>
              {i18n.t(
                "A meeting is a clear record that an engagement between client and case officer took place. "
              )}
              <a href="www.google.com">{i18n.t("Learn more")}</a>
            </p>
          </Alert>
          <Box
            className={classes.centerItems}
            style={{
              marginBottom: "20px",
            }}
          >
            <InputLabel
              className={classes.dialogLabel}
              style={{ paddingRight: 15 }}
              htmlFor="meeting-type"
            >
              {i18n.t("Meeting type")}:
            </InputLabel>
            <Select
              id="meeting-type"
              className={classes.select}
              style={{ flexGrow: 1 }}
              disableUnderline
              input={<Input />}
              value={props.meeting.meeting_type}
              onChange={(e: SelectChangeEvent<string>) => {
                props.setMeeting({
                  ...props.meeting,
                  meeting_type: e.target.value,
                });
              }}
            >
              {meetingTypes?.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Input
            id="meeting-location"
            disableUnderline={true}
            fullWidth
            placeholder={i18n.t("Meeting location")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setMeeting({
                ...props.meeting,
                location: e.target.value,
              });
            }}
          />
          <Input
            id="meeting-note"
            disableUnderline={true}
            fullWidth
            rows={4}
            multiline
            placeholder={i18n.t("Notes from meeting")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setMeeting({
                ...props.meeting,
                notes: e.target.value,
              });
            }}
          />
          <Box
            className={classes.centerItems}
            style={{
              marginBottom: "20px",
            }}
          >
            <InputLabel
              className={classes.dialogLabel}
              style={{ paddingRight: 15, width: 100 }}
              htmlFor="Meeting-date"
            >
              {i18n.t("Meeting date")}
            </InputLabel>
            <Input
              fullWidth
              id="meeting_date"
              type="datetime-local"
              disableUnderline={true}
              className={classes.dialogInput}
              style={{ marginBottom: 0 }}
              aria-describedby="date-picker"
              value={props.meeting.meeting_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setMeeting({
                  ...props.meeting,
                  meeting_date: e.target.value,
                });
              }}
            />
          </Box>
          {props.progress
            ? props.progress > 0 && (
                <Grid>
                  <ProgressBar progress={props.progress} />
                </Grid>
              )
            : null}
          <Box
            className={classes.centerItems}
            sx={{ justifyContent: "space-between", marginBottom: "25px" }}
          >
            <Button
              className={classes.attachmentButton}
              startIcon={<AttachmentIcon className={classes.attachmentIcon} />}
              onClick={() => setOpen(true)}
            >
              {i18n.t("Attach files to meeting")}
            </Button>
            {stagedFileName.length > 0 && (
              <FormHelperText id="file-selected">
                New file:{" "}
                {stagedFileName.length > 24
                  ? stagedFileName.slice(0, 22) + "..."
                  : stagedFileName}
              </FormHelperText>
            )}

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
            <input
              ref={uploadFileRef}
              type="file"
              hidden
              onChange={(event) => {
                if (props.onFileChange) {
                  props.onFileChange(event, fileDescription);
                }
                if (event.target.files) {
                  setStagedFileName(
                    fileDescription.length > 0
                      ? fileDescription
                      : event.target.files[0].name
                  );
                }
              }}
            />
            <Typography
              className={classes.dialogLabel}
              style={{ paddingLeft: "10px" }}
            >
              {i18n.t("Uploaded files will be added to the case file")}
            </Typography>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box className={classes.tabBox}>
          <Alert
            severity="info"
            className={classes.updateAlert}
            icon={<HelpOutlineOutlinedIcon fontSize="large" />}
          >
            <p>
              {i18n.t(
                "Upload, label and add descriptions to important files to ensure that they are safely stored and always available to anyone else working on the case. "
              )}
              <a href="www.google.com">{i18n.t("Learn more")}</a>
            </p>
          </Alert>
          <Dropzone onDrop={props.onDrop} multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: classes.dropzone })}>
                <input {...getInputProps()} />
                {props.selectedFiles && props.fileTabFileName.length > 0 ? (
                  <Typography>
                    {i18n.t("Submit update to file")}: {props.fileTabFileName}
                  </Typography>
                ) : (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <FileUploadOutlinedIcon
                      style={{ fontSize: 36, color: "#b2b2b2" }}
                    />
                    <Typography>
                      {i18n.t("Drag and drop files here or")}
                    </Typography>
                    <Button className={classes.dropzoneButton}>
                      {i18n.t("click to add files from device")}
                    </Button>
                  </Stack>
                )}
              </div>
            )}
          </Dropzone>
          {props.selectedFiles !== undefined && (
            <Box style={{ width: "100%" }}>
              <InputLabel
                className={classes.dialogLabel}
                style={{ marginBottom: "20px" }}
              >
                {i18n.t("Upload progress")}:
              </InputLabel>
              <Box className={classes.uploadProgressBox}>
                <Box style={{ flexGrow: 1 }}>
                  <Box
                    className={classes.centerItems}
                    style={{ justifyContent: "space-between" }}
                  >
                    <Input
                      id="title"
                      disableUnderline={true}
                      fullWidth
                      disabled={!showButtons}
                      placeholder={i18n.t("File name")}
                      value={props.fileTabFileName}
                      className={classes.dialogFileInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        props.setFileTabFileName(e.target.value);
                      }}
                    />
                    {showButtons ? (
                      <Box style={{ minWidth: 85 }}>
                        <BlackTooltip title="Cancel" arrow placement="top">
                          <IconButton
                            className={classes.renameIcons}
                            onClick={() => {
                              props.setFileTabFileName(
                                props.selectedFiles.name || ""
                              );
                              setShowButtons(false);
                            }}
                          >
                            <CancelIcon style={{ fontSize: 30 }} />
                          </IconButton>
                        </BlackTooltip>
                        <BlackTooltip
                          title="Save changes"
                          arrow
                          placement="top"
                        >
                          <IconButton
                            className={classes.renameIcons}
                            onClick={() => setShowButtons(false)}
                          >
                            <CheckCircleIcon style={{ fontSize: 30 }} />
                          </IconButton>
                        </BlackTooltip>
                      </Box>
                    ) : (
                      <Typography
                        className={classes.renameFile}
                        onClick={() => setShowButtons(true)}
                      >
                        {i18n.t("Rename file")}
                      </Typography>
                    )}
                  </Box>
                  {props.progress
                    ? props.progress > 0 && <ProgressBar progress={30} />
                    : null}
                </Box>
                <BlackTooltip title="Delete file" arrow placement="top">
                  <IconButton
                    className={classes.deleteIcon}
                    onClick={() => props.setSelectedFiles(undefined)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="25"
                    >
                      <path
                        d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"
                        fill="#b2b2b2"
                      ></path>
                    </svg>
                  </IconButton>
                </BlackTooltip>
              </Box>
            </Box>
          )}
        </Box>
      </TabPanel>
    </DialogContent>
  );
};

export default UpdateDialogTabs;
