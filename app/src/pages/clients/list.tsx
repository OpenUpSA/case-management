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
} from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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
import { getClientsForCaseOffice, getClientsForUser } from "../../api";
import { IClient, LocationState, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";
import SnackbarAlert from "../../components/general/snackBar";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [caseOfficeClients, setCaseOfficeClients] = React.useState<IClient[]>();
  const [userClients, setUserClients] = React.useState<IClient[]>();
  const [filteredClients, setFilteredClients] = React.useState<IClient[]>();
  const [filterClientsValue, setFilterClientsValue] =
    React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });
  const [usersId, setUsersId] = React.useState<number>(0);
  const [usersCaseOfficeId, setUsersCaseOfficeId] = React.useState<number>(0);
  const [clientList, setClientList] = React.useState<string>(
    "All case office clients"
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const userInfo = UserInfo.getInstance();
        const id = Number(userInfo.getUserId());
        setUsersId(id);
        const usersCaseOffice = Number(userInfo.getCaseOffice());
        setUsersCaseOfficeId(usersCaseOffice);

        if (usersId) {
          const data = await getClientsForUser(usersId);
          setUserClients(data);
        }

        if (usersCaseOfficeId) {
          const data2 = await getClientsForCaseOffice(usersCaseOfficeId);
          setCaseOfficeClients(data2);
          setFilteredClients(data2);
        }
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
  }, [usersCaseOfficeId, usersId]);

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

  const changeListHandler = (value: string) => {
    if (value === "All case office clients") {
      setFilteredClients(caseOfficeClients);
    } else if (value === "My clients") {
      setFilteredClients(userClients);
    }
    setFilterClientsValue("");
  };

  const filterClients = (list: IClient[] | undefined) => {
    if (filterClientsValue) {
      setFilteredClients(
        list?.filter((client) => {
          return (
            client.first_names
              .toLowerCase()
              .includes(filterClientsValue.toLowerCase()) ||
            client.last_name
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
      setFilteredClients(list);
    }
  };

  return (
    <Layout>
      <header className={classes.breadCrumbHeader}>
        <Container maxWidth="md">
          <Breadcrumbs
            className={classes.breadcrumbs}
            aria-label="breadcrumb"
            separator="&#9656;"
          >
            <Button onClick={() => history.push("/clients")}>
              {i18n.t("Client list")}
            </Button>
          </Breadcrumbs>
        </Container>
      </header>
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
          <Grid
            item
            style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Typography variant="h6">
              <strong style={{ textTransform: "capitalize" }}>
                {i18n.t("Client list")}
              </strong>
            </Typography>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              disableElevation={true}
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
          <Grid item style={{ flexGrow: 1, fontSize: 16 }}>
            <strong>
              {filteredClients ? filteredClients.length : "0"}{" "}
              {i18n.t("Clients")}
            </strong>
          </Grid>
          <Grid item className={classes.centerItems}>
            <InputLabel
              className={classes.inputLabel}
              shrink={true}
              htmlFor="filter"
            >
              {i18n.t("Filter")}:
            </InputLabel>
            <Select
              id="Filter"
              className={classes.select}
              style={{ minWidth: 200 }}
              disableUnderline
              input={<Input />}
              value={clientList}
              renderValue={() => clientList}
              onChange={(event: SelectChangeEvent<string>) => {
                setClientList(event.target.value);
                changeListHandler(event.target.value);
              }}
            >
              <MenuItem value={"All case office clients"}>
                {i18n.t("All case office clients")}
              </MenuItem>
              <MenuItem value={"My clients"}>{i18n.t("My clients")}</MenuItem>
            </Select>
          </Grid>
          <Grid item className={classes.centerItems}>
            <InputLabel
              className={classes.inputLabel}
              shrink={true}
              htmlFor="sort_table"
            >
              {i18n.t("Sort")}:
            </InputLabel>
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
          <Grid item xs={12} md={12}>
            <Input
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
              onKeyUp={() => {
                clientList === "All case office clients"
                  ? filterClients(caseOfficeClients)
                  : filterClients(userClients);
              }}
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
