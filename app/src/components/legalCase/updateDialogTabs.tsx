import React, { useState, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Input, InputLabel, FormHelperText, Grid } from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";

import i18n from "../../i18n";
import { TabPanelProps, ILegalCaseFile } from "../../types";
import { VisuallyHiddenInput, useStyles } from "../../utils";
import { meetingTypes } from "../../contexts/meetingTypeConstants";
import ProgressBar from "../general/progressBar";

type Props = {
  onFileChange?: (event: any, fileDescription: string) => Promise<void>;
  note: any;
  setNote: (note: any) => void;
  meeting: any;
  setMeeting: (meeting: any) => void;
  progress: number;
  fileTabFileName: string;
  setFileTabFileName: (fileTabFileName: string) => void;
  selectedFiles: any;
  setSelectedFiles: (selectedFiles: any) => void;
  tabValue: number;
  setTabValue: (tabValue: number) => void;
  updateError: string;
  editView?: boolean;
  updateFileId: number | null;
  legalCaseFiles: ILegalCaseFile[];
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
  const [stagedFileName, setStagedFileName] = useState<string>("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.setTabValue(newValue);
    props.setFileTabFileName("");
    props.setSelectedFiles(undefined);
    props.setMeeting({
      meeting_type: "",
      location: "",
      notes: "",
      meeting_date: new Date().toISOString().slice(0, 16),
      advice_was_offered: "",
      advice_offered: "",
    });
    props.setNote({
      title: "",
      content: "",
    });
  };

  const validFileLink = (filePath: string, description: string) => {
    return (
      <a
        href={filePath}
        target="_blank"
        rel="noreferrer"
        className={classes.noOverflow}
      >
        {description}
      </a>
    );
  };

  useEffect(() => {
    function changeValue() {
      if (props.editView && props.tabValue === 0) {
        setValue(0);
      } else if (props.editView && props.tabValue === 1) {
        setValue(1);
      } else if (props.editView && props.tabValue === 2) {
        setValue(2);
      }
    }
    changeValue();
  }, [props.editView, props.tabValue]);

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
            disabled={props.editView && value !== 0 ? true : false}
          />
          <Tab
            key="meetings"
            className={classes.dialogTabButton}
            icon={<ForumOutlinedIcon />}
            label={<Typography>{i18n.t("Meeting")}</Typography>}
            {...a11yProps(1)}
            disabled={props.editView && value !== 1 ? true : false}
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
            {i18n.t(
              "A note is the quickest way for a case worker to update a case with new information and ensure that anybody working on case is able to keep informed about its progress. "
            )}
          </Alert>
          {props.updateError === "title" && (
            <FormHelperText error>
              {i18n.t("Enter a valid title")}
            </FormHelperText>
          )}
          <Input
            id="title"
            disableUnderline={true}
            fullWidth
            value={props.note.title}
            placeholder={i18n.t("Note title")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setNote({ ...props.note, title: e.target.value });
            }}
          />
          {props.updateError === "content" && (
            <FormHelperText error>
              {i18n.t("Enter a valid description")}
            </FormHelperText>
          )}
          <Input
            id="content"
            disableUnderline={true}
            fullWidth
            value={props.note.content}
            rows={10}
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
              component="label"
              className={classes.attachmentButton}
              startIcon={<AttachmentIcon className={classes.attachmentIcon} />}
            >
              {i18n.t("Attach file to note")}
              <VisuallyHiddenInput
                type="file"
                onChange={(e: any) => {
                  setStagedFileName(e.target.files[0].name);
                  if (props.onFileChange) {
                    props.onFileChange(e, e.target.files[0].name);
                  }
                }}
              />
            </Button>
            {stagedFileName.length > 0 && (
              <FormHelperText id="file-selected">
                {i18n.t("New file")}:
                {stagedFileName.length > 24
                  ? stagedFileName.slice(0, 22) + "..."
                  : stagedFileName}
              </FormHelperText>
            )}
            {props.updateFileId !== null &&
              props.updateFileId > 0 &&
              props.editView &&
              stagedFileName.length === 0 &&
              props.legalCaseFiles
                ?.filter(
                  (caseFile: ILegalCaseFile) =>
                    [props.updateFileId].indexOf(caseFile.id as number) > -1
                )
                .map((caseFile: ILegalCaseFile) =>
                  validFileLink(caseFile.upload, caseFile.description as string)
                )}
            <Typography
              className={classes.dialogLabel}
              style={{ paddingLeft: "10px" }}
            >
              {i18n.t("Uploaded file will be added to the case file")}
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
            {i18n.t(
              "A meeting is a clear record that an engagement between client and case officer took place. "
            )}
          </Alert>
          {props.updateError === "meeting_type" && (
            <FormHelperText error>
              {i18n.t("Enter a valid meeting type")}
            </FormHelperText>
          )}
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
          {props.updateError === "location" && (
            <FormHelperText error>
              {i18n.t("Enter a valid location")}
            </FormHelperText>
          )}
          <Input
            id="meeting-location"
            disableUnderline={true}
            fullWidth
            value={props.meeting.location}
            placeholder={i18n.t("Meeting location")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setMeeting({
                ...props.meeting,
                location: e.target.value,
              });
            }}
          />
          {props.updateError === "notes" && (
            <FormHelperText error>
              {i18n.t("Enter a valid note")}
            </FormHelperText>
          )}
          <Input
            id="meeting-note"
            disableUnderline={true}
            value={props.meeting.notes}
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
              className={`${classes.dialogLabel} ${classes.dateLabel}`}
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
              classes={{ input: classes.dateInput }}
              aria-describedby="date-picker"
              value={
                props.meeting.meeting_date
                  ? props.meeting.meeting_date.slice(0, 16)
                  : new Date().toISOString().slice(0, 16)
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setMeeting({
                  ...props.meeting,
                  meeting_date: e.target.value,
                });
              }}
            />
          </Box>
          {props.updateError === "meeting_date" && (
            <FormHelperText error>
              {i18n.t("Enter a valid date")}
            </FormHelperText>
          )}
          <Box
            className={classes.centerItems}
            style={{
              marginBottom: "20px",
            }}
          >
            <InputLabel
              className={classes.dialogLabel}
              style={{ paddingRight: 15 }}
              htmlFor="was_advice_offered"
            >
              {i18n.t("Was advice offered")}?
            </InputLabel>
            <Select
              id="was_advice_offered"
              className={classes.select}
              style={{ flexGrow: 1 }}
              disableUnderline
              input={<Input />}
              value={props.meeting.advice_was_offered}
              onChange={(e: SelectChangeEvent<string>) => {
                props.setMeeting({
                  ...props.meeting,
                  advice_was_offered: e.target.value,
                });
              }}
            >
              <MenuItem key={"true"} value={"true"}>
                {i18n.t("Yes")}
              </MenuItem>
              <MenuItem key={"false"} value={"false"}>
                {i18n.t("No")}
              </MenuItem>
            </Select>
          </Box>
          <Input
            id="advice_offered"
            disableUnderline={true}
            fullWidth
            rows={4}
            multiline
            value={props.meeting.advice_offered}
            placeholder={i18n.t("Record of advice offered")}
            className={classes.dialogInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setMeeting({
                ...props.meeting,
                advice_offered: e.target.value,
              });
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
              component="label"
              className={classes.attachmentButton}
              startIcon={<AttachmentIcon className={classes.attachmentIcon} />}
            >
              {i18n.t("Attach file to meeting")}
              <VisuallyHiddenInput
                type="file"
                onChange={(e: any) => {
                  setStagedFileName(e.target.files[0].name);
                  if (props.onFileChange) {
                    props.onFileChange(e, e.target.files[0].name);
                  }
                }}
              />
            </Button>
            {stagedFileName.length > 0 && (
              <FormHelperText id="file-selected">
                New file:{" "}
                {stagedFileName.length > 24
                  ? stagedFileName.slice(0, 22) + "..."
                  : stagedFileName}
              </FormHelperText>
            )}
            {props.updateFileId !== null &&
              props.updateFileId > 0 &&
              props.editView &&
              stagedFileName.length === 0 &&
              props.legalCaseFiles
                ?.filter(
                  (caseFile: ILegalCaseFile) =>
                    [props.updateFileId].indexOf(caseFile.id as number) > -1
                )
                .map((caseFile: ILegalCaseFile) =>
                  validFileLink(caseFile.upload, caseFile.description as string)
                )}
            <Typography
              className={classes.dialogLabel}
              style={{ paddingLeft: "10px" }}
            >
              {i18n.t("Uploaded file will be added to the case file")}
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </DialogContent>
  );
};

export default UpdateDialogTabs;
