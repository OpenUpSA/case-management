import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Button, Container, Grid } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PeopleIcon from "@material-ui/icons/People";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { format } from "date-fns";

import { Breadcrumbs } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

import Layout from "../../components/layout";
import { getClients } from "../../api";
import { IClient } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import MoreMenu from "../../components/moreMenu";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  let history = useHistory();
  const [clients, setClients] = React.useState<IClient[]>();

  useEffect(() => {
    async function fetchData() {
      setClients(await getClients());
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <div>{i18n.t("Client list")}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <PeopleIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Client list")}</strong>
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
              startIcon={<PersonAddIcon />}
            >
              {i18n.t("New client")}
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableHeadCell}>
                  {i18n.t("Client name")}
                </TableCell>
                <TableCell className={classes.tableHeadCell}>
                  {i18n.t("Number of cases")}
                </TableCell>
                <Hidden mdDown>
                  <TableCell className={classes.tableHeadCell} colSpan={2}>
                    <span>
                      <Hidden xlUp>{i18n.t("Last updated")}</Hidden>
                    </span>
                  </TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients?.map((client) => (
                <TableRow
                  key={client.id}
                  className={classes.tableBodyRow}
                  onClick={() => {
                    history.push(`/clients/${client.id}/cases`);
                  }}
                >
                  <TableCell className={classes.tableBodyCell}>
                    <strong>{client.preferred_name}</strong>
                  </TableCell>
                  <TableCell className={classes.tableBodyCell}>
                    {`${client.legal_cases.length} ${i18n.t("Legal Cases")}`}
                  </TableCell>
                  <Hidden mdDown>
                    <TableCell className={classes.tableBodyCell}>
                      {format(new Date(client.updated_at), "MM/dd/yyyy (h:ma)")}
                    </TableCell>
                  </Hidden>
                  <TableCell className={classes.tableBodyCell} align="right">
                    <ArrowRightAltIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default Page;
