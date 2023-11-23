import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ClientInfoTab from "./clientInfoTab";
import ClientCasesTab from "./clientCasesTab";
import { TabPanelProps, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { ILegalCase, IClient } from "../../types";

type Props = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setShowSnackbar: (showSnackbar: SnackbarState) => void;
  legalCases: ILegalCase[];
  client?: IClient;
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
            label={
              <Badge badgeContent={props.legalCases.length} color="primary">
                <Typography>{i18n.t("Cases")}</Typography>
              </Badge>
            }
            {...a11yProps(0)}
          />
          <Tab
            key="meetings"
            className={classes.caseTabButton}
            label={<Typography>{i18n.t("Client info")}</Typography>}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ClientCasesTab legalCases={props.legalCases} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.client && <ClientInfoTab client={props.client} />}
      </TabPanel>
    </>
  );
}
