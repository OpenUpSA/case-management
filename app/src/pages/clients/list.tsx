import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Fab } from "@material-ui/core";
import { PersonAddTwoTone } from "@material-ui/icons";
import PeopleIcon from "@material-ui/icons/People";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { format } from "date-fns";

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
      <Typography component="h1" variant="h5" style={{ flex: 1 }}>
        <PeopleIcon />
        {i18n.t("Clients")}
      </Typography>
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
              <TableCell className={classes.tableHeadCell} colSpan={2}>
                {i18n.t("Last updated")}
              </TableCell>
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
                <TableCell className={classes.tableBodyCell}>
                  {format(new Date(client.updated_at), "MM/dd/yyyy (h:ma)")}
                </TableCell>
                <TableCell className={classes.tableBodyCell} align="right">
                  <ArrowRightAltIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab variant="extended" color="primary" className="fab">
        <PersonAddTwoTone />
        {i18n.t("New client")}
      </Fab>
    </Layout>
  );
};

export default Page;
