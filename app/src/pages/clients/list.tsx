import React, { useEffect, useContext } from "react";
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
import Toggle from "../../components/general/toggle";
import { getClients, getClientsForCaseOffice } from "../../api";
import { IClient, LocationState, ICaseOffice } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";
import SnackbarAlert from "../../components/general/snackBar";
import { CaseOfficesContext } from "../../contexts/caseOfficesContext";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [caseOfficeClients, setCaseOfficeClients] = React.useState<IClient[]>();
  const [caseWorkersClients, setCaseWorkersClients] =
    React.useState<IClient[]>();
  const [filteredClients, setFilteredClients] = React.useState<IClient[]>();
  const [filterClientsValue, setFilterClientsValue] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });
  const [usersCaseOfficeId, setUsersCaseOfficeId] = React.useState<number>();
  const [checked, setChecked] = React.useState<boolean>(false);
  const [contextOffices] = useContext(CaseOfficesContext);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getClients();
        const filteredDataForCaseWorker = data.filter(
          (client: any) =>
            client.updates[client.updates.length - 1].user ===
            Number(UserInfo.getInstance().getUserId())
        );
        setCaseWorkersClients(filteredDataForCaseWorker);

        const userInfo = UserInfo.getInstance();
        const usersCaseOffice = Number(userInfo.getCaseOffice());
        setUsersCaseOfficeId(usersCaseOffice);

        const data2 = await getClientsForCaseOffice(usersCaseOffice);
        setCaseOfficeClients(data2);
        setFilteredClients(data2);
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

  useEffect(() => {
    !checked
      ? setFilteredClients(caseOfficeClients)
      : setFilteredClients(caseWorkersClients);
    setFilterClientsValue("");
  }, [checked, caseOfficeClients, caseWorkersClients]);

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

  const filterClients = (list: IClient[] | undefined) => {
    if (filterClientsValue) {
      setFilteredClients(
        list?.filter((client) => {
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
      setFilteredClients(list);
    }
  };

  const filteredCaseOffice = contextOffices
    ?.filter((caseOffice: ICaseOffice) => usersCaseOfficeId === caseOffice.id)
    .map((caseOffice: ICaseOffice) => caseOffice.name)
    .join(", ");

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
          <Grid
            item
            style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Typography variant="h6">
              <strong style={{ textTransform: "capitalize"}}>
                {!checked
                  ? filteredCaseOffice &&
                    `${filteredCaseOffice}'s ${i18n.t("client list")}`
                  : `${UserInfo.getInstance().getName()}'s ${i18n.t(
                      "client list"
                    )}`}
              </strong>
            </Typography>
            <Toggle checked={checked} setChecked={setChecked} />
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
              onKeyUp={() =>
                !checked
                  ? filterClients(caseOfficeClients)
                  : filterClients(caseWorkersClients)
              }
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
