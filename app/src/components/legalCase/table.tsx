import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

import {
  Hidden,
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
import { getCaseTypes, getClients } from "../../api";
import { ILegalCase, IClient, ICaseType } from "../../types";

type Props = {
  legalCases?: ILegalCase[];
  standalone: boolean;
};

const Component = (props: Props) => {
  let history = useHistory();
  const classes = useStyles();
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [clients, setClients] = React.useState<IClient[]>();

  useEffect(() => {
    async function fetchData() {
      const dataClients = await getClients();
      const dataCaseTypes = await getCaseTypes();
      setCaseTypes(dataCaseTypes);
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
                {i18n.t("Client")}
              </TableCell>
            ) : (
              ""
            )}
            <TableCell className={classes.tableHeadCell}>
              {i18n.t("Case type")}
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              {i18n.t("Case number")}
            </TableCell>
            <Hidden mdDown>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Last updated")}
              </TableCell>
            </Hidden>
            <TableCell className={classes.tableHeadCell} colSpan={2}>
              {i18n.t("Status")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.legalCases?.map((legalCase) => (
            <TableRow
              key={legalCase.id}
              className={classes.tableBodyRow}
              onClick={() => {
                history.push(`/cases/${legalCase.id}`);
              }}
            >
              {props.standalone ? (
                <TableCell className={classes.tableBodyCell}>
                  {clients
                    ?.filter((client) => client.id === legalCase.client)
                    .map((client) => client.preferred_name)}
                </TableCell>
              ) : (
                ""
              )}
              <TableCell className={classes.tableBodyCell}>
                {caseTypes
                  ?.filter(
                    (caseType) => legalCase.case_types.indexOf(caseType.id) > -1
                  )
                  .map((caseType) => caseType.title)
                  .join(", ")}
              </TableCell>
              <TableCell className={classes.tableBodyCell}>
                {legalCase.case_number}
              </TableCell>
              <Hidden mdDown>
                <TableCell className={classes.tableBodyCell}>
                  {format(
                    new Date(legalCase?.updated_at || new Date().toISOString()),
                    "MM/dd/yyyy (h:ma)"
                  )}
                </TableCell>
              </Hidden>
              <TableCell className={classes.tableBodyCell}>
                {legalCase.state}
              </TableCell>
              <TableCell className={classes.tableBodyCell} align="right">
                <ArrowRightAltIcon />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Component.defaultProps = {
  standalone: true,
};

export default Component;
