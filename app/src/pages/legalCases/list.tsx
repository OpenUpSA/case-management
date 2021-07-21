import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { Breadcrumbs, Container, Button, Grid } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import PersonIcon from "@material-ui/icons/Person";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import Hidden from "@material-ui/core/Hidden";

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
import MoreMenu from "../../components/moreMenu";

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
        <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
          <Link to="/clients" component={Button}>
            {i18n.t("Client list")}
          </Link>
          <div>{client?.preferred_name}</div>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
          <div>{i18n.t("Case list")}</div>
        </Breadcrumbs>
      )}
      <Container maxWidth="md">
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <PersonIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>
                {client ? client.preferred_name : i18n.t("Case list")}
              </strong>
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
              startIcon={<CreateNewFolderIcon />}
            >
              {i18n.t("New case")}
            </Button>
          </Grid>
        </Grid>

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
                  <Hidden mdDown>
                    <TableCell className={classes.tableBodyCell}>
                      {format(
                        new Date(legalCase.updated_at),
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
      </Container>
    </Layout>
  );
};

export default Page;
