import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, getLegalCase, getMeeting, updateMeeting } from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
  MenuItem,
} from "@material-ui/core";
import { useStyles } from "../../utils";
import ChatIcon from "@material-ui/icons/Chat";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";

import MeetingForm from "../../components/meeting/form";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting, setMeeting] = React.useState<IMeeting>();

  const saveMeeting = async (
    legalCase: number,
    notes: string,
    location: string,
    meetingDate: string,
    meetingType: string
  ) => {
    try {
      const updatedMeeting = {
        id: parseInt(params.id),
        legal_case: legalCase,
        location: location,
        meeting_date: meetingDate,
        meeting_type: meetingType,
        notes: notes,
      };
      const { id } = await updateMeeting(updatedMeeting);
      history.push(`/meetings/${id}`);
    } catch (e) {
      console.log(e);
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
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              notes: { value: string };
              location: { value: string };
              meeting_date: { value: string };
              meeting_type: { value: string };
            };

            saveMeeting(
              meeting?.legal_case || 0,
              target.notes.value,
              target.location.value,
              target.meeting_date.value,
              target.meeting_type.value
            );
          }}
        >
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
                <MenuItem
                  onClick={() => {
                    history.push(`/meetings/${meeting?.id}`);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Cancel changes")}</ListItemText>
                </MenuItem>
              </MoreMenu>
            </Grid>
            <Grid item className={classes.zeroWidthOnMobile}>
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<RateReviewIcon />}
                type="submit"
              >
                {i18n.t("Save meeting")}
              </Button>
            </Grid>
          </Grid>
          <MeetingForm meeting={meeting} readOnly={false} />
        </form>
      </Container>
    </Layout>
  );
};

export default Page;
