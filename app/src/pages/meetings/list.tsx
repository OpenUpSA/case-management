import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { Fab } from "@material-ui/core";

import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ForumIcon from "@material-ui/icons/Forum";
import AddCommentIcon from "@material-ui/icons/AddComment";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

import { format } from "date-fns";

import Layout from "../../components/layout";
import { getLegalCases, getMeetings, getClients } from "../../api";
import { ILegalCase, IMeeting, IClient } from "../../types";
import i18n from "../../i18n";
import { useStyles } from "../../utils";

const Page = () => {
  const classes = useStyles();
  let history = useHistory();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [meetings, setMeetings] = React.useState<IMeeting[]>();
  const [clients, setClients] = React.useState<IClient[]>();

  useEffect(() => {
    async function fetchData() {
      const dataLegalCases = await getLegalCases();
      const dataMeetings = await getMeetings();
      const dataClients = await getClients();
      setClients(dataClients);
      setLegalCases(dataLegalCases);
      setMeetings(dataMeetings);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <Typography component="h1" variant="h5" style={{ flex: 1 }}>
        <ForumIcon />
        {i18n.t("Meeting list")}
      </Typography>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Client name")}
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Meeting type")}
              </TableCell>
              <TableCell className={classes.tableHeadCell} colSpan={2}>
                {i18n.t("Meeting date")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meetings?.map((meeting) => (
              <TableRow
                key={meeting.id}
                className={classes.tableBodyRow}
                onClick={() => {
                  history.push(`/meetings/${meeting.id}`);
                }}
              >
                <TableCell className={classes.tableBodyCell}>
                  <strong>
                    {clients
                      ?.filter(
                        (client) =>
                          client.id ===
                          legalCases
                            ?.filter(
                              (legalCase) => meeting.legal_case === legalCase.id
                            )
                            .map((legalCase) => legalCase.client)[0]
                      )
                      .map((client) => client.preferred_name)}
                  </strong>
                </TableCell>
                <TableCell className={classes.tableBodyCell}>
                  {meeting.meeting_type}
                </TableCell>
                <TableCell className={classes.tableBodyCell}>
                  {format(new Date(meeting.meeting_date), "MM/dd/yyyy (h:ma)")}
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
        <AddCommentIcon />
        {i18n.t("New meeting")}
      </Fab>
    </Layout>
  );
};

export default Page;
