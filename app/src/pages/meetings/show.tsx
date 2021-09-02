import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, getLegalCase, getMeeting, deleteMeeting } from "casemgtapi";
import { ILegalCase, IClient, IMeeting } from "../../types";
import { RedirectIfNotLoggedIn } from "casemgtauth";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
  MenuItem,
} from "@material-ui/core";
import { useStyles } from "casemgtstyleutils";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteIcon from "@material-ui/icons/Delete";
import RateReviewIcon from "@material-ui/icons/RateReview";
import MoreMenu from "../../components/moreMenu";

import MeetingForm from "../../components/meeting/form";
import ListItemText from "@material-ui/core/ListItemText";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting, setMeeting] = React.useState<IMeeting>();

  const destroyMeeting = async () => {
    if (
      window.confirm(i18n.t("Are you sure you want to delete this meeting?"))
    ) {
      await deleteMeeting(parseInt(params.id));
      history.push(`/cases/${legalCase?.id}`);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const meetingId = parseInt(params.id);
      const dataMeeting = await getMeeting(meetingId);
      const dataLegalCase = await getLegalCase(dataMeeting.legal_case);
      setMeeting(dataMeeting);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
    }
    fetchData();
  }, [params.id]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <Button onClick={() => history.push(`/clients/${client?.id}/cases`)}>
          {client ? client.preferred_name : ""}
        </Button>
        <Button onClick={() => history.push(`/cases/${legalCase?.id}`)}>
          {legalCase?.case_number}
        </Button>
        <div>{meeting?.meeting_type}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <form>
          <Grid
            className={classes.pageBar}
            container
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Grid item>
              <ChatIcon color="primary" style={{ display: "flex" }} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h6">
                <strong>{meeting?.meeting_type}</strong>
              </Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <MenuItem onClick={destroyMeeting}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Delete meeting")}</ListItemText>
                </MenuItem>
              </MoreMenu>
            </Grid>
            <Grid item className={classes.zeroWidthOnMobile}>
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<RateReviewIcon />}
                onClick={() => {
                  history.push(`/meetings/${meeting?.id}/edit`);
                }}
              >
                {i18n.t("Edit meeting")}
              </Button>
            </Grid>
          </Grid>

          <MeetingForm meeting={meeting} />
        </form>
      </Container>
    </Layout>
  );
};

export default Page;
