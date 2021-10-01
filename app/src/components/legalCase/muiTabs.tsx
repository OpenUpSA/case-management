import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MeetingsTable from "../meeting/table";
import CasesTable from "../legalCase/table";
import RecommendedTable from "./recommendedTable";
import { IMeeting, ILegalCase } from "../../types";
import { getMeetings, getLegalCases } from "../../api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type Props = {
    meetings: IMeeting[];
    standalone: boolean;
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
  const [value, setValue] = React.useState(0);
  //const [meetings, setMeetings] = React.useState<IMeeting[]>();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    async function fetchData() {
      //const dataMeetings = await getMeetings(props.caseId);
      //setMeetings(dataMeetings);
    }
    fetchData();
  }, [props.meetings]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          variant="fullWidth"
        >
          <Tab label="Case Info" {...a11yProps(0)} />
          <Tab label="Meetings" {...a11yProps(1)} />
          <Tab label="Case files" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MeetingsTable
          meetings={props.meetings ? props.meetings : []}
          standalone={false}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RecommendedTable />
      </TabPanel>
    </Box>
  );
}
