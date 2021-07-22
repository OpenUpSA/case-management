import React, { useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Button, Container, Grid } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import ChatIcon from "@material-ui/icons/Chat";
import MeetingsTable from "../../components/meeting/table";
import MoreMenu from "../../components/moreMenu";

import Layout from "../../components/layout";
import {
  getCaseOffices,
  getCaseTypes,
  getClient,
  getLegalCase,
  getMeetings,
} from "../../api";
import {
  ILegalCase,
  IClient,
  ICaseType,
  ICaseOffice,
  IMeeting,
} from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import { useStyles } from "../../utils";

import LegalCaseForm from "../../components/legalCase/form";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [caseOffices, setCaseOffices] = React.useState<ICaseOffice[]>();
  const [client, setClient] = React.useState<IClient>();
  const [meetings, setMeetings] = React.useState<IMeeting[]>();

  useEffect(() => {
    async function fetchData() {
      const caseId = parseInt(params.id);
      const dataLegalCase = await getLegalCase(caseId);
      const dataCaseTypes = await getCaseTypes();
      const dataCaseOffices = await getCaseOffices();
      const dataMeetings = await getMeetings(caseId);
      setLegalCase(dataLegalCase);
      setCaseTypes(dataCaseTypes);
      setCaseOffices(dataCaseOffices);
      setClient(await getClient(dataLegalCase.client));
      setMeetings(dataMeetings);
    }
    fetchData();
  }, [params.id]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Link to="/clients" component={Button}>
          {i18n.t("Client list")}
        </Link>
        <Link to={`/clients/${client?.id}/cases`} component={Button}>
          {client?.preferred_name}
        </Link>
        <div>{legalCase?.case_number}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid className={classes.pageBar} container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <FolderIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{legalCase?.case_number}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <MoreMenu></MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={() => {
                history.push(`/cases/${legalCase?.id}/meetings/new`);
              }}
            >
              {i18n.t("New meeting")}
            </Button>
          </Grid>
        </Grid>

        <LegalCaseForm legalCase={legalCase} />

        <hr className={classes.hr} />

        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <strong>
              {meetings?.length} {i18n.t("Meetings")}
            </strong>
          </Grid>
        </Grid>

        <MeetingsTable meetings={meetings} standalone={false} />
      </Container>
    </Layout>
  );
};

export default Page;
