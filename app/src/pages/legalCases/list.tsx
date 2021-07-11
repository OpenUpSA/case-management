import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { Fab } from "@material-ui/core";
import { PersonAddTwoTone } from "@material-ui/icons";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { format } from "date-fns";

import Layout from "../../components/layout";
import { getLegalCases, getClient, getCaseTypes } from "../../api";
import { ILegalCase, IClient, ICaseType } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  let history = useHistory();
  const params = useParams<RouteParams>();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [client, setClient] = React.useState<IClient>();

  useEffect(() => {
    async function fetchData() {
      const clientId = parseInt(params.id);
      const dataLegalCases = await getLegalCases(clientId);
      const dataCaseTypes = await getCaseTypes();
      setLegalCases(dataLegalCases);
      setCaseTypes(dataCaseTypes);

      if (clientId) {
        setClient(await getClient(clientId));
      }
    }
    fetchData();
  }, [params.id]);

  return (
    <Layout>
      {client ? (
        <Typography component="h1" variant="h5" style={{ flex: 1 }}>
          <Link to={`/clients/${client?.id}`}>{client?.preferred_name}</Link>
        </Typography>
      ) : null}
      <Typography component="h1" variant="h5" style={{ flex: 1 }}>
        {i18n.t("Legal Cases")}
      </Typography>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Case type")}
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Case number")}
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Last updated")}
              </TableCell>
              <TableCell className={classes.tableHeadCell} colSpan={2}>
                {i18n.t("Status")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {legalCases?.map((legalCase) => (
              <TableRow
                key={legalCase.id}
                className={classes.tableBodyRow}
                onClick={() => {
                  history.push(`/cases/${legalCase.id}`);
                }}
              >
                <TableCell className={classes.tableBodyCell}>
                  {caseTypes
                    ?.filter(
                      (caseType) =>
                        legalCase.case_types.indexOf(caseType.id) > -1
                    )
                    .map((caseType) => caseType.title)
                    .join(", ")}
                </TableCell>
                <TableCell className={classes.tableBodyCell}>
                  {legalCase.case_number}
                </TableCell>
                <TableCell className={classes.tableBodyCell}>
                  {format(new Date(legalCase.updated_at), "MM/dd/yyyy (h:ma)")}
                </TableCell>
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
      <Fab variant="extended" color="primary" className="fab">
        <PersonAddTwoTone />
        {i18n.t("New legal case")}
      </Fab>
    </Layout>
  );
};

export default Page;
