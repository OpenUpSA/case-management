import React, { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Input from "@material-ui/core/Input";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AttachmentIcon from "@mui/icons-material/Attachment";

import { LegalCaseStates } from "../../contexts/legalCaseStateConstants";
import i18n from "../../i18n";
import { TabPanelProps } from "../../types";
import { useStyles } from "../../utils";

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

const UpdateDialogContent = () => {
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
        <Alert
          severity="info"
          className={classes.updateAlert}
          icon={<HelpOutlineOutlinedIcon fontSize="large" />}
        >
          {i18n.t(
            "A note is the quickest way for a case worker to update a case with new information and ensure that anybody working on case is able to keep informed about its progress. "
          )}
          <a href="www.google.com">{i18n.t("Learn more")}</a>
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
        <Box className={classes.centerItems} sx={{ marginBottom: "20px" }}>
          <InputLabel
            className={classes.dialogLabel}
            style={{ paddingRight: 10 }}
            htmlFor="status"
          >
            {i18n.t("Update case status")}:
          </InputLabel>
          <Select
            id="status"
            className={classes.select}
            style={{ flexGrow: 1 }}
            disableUnderline
            input={<Input />}
            value={"Opened"}
            renderValue={() => "Opened"}
            onChange={(event: SelectChangeEvent<string>) => {}}
          >
            {LegalCaseStates?.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
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
            {i18n.t("Attach files to note")}
          </Button>
          <Typography
            className={classes.dialogLabel}
            style={{ paddingLeft: "10px" }}
          >
            {i18n.t("Uploaded files will be added to the case file")}
          </Typography>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        yyy
      </TabPanel>
      <TabPanel value={value} index={2}>
        zzz
      </TabPanel>
    </DialogContent>
  );
};

export default UpdateDialogContent;
