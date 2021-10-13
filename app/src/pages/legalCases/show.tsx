import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Button,
  Container,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Input,
} from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FolderIcon from "@material-ui/icons/Folder";
import MoreMenu from "../../components/moreMenu";

import Layout from "../../components/layout";
import {
  deleteLegalCase,
  getClient,
  getLegalCase,
  getMeetings,
  updateLegalCase
} from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import DeleteIcon from "@material-ui/icons/Delete";
import MuiTabs from "../../components/legalCase/muiTabs";

type RouteParams = { id: string };

const LegalCaseStates = [
  "Opened",
  "InProgress",
  "Hanging",
  "Pending",
  "Referred",
  "Resolved",
  "Escalated",
  "Closed"
];

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meetings, setMeetings] = React.useState<IMeeting[]>();
  const caseId = parseInt(params.id);

  const [status, setStatus] = React.useState<string | undefined>("");

  const destroyLegalCase = async () => {
    if (window.confirm(i18n.t("Are you sure you want to delete this case?"))) {
      await deleteLegalCase(caseId);
      history.push(`/cases/`);
    }
  };


  useEffect(() => {
    async function fetchData() {
      const dataLegalCase = await getLegalCase(caseId);
      const dataMeetings = await getMeetings(caseId);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
      setStatus(dataLegalCase.state)
      setMeetings(dataMeetings);
    }
    fetchData();
  }, [caseId]);

  const statusPatch = async (arg:any) => {
    try {
      const updatedSummary: ILegalCase = {
        id: legalCase!.id,
        summary: legalCase!.summary,
        case_number: legalCase!.case_number,
        state: arg,
        client: legalCase!.client,
        case_types: legalCase!.case_types,
        case_offices: legalCase!.case_offices,
      };
      const { id } = await updateLegalCase(updatedSummary);
      history.push(`/cases/${id}`);
    } catch (e) {
      console.log(e);
    }
  };
  

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          {client ? client.preferred_name : ""}
        </Button>
        <div>{legalCase?.case_number}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid
          className={classes.pageBar}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item>
            <FolderIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{legalCase?.case_number}</strong>
            </Typography>
          </Grid>
          <Grid item className={classes.selectStatus}>
            <p>Case status:</p>
            <Select
              id="demo-simple-select"
              disableUnderline
              className={classes.select}
              input={<Input />}
              value={status}
              onChange={(event: SelectChangeEvent<string | undefined >) => {
                setStatus(event.target.value as any);         
                statusPatch(event.target.value as any);
              }}
              style={{ width: "200px" }}
              renderValue={()=>status}
            >
              {LegalCaseStates?.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <MoreMenu>
              <MenuItem onClick={destroyLegalCase}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete case")}</ListItemText>
              </MenuItem>
            </MoreMenu>
          </Grid>
          
        </Grid>
        <MuiTabs legalCase={legalCase!} meetings={meetings ? meetings : []} standalone={false}/>
      </Container>
    </Layout>
  );
};

export default Page;
