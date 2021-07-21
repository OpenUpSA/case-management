import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Button, Container, Grid } from "@material-ui/core";

import ForumIcon from "@material-ui/icons/Forum";
import AddCommentIcon from "@material-ui/icons/AddComment";

import Layout from "../../components/layout";
import { getMeetings } from "../../api";
import { IMeeting } from "../../types";
import i18n from "../../i18n";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import MeetingsList from "../../components/meetings";
import MoreMenu from "../../components/moreMenu";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const [meetings, setMeetings] = React.useState<IMeeting[]>();

  useEffect(() => {
    async function fetchData() {
      const dataMeetings = await getMeetings();
      setMeetings(dataMeetings);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <div>{i18n.t("Meeting list")}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <ForumIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Meeting list")}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <MoreMenu>              
            </MoreMenu>
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

        {meetings ? <MeetingsList meetings={meetings} /> : null}
      </Container>
    </Layout>
  );
};

export default Page;
