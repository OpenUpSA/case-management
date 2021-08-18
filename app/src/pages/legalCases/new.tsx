import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient } from "../../api";
import { ILegalCase, IClient } from "../../types";
import { RedirectIfNotLoggedIn, UserInfo } from "../../auth";
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
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder"
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";

import LegalCaseForm from "../../components/legalCase/form";

import { createLegalCase } from "../../api";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const [legalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const clientId = parseInt(params.id);
  const userInfo = UserInfo.getInstance();
  const userId = userInfo.getUserId();

  const newLegalCase = async (
    case_number: string,
    state: string,
    case_types: number[],
    case_offices: number[]
  ) => {
    try {
      const newLegalCase = {
        client: clientId,
        case_number: case_number,
        state: state,
        case_types: case_types,
        case_offices: case_offices,
        users: [userId],
      };
      const { id } = await createLegalCase(newLegalCase);
      history.push(`/cases/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setClient(await getClient(clientId));
    }
    fetchData();
  }, [clientId]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <Button onClick={() => history.push(`/clients/${client?.id}/cases`)}>
          {client ? client.preferred_name : ""}
        </Button>
        <div>{i18n.t("New case")}</div>
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

            newLegalCase(
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
              <Typography variant="h6">{i18n.t("New case")}</Typography>
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
                startIcon={<CreateNewFolderIcon />}
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
