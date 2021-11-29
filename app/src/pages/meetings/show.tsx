import React, { useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, getLegalCase, getMeeting, deleteMeeting } from "../../api";
import { ILegalCase, IClient, IMeeting, LocationState } from "../../types";
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
import DeleteIcon from "@material-ui/icons/Delete";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ListItemText from "@material-ui/core/ListItemText";
import MoreMenu from "../../components/moreMenu";

import MeetingForm from "../../components/meeting/form";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting, setMeeting] = React.useState<IMeeting>();

  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  const destroyMeeting = async () => {
    try {
      if (
        window.confirm(i18n.t("Are you sure you want to delete this meeting?"))
      ) {
        await deleteMeeting(parseInt(params.id));
        history.push({
          pathname: `/cases/${legalCase?.id}`,
          state: {
            open: true,
            message: "Meeting delete successful",
            severity: "success",
          },
        });
      }
    } catch (error) {
      setShowSnackbar({
        open: true,
        message: "Meeting delete failed",
        severity: "error",
      });
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

  // set location.state?.open! to false on page load
  useEffect(() => {
    history.push({ state: { open: false } });
  }, []);

  useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar({
          open: false,
          message: "",
          severity: undefined,
        });
      }, 6000);
    };
    resetState();
  }, [showSnackbar.open]);

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
          Client: {client ? client.preferred_name : ""}
        </Button>
        <Button
          disabled={legalCase ? false : true}
          onClick={() => history.push(`/cases/${legalCase?.id}`)}
        >
          Case: {legalCase?.case_number}
        </Button>
        <div>Meeting: {meeting?.meeting_type}</div>
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
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </Layout>
  );
};

export default Page;
