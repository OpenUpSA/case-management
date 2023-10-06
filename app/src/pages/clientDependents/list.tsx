import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Container,
  Grid,
  IconButton,
  Input,
  InputAdornment,
} from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { format } from "date-fns";

import { Breadcrumbs } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../../components/layout";
import { getClientDependents } from "../../api";
import { IClientDependent, LocationState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";
import SnackbarAlert from "../../components/general/snackBar";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [clientDependents, setClientDependents] =
    React.useState<IClientDependent[]>();
  const [filteredClientDependents, setFilteredClientDependents] =
    React.useState<IClientDependent[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getClientDependents();
        setClientDependents(data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setShowSnackbar({
          open: true,
          message: "Dependent list cannot be loaded",
          severity: "error",
        });
      }
    }
    fetchData();
  }, []);

  // set location.state?.open! to false on page load
  useEffect(() => {
    history.push({ state: { open: false } });
  }, [history]);

  useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar({
          open: false,
          message: "",
          severity: undefined,
        });
      }, 6000);
    };
    resetState();
  }, [showSnackbar.open]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <div>{i18n.t("Dependents list")}</div>
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
            <EscalatorWarningIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid
            item
            style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Typography variant="h6">
              <strong style={{ textTransform: "capitalize" }}>
                {i18n.t("Dependents list")}
              </strong>
            </Typography>
          </Grid>
        </Grid>

        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableHeadCell}>
                  {i18n.t("Dependent name")}
                </TableCell>
                <TableCell className={classes.tableHeadCell} colSpan={2}>
                  <span>
                    <Hidden xlUp>{i18n.t("Last updated")}</Hidden>
                  </span>
                </TableCell>
              </TableRow>
            </TableHead>
            {clientDependents && clientDependents.length > 0 ? (
              <TableBody>
                {clientDependents.map((clientDependent) => (
                  <TableRow
                    key={clientDependent.id}
                    className={classes.tableBodyRow}
                    onClick={() => {
                      history.push(`/dependents/${clientDependent.id}/`);
                    }}
                  >
                    <TableCell className={classes.tableBodyCell}>
                      <strong>{clientDependent.preferred_name}</strong>
                    </TableCell>
                    <TableCell className={classes.tableBodyCell}>
                      {clientDependent.updated_at ? (
                        <span>
                          {format(
                            new Date(
                              clientDependent.updated_at || new Date().toISOString()
                            ),
                            "dd/MM/yyyy (h:ma)"
                          )}
                        </span>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell className={classes.tableBodyCell} align="right">
                      <ArrowRightAltIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow
                  className={`${classes.tableBodyRow} ${classes.tableBodyRowEmpty}`}
                >
                  <TableCell
                    colSpan={4}
                    className={classes.tableBodyCell}
                  ></TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {isLoading && (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
      </Container>
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </Layout>
  );
};

export default Page;
