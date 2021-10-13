import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import NewMeetingsTable from "../meeting/newTable";
import Typography from "@mui/material/Typography";
import CaseFileTab from "./caseFileTab";
import CaseInfoTab from "./caseInfoTab";
import { IMeeting, ILegalCase } from "../../types";
import { useStyles } from "../../utils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

export default function BasicTabs(props: Props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
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
          className={classes.tabButton}
            label={
              <Typography
                sx={{ paddingTop: 1, paddingRight: 2, textTransform: "none", color: "black", fontWeight: 700 }}
              >
                Case info
              </Typography>
            }
            {...a11yProps(0)}
          />
          <Tab
          className={classes.tabButton}
            label={
              <Badge badgeContent={props.meetings.length} color="primary">
                <Typography
                  sx={{ paddingTop: 1, paddingRight: 2, textTransform: "none", color: "black", fontWeight: 700  }}
                >
                  Meetings
                </Typography>
              </Badge>
            }
            {...a11yProps(1)}
          />
          <Tab
          className={classes.tabButton}
            label={
                <Typography
                  sx={{ paddingTop: 1, paddingRight: 2, textTransform: "none", color: "black", fontWeight: 700  }}
                >
                  Case files
                </Typography>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CaseInfoTab legalCase={props.legalCase}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NewMeetingsTable
          meetings={props.meetings ? props.meetings : []}
          standalone={false}
          legalCase={props.legalCase}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CaseFileTab />
      </TabPanel>
    </div>
  );
}
