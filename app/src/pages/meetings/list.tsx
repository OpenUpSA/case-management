import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Button,
  Container,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import ForumIcon from "@material-ui/icons/Forum";
import AddCommentIcon from "@material-ui/icons/AddComment";

import Layout from "../../components/layout";
import { getMeetings } from "../../api";
import { IMeeting } from "../../types";
import i18n from "../../i18n";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import MeetingsTable from "../../components/meeting/table";
import MoreMenu from "../../components/moreMenu";
import SearchIcon from "@material-ui/icons/Search";

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
          <Grid item>
            <MoreMenu></MoreMenu>
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

        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <strong>
              {meetings ? meetings.length : "0"} {i18n.t("Meetings")}
            </strong>
          </Grid>
          <Grid item>
            <InputLabel
              className={classes.inputLabel}
              htmlFor="sort_table"
              shrink={true}
            >
              {i18n.t("Sort")}:
            </InputLabel>
          </Grid>
          <Grid item>
            <Select
              id="sort_table"
              className={classes.select}
              disableUnderline
              input={<Input />}
              value="alphabetical"
            >
              <MenuItem key="alphabetical" value="alphabetical">
                {i18n.t("Alphabetical")}
              </MenuItem>
            </Select>
          </Grid>
          <Grid item md={12}>
            <Input
              id="table_search"
              fullWidth
              placeholder={i18n.t("Enter a name, case number, phone number...")}
              startAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              }
              disableUnderline={true}
              className={classes.textField}
              aria-describedby="my-helper-text"
            />
          </Grid>
        </Grid>

        <MeetingsTable meetings={meetings} />
      </Container>
    </Layout>
  );
};

export default Page;
