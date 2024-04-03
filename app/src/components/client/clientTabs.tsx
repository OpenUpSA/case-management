import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ClientInfoTab from "./clientInfoTab";
import ClientCasesTab from "./clientCasesTab";
import ClientFileTab from "./clientFileTab";
import { TabPanelProps, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { ILegalCase, IClient } from "../../types";
import { NavLink, useLocation } from "react-router-dom";

type Props = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setShowSnackbar: (showSnackbar: SnackbarState) => void;
  legalCases: ILegalCase[];
  client?: IClient;
  newCaseHandler: () => void;
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
  const location = useLocation();
  const classes = useStyles();
  const tabToFocus =
    location.pathname.indexOf("/info") > -1
      ? 1
      : location.pathname.indexOf("/files") > -1
      ? 2
      : 0;
  const [value, setValue] = useState(tabToFocus);

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
            key="cases"
            className={classes.caseTabButton}
            label={
              <Badge badgeContent={props.legalCases.length} color="primary">
                <Typography>{i18n.t("Cases")}</Typography>
              </Badge>
            }
            {...a11yProps(0)}
            component={NavLink}
            to={`/clients/${props.client?.id}/cases`}
          />
          <Tab
            key="clientInfo"
            className={classes.caseTabButton}
            label={<Typography>{i18n.t("Client info")}</Typography>}
            {...a11yProps(1)}
            component={NavLink}
            to={`/clients/${props.client?.id}/info`}
          />
          <Tab
            key="clientFiles"
            className={classes.caseTabButton}
            label={<Typography>{i18n.t("All files")}</Typography>}
            {...a11yProps(1)}
            component={NavLink}
            to={`/clients/${props.client?.id}/files`}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ClientCasesTab
          legalCases={props.legalCases}
          newCaseHandler={props.newCaseHandler}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.client && <ClientInfoTab client={props.client} />}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {props.client ? <ClientFileTab client={props.client} /> : null}
      </TabPanel>
    </>
  );
}
