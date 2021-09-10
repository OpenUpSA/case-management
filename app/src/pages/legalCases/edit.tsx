import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, getLegalCase, updateLegalCase } from "../../api";
import { ILegalCase, IClient } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
  MenuItem,
} from "@material-ui/core";
import { useStyles } from "../../utils";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";

import LegalCaseForm from "../../components/legalCase/form";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const legalCaseId = parseInt(params.id);
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();

  const saveLegalCase = async (
    case_number: string,
    state: string,
    case_types: number[],
    case_offices: number[]
  ) => {
    try {
      const updatedLegalCase = {
        id: legalCaseId,
        client: client?.id || 0,
        case_number: case_number,
        state: state,
        case_types: case_types,
        case_offices: case_offices,
      };
      const { id } = await updateLegalCase(updatedLegalCase);
      history.push(`/cases/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const dataLegalCase = await getLegalCase(legalCaseId);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
    }
    fetchData();
  }, [legalCaseId]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          {client ? client.preferred_name : ""}
        </Button>
        <div>{legalCase?.case_number}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              case_number: { value: string };
              state: { value: string };
              case_types: { value: string };
              case_offices: { value: string };
            };

            saveLegalCase(
              target.case_number.value,
              target.state.value,
              target.case_types.value.split(",").map((s) => parseInt(s)),
              target.case_offices.value.split(",").map((s) => parseInt(s))
            );
          }}
        >
          <Grid
            className={classes.pageBar}
            container
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Grid item>
              <FolderIcon color="primary" style={{ display: "flex" }} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h6">
                <strong>{legalCase?.case_number}</strong>
              </Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <MenuItem
                  onClick={() => {
                    history.push(`/cases/${legalCase?.id}`);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Cancel changes")}</ListItemText>
                </MenuItem>
              </MoreMenu>
            </Grid>
            <Grid item className={classes.zeroWidthOnMobile}>
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<FolderOpenIcon />}
                type="submit"
              >
                {i18n.t("Save case")}
              </Button>
            </Grid>
          </Grid>
          <LegalCaseForm legalCase={legalCase} readOnly={false} />
        </form>
      </Container>
    </Layout>
  );
};

export default Page;
