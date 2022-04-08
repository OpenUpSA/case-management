import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Container, Grid } from "@material-ui/core";

import ForumIcon from "@material-ui/icons/Forum";

import Layout from "../../components/layout";
import { getLogs, getUsers } from "../../api";
import { ILog, IUser } from "../../types";
import i18n from "../../i18n";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import LogsTable from "../../components/log/table";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const [logs, setLogs] = useState<ILog[]>();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    async function fetchData() {
      const dataLogs = await getLogs();
      const users = await getUsers();
      setLogs(dataLogs);
      setUsers(users);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <div>{i18n.t("Logs list")}</div>
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
              <strong>{i18n.t("Logs list")}</strong>
            </Typography>
          </Grid>
        </Grid>

        <LogsTable logs={logs ? logs : []} users={users ? users : []} />
      </Container>
    </Layout>
  );
};

export default Page;
