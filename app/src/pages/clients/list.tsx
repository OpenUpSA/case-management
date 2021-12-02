import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
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
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../../components/layout";
import { getClients } from "../../api";
import { IClient, LocationState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import SnackbarAlert from "../../components/general/snackBar";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [clients, setClients] = React.useState<IClient[]>();
  const [filteredClients, setFilteredClients] = React.useState<IClient[]>();
  const [filterClientsValue, setFilterClientsValue] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  const filterClients = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filterClientsValue) {
      setFilteredClients(
        clients?.filter((client) => {
          return (
            client.name
              .toLowerCase()
              .includes(filterClientsValue.toLowerCase()) ||
            client.preferred_name
              .toLowerCase()
              .includes(filterClientsValue.toLowerCase()) ||
            client.contact_number
              .toLowerCase()
              .includes(filterClientsValue.toLowerCase()) ||
            client.contact_email
              .toLowerCase()
              .includes(filterClientsValue.toLowerCase())
          );
        })
      );
    } else {
      setFilteredClients(clients);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getClients();
        setClients(data);
        setFilteredClients(data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setShowSnackbar({
          open: true,
          message: "Client list cannot be loaded",
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
        <div>{i18n.t("Client list")}</div>
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
            <PeopleIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Client list")}</strong>
            </Typography>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => history.push("/clients/new")}
            >
              {i18n.t("New client")}
            </Button>
          </Grid>
        </Grid>

        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <strong>
              {filteredClients ? filteredClients.length : "0"}{" "}
              {i18n.t("Clients")}
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
              placeholder={i18n.t("Enter a name, email, phone number...")}
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
              value={filterClientsValue}
              onChange={(e) => setFilterClientsValue(e.target.value)}
              onKeyUp={filterClients}
            />
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
            {filteredClients && filteredClients.length > 0 ? (
              <TableBody>
                {filteredClients.map((client) => (
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
                      {client.legal_cases ? (
                        <span>{`${client.legal_cases.length} ${i18n.t(
                          "Legal Cases"
                        )}`}</span>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <Hidden mdDown>
                      <TableCell className={classes.tableBodyCell}>
                        {client.updated_at ? (
                          <span>
                            {format(
                              new Date(
                                client.updated_at || new Date().toISOString()
                              ),
                              "dd/MM/yyyy (h:ma)"
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </Hidden>
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
          <Grid container justify="center">
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
