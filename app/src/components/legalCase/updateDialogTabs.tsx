import React, { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Input, InputLabel } from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";

import i18n from "../../i18n";
import { TabPanelProps } from "../../types";
import { useStyles } from "../../utils";
import { meetingTypes } from "../../contexts/meetingTypeConstants";

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

const UpdateDialogTabs = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
          />
          <Input
            id="description"
            disableUnderline={true}
            fullWidth
            rows={4}
            multiline
            placeholder={i18n.t("Description of update")}
            className={classes.dialogInput}
          />
          <Box
            className={classes.centerItems}
            sx={{ justifyContent: "space-between", marginBottom: "25px" }}
          >
            <Button
              className={classes.attachmentButton}
              startIcon={<AttachmentIcon className={classes.attachmentIcon} />}
            >
              {i18n.t("Attach files to note")}
            </Button>
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
              value={"In-person"}
              renderValue={() => "In-person"}
              onChange={(event: SelectChangeEvent<string>) => {}}
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
          />
          <Input
            id="meeting-note"
            disableUnderline={true}
            fullWidth
            rows={4}
            multiline
            placeholder={i18n.t("Notes from meeting")}
            className={classes.dialogInput}
          />
          <Box
            className={classes.centerItems}
            style={{
              marginBottom: "20px",
            }}
          >
            <InputLabel
              className={classes.dialogLabel}
              style={{ paddingRight: 15 }}
              htmlFor="Advice-offered"
            >
              {i18n.t("Was advice offered?")}
            </InputLabel>
            <Select
              id="Advice-offered"
              className={classes.select}
              style={{ flexGrow: 1 }}
              disableUnderline
              input={<Input />}
              value={"Yes"}
              renderValue={() => "Yes"}
              onChange={(event: SelectChangeEvent<string>) => {}}
            >
              <MenuItem key={"Yes"} value={"Yes"}>
                {i18n.t("Yes")}
              </MenuItem>
              <MenuItem key={"No"} value={"No"}>
                {i18n.t("No")}
              </MenuItem>
            </Select>
          </Box>
          <Box
            className={classes.centerItems}
            sx={{ justifyContent: "space-between", marginBottom: "25px" }}
          >
            <Button
              className={classes.attachmentButton}
              startIcon={<AttachmentIcon className={classes.attachmentIcon} />}
            >
              {i18n.t("Attach files to meeting")}
            </Button>
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
        </Box>
      </TabPanel>
    </DialogContent>
  );
};

export default UpdateDialogTabs;
