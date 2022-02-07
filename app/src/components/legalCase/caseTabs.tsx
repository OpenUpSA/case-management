import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CaseFileTab from "./caseFileTab";
import CaseInfoTab from "./caseInfoTab";
import CaseUpdateTab from "./caseUpdateTab";
import {
  IMeeting,
  ILegalCase,
  ILegalCaseFile,
  TabPanelProps,
} from "../../types";
import { useStyles } from "../../utils";
import { getLegalCaseFiles } from "../../api";
import i18n from "../../i18n";

type Props = {
  meetings: IMeeting[];
  standalone: boolean;
  legalCase: ILegalCase;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CaseTabs(props: Props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [legalCaseFiles, setLegalCaseFiles] = useState<
    ILegalCaseFile[] | undefined
  >();

  useEffect(() => {
    async function fetchData() {
      if (props.legalCase?.id) {
        const dataLegalCaseFiles = await getLegalCaseFiles(props.legalCase?.id);
        setLegalCaseFiles(dataLegalCaseFiles);
      }
    }
    fetchData();
  }, [props.legalCase]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        className={classes.containerMarginBottom}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tab panels"
          centered
          variant="fullWidth"
        >
          <Tab
            key="caseInfo"
            className={classes.caseTabButton}
            label={<Typography>{i18n.t("Case info")}</Typography>}
            {...a11yProps(0)}
          />
          <Tab
            key="meetings"
            className={classes.caseTabButton}
            label={
              <Badge badgeContent={0} color="primary">
                <Typography>{i18n.t("Case updates")}</Typography>
              </Badge>
            }
            {...a11yProps(1)}
          />
          <Tab
            key="caseFiles"
            className={classes.caseTabButton}
            label={
              <Badge badgeContent={legalCaseFiles?.length} color="primary">
                <Typography>{i18n.t("Case files")}</Typography>
              </Badge>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {props.legalCase ? <CaseInfoTab legalCase={props.legalCase} /> : null}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CaseUpdateTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {legalCaseFiles && props.legalCase ? (
          <CaseFileTab
            legalCase={props.legalCase}
            legalCaseFiles={legalCaseFiles}
            setLegalCaseFiles={setLegalCaseFiles}
          />
        ) : null}
      </TabPanel>
    </>
  );
}
