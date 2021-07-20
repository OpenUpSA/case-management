import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import {
  getClient,
  getLegalCase,
  getMeeting,
  updateMeeting,
} from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
} from "@material-ui/core";
import { useStyles } from "../../utils";
import ChatIcon from "@material-ui/icons/Chat";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";

import MeetingForm from "./form";

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
    notes: string,
    location: string,
    meetingDate: string,
    meetingType: string
  ) => {
    try {
      const updatedMeeting = {
        id: parseInt(params.id),
        legal_case: parseInt(params.id),
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
        <Link to="/clients" component={Button}>
          {i18n.t("Client list")}
        </Link>
        <Link to={`/clients/${client?.id}/cases`} component={Button}>
          {client?.preferred_name}
        </Link>
        <Link to={`/cases/${legalCase?.id}`} component={Button}>
          {legalCase?.case_number}
        </Link>
        <div>
          {meeting ? (
            <span>
              {meeting.meeting_type} -{" "}
              {format(new Date(meeting.meeting_date), "MM/dd/yyyy (h:ma)")}
            </span>
          ) : (
            ""
          )}
        </div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              notes: { value: string };
              location: { value: string };
              meetingDate: { value: string };
              meetingType: { value: string };
            };

            saveMeeting(
              target.notes.value,
              target.location.value,
              target.meetingDate.value,
              target.meetingType.value
            );
          }}
        >
          <Grid container direction="row" spacing={2} alignItems="center">
            <Grid item>
              <ChatIcon color="primary" style={{ display: "flex" }} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h6">
                {meeting ? (
                  <strong>
                    {meeting.meeting_type} -{" "}
                    {format(
                      new Date(meeting.meeting_date),
                      "MM/dd/yyyy (h:ma)"
                    )}
                  </strong>
                ) : (
                  ""
                )}
              </Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <ListItem
                  onClick={(e) => {
                    history.push(`/meetings/${meeting?.id}`);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Cancel changes")}</ListItemText>
                </ListItem>
              </MoreMenu>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                startIcon={<RateReviewIcon />}
                type="submit"
              >
                {i18n.t("Save meeting")}
              </Button>
            </Grid>
          </Grid>
          <hr className={classes.hrInvisible} />
          {meeting ? <MeetingForm meeting={meeting} readOnly={false} /> : null}
        </form>
      </Container>
    </Layout>
  );
};

export default Page;
