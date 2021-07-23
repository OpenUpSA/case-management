import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { format } from "date-fns";
import { getLegalCases, getClients } from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";

type Props = {
  meetings?: IMeeting[];
  standalone: boolean;
};

const Component = (props: Props) => {
  const history = useHistory();
  const classes = useStyles();
  const [clients, setClients] = React.useState<IClient[]>();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();

  useEffect(() => {
    async function fetchData() {
      const dataClients = await getClients();
      const dataLegalCases = await getLegalCases();
      setLegalCases(dataLegalCases);
      setClients(dataClients);
    }
    fetchData();
  }, []);
  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.tableHeadRow}>
            {props.standalone ? (
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Client name")}
              </TableCell>
            ) : null}
            <TableCell className={classes.tableHeadCell}>
              {i18n.t("Meeting type")}
            </TableCell>
            <TableCell className={classes.tableHeadCell} colSpan={2}>
              {i18n.t("Meeting date")}
            </TableCell>
          </TableRow>
        </TableHead>
        {props.meetings ? (
          <TableBody>
            {props.meetings.map((meeting) => (
              <TableRow
                key={meeting.id}
                className={classes.tableBodyRow}
                onClick={() => {
                  history.push(`/meetings/${meeting.id}`);
                }}
              >
                {props.standalone ? (
                  <TableCell className={classes.tableBodyCell}>
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
                  </TableCell>
                ) : null}
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
        ) : (
          <TableBody>
            <TableRow className={classes.tableBodyRow}>
              <TableCell className={classes.tableBodyCell}>
                <strong>----</strong>
              </TableCell>
              <TableCell className={classes.tableBodyCell}>----</TableCell>
              <TableCell className={classes.tableBodyCell}>----</TableCell>
              <TableCell className={classes.tableBodyCell} align="right">
                <ArrowRightAltIcon />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

Component.defaultProps = {
  standalone: true,
};

export default Component;
