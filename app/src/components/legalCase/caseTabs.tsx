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
  IUser,
  ILog,
  IClient,
  LocationState,
} from "../../types";
import { useStyles } from "../../utils";
import {
  getLegalCaseFiles,
  getUser,
  getUsers,
  getClient,
  getCaseUpdates,
} from "../../api";
import i18n from "../../i18n";

type Props = {
  meetings: IMeeting[];
  standalone: boolean;
  legalCase: ILegalCase;
  setLegalCase: (legalCase: ILegalCase) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setShowSnackbar: (showSnackbar: LocationState) => void;
  caseHistory: ILog[];
  setCaseHistory: (caseHistory: ILog[]) => void;
  setStatus: (status: string) => void;
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
  const [legalCaseFiles, setLegalCaseFiles] = useState<ILegalCaseFile[]>([]);
  const [caseWorker, setCaseWorker] = useState<IUser | undefined>();
  const [client, setClient] = useState<IClient | undefined>();
  const [caseUpdates, setCaseUpdates] = useState<any>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        props.setIsLoading(true);
        if (props.legalCase?.id !== undefined) {
          const dataLegalCaseFiles = await getLegalCaseFiles(
            props.legalCase?.id
          );
          const clientInfo = await getClient(props.legalCase?.client);
          const userNumber = Number(props.legalCase?.users?.join());
          const userInfo = await getUser(userNumber);
          const updates = await getCaseUpdates(props.legalCase?.id);
          const users = await getUsers();

          setLegalCaseFiles(dataLegalCaseFiles);
          setClient(clientInfo);
          setCaseWorker(userInfo);
          setCaseUpdates(updates);
          setUsers(users);

          props.setIsLoading(false);
        }
      } catch (e: any) {
        props.setIsLoading(false);
        props.setShowSnackbar({
          open: true,
          message: e.message,
          severity: "error",
        });
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [props.legalCase?.id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  console.log(users);
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
              <Badge badgeContent={caseUpdates.length} color="primary">
                <Typography>{i18n.t("Case updates")}</Typography>
              </Badge>
            }
            {...a11yProps(1)}
          />
          <Tab
            key="caseFiles"
            className={classes.caseTabButton}
            label={
              <Badge badgeContent={legalCaseFiles.length} color="primary">
                <Typography>{i18n.t("Case files")}</Typography>
              </Badge>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {props.legalCase ? (
          <CaseInfoTab
            legalCase={props.legalCase}
            setLegalCase={props.setLegalCase}
            client={client}
            caseWorker={caseWorker}
            caseHistory={props.caseHistory ? props.caseHistory : []}
            setCaseHistory={props.setCaseHistory}
            setLegalCaseFiles={setLegalCaseFiles}
            setStatus={props.setStatus}
            setCaseUpdates={setCaseUpdates}
          />
        ) : null}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.legalCase ? (
          <CaseUpdateTab
            legalCase={props.legalCase}
            setLegalCase={props.setLegalCase}
            caseUpdates={caseUpdates}
            setCaseUpdates={setCaseUpdates}
            legalCaseFiles={legalCaseFiles ? legalCaseFiles : []}
            setLegalCaseFiles={setLegalCaseFiles}
            setStatus={props.setStatus}
            users={users ? users : []}
          />
        ) : null}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {legalCaseFiles && props.legalCase ? (
          <CaseFileTab
            legalCase={props.legalCase}
            setLegalCase={props.setLegalCase}
            legalCaseFiles={legalCaseFiles ? legalCaseFiles : []}
            setLegalCaseFiles={setLegalCaseFiles}
            setStatus={props.setStatus}
            setCaseUpdates={setCaseUpdates}
          />
        ) : null}
      </TabPanel>
    </>
  );
}
