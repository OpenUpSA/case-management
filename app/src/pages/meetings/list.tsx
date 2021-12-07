import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Button, Container, Grid } from "@material-ui/core";
import ForumIcon from "@material-ui/icons/Forum";
import AddCommentIcon from "@material-ui/icons/AddComment";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../../components/layout";
import { getMeetings } from "../../api";
import { IMeeting, LocationState } from "../../types";
import i18n from "../../i18n";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import MeetingsTable from "../../components/meeting/table";
import SnackbarAlert from "../../components/general/snackBar";


const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const [meetings, setMeetings] = React.useState<IMeeting[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const dataMeetings = await getMeetings();
        setMeetings(dataMeetings);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setShowSnackbar({
          open: true,
          message: "Meeting list cannot be loaded",
          severity: "error",
        });
      }
    }
    fetchData();
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
        <div>{i18n.t("Meeting list")}</div>
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
            <ForumIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Meeting list")}</strong>
            </Typography>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<AddCommentIcon />}
            >
              {i18n.t("New meeting")}
            </Button>
          </Grid>
        </Grid>
        <MeetingsTable meetings={meetings ? meetings : []} />
        {isLoading && (
          <Grid container justify="center">
            <CircularProgress />
          </Grid>
        )}
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
