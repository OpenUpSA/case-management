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
  getMeetings
} from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";
import EditIcon from "@material-ui/icons/Edit";
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

  const [status, setStatus] = React.useState<string>("Opened");

  const destroyLegalCase = async () => {
    if (window.confirm(i18n.t("Are you sure you want to delete this case?"))) {
      await deleteLegalCase(caseId);
      history.push(`/cases/`);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  useEffect(() => {
    async function fetchData() {
      const dataLegalCase = await getLegalCase(caseId);
      const dataMeetings = await getMeetings(caseId);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
      setMeetings(dataMeetings);
    }
    fetchData();
  }, [caseId]);

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
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              disableUnderline
              className={classes.select}
              input={<Input />}
              value={status}
              onChange={handleChange}
              style={{ width: "200px" }}
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
              <MenuItem
                onClick={() => {
                  history.push(`/cases/${legalCase?.id}/edit`);
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Edit case")}</ListItemText>
              </MenuItem>
              <MenuItem onClick={destroyLegalCase}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete case")}</ListItemText>
              </MenuItem>
            </MoreMenu>
          </Grid>
          
        </Grid>
        <MuiTabs meetings={meetings ? meetings : []} standalone={false}/>
      </Container>
    </Layout>
  );
};

export default Page;
