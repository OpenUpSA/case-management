import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  Input,
  InputAdornment,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import Layout from "../../components/layout";
import { getLegalCases, getClient, deleteClient } from "../../api";
import { ILegalCase, IClient } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";

import ClientForm from "../../components/client/form";
import LegalCasesTable from "../../components/legalCase/table";
import SearchIcon from "@material-ui/icons/Search";
import MoreMenu from "../../components/moreMenu";
import DeleteIcon from "@material-ui/icons/Delete";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const clientId = parseInt(params.id);
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [client, setClient] = React.useState<IClient>();
  const [filteredLegalCases, setFilteredLegalCases] =
    React.useState<ILegalCase[]>();
  const [filterLegalCasesValue, setFilterLegalCasesValue] =
    React.useState<string>();

  const destroyClient = async () => {
    if (
      window.confirm(i18n.t("Are you sure you want to delete this client?"))
    ) {
      await deleteClient(clientId);
      history.push("/clients");
    }
  };

  //TODO: Better filtering
  const filterLegalCases = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filterLegalCasesValue) {
      setFilteredLegalCases(
        legalCases?.filter((legalCase) => {
          return (
            legalCase.case_number.toLowerCase().includes(filterLegalCasesValue.toLowerCase()) ||
            legalCase.state.toLowerCase().includes(filterLegalCasesValue.toLowerCase())
          );
        })
      );
    } else {
      setFilteredLegalCases(legalCases);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const dataLegalCases = await getLegalCases(clientId);
      setLegalCases(dataLegalCases);
      setFilteredLegalCases(dataLegalCases);

      if (clientId) {
        setClient(await getClient(clientId));
      }
    }
    fetchData();
  }, [clientId]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <div>{client ? client.preferred_name : ""}</div>
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
            <MoreMenu>
              <MenuItem
                onClick={() => {
                  history.push(`/clients/${clientId}/edit`);
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Edit client")}</ListItemText>
              </MenuItem>
              <MenuItem onClick={destroyClient}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("Delete client")}</ListItemText>
              </MenuItem>
            </MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              disabled={client ? false : true}
              onClick={() => {
                history.push(`/clients/${client?.id}/cases/new`);
              }}
            >
              {i18n.t("New case")}
            </Button>
          </Grid>
        </Grid>

        <ClientForm client={client} />
        <hr className={classes.hr} />

        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <strong>
              {filteredLegalCases ? filteredLegalCases.length : "0"} {i18n.t("Cases")}
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
              placeholder={i18n.t("Enter a case number, status, or type...")}
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
              value={filterLegalCasesValue}
              onChange={(e) => setFilterLegalCasesValue(e.target.value)}
              onKeyUp={filterLegalCases}
            />
          </Grid>
        </Grid>

        <LegalCasesTable legalCases={filteredLegalCases} standalone={false} />
      </Container>
    </Layout>
  );
};

export default Page;
