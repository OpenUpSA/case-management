import React, { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Input from "@material-ui/core/Input";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

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
            "A note is the quickest way for a case worker to update a case with new information and ensure that anybody working on case is able to keep informed about its progress. Learn more"
          )}
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
