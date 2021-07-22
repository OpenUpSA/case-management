import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getClient, updateClient } from "../../api";
import { IClient } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
  ListItemIcon,
} from "@material-ui/core";
import { useStyles } from "../../utils";
import PersonIcon from "@material-ui/icons/Person";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";

import ClientForm from "../../components/client/form";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const clientId = parseInt(params.id);
  const [client, setClient] = React.useState<IClient>();

  const saveClient = async (client: IClient) => {
    try {
      const updatedClient = {
        ...client,
        id: clientId,
      };
      const { id } = await updateClient(updatedClient);
      history.push(`/clients/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const dataClient = await getClient(clientId);
      setClient(dataClient);
    }
    fetchData();
  }, [clientId]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Link to="/clients" component={Button}>
          {i18n.t("Client list")}
        </Link>
        <div>{client?.preferred_name}</div>
      </Breadcrumbs>
      <Container maxWidth="md">
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              preferred_name: { value: string };
              official_identifier: { value: string };
              official_identifier_type: { value: string };
              contact_number: { value: string };
              contact_email: { value: string };
              name: { value: string };
            };

            saveClient({
              preferred_name: target.preferred_name.value,
              official_identifier: target.official_identifier.value,
              official_identifier_type: target.official_identifier_type.value,
              contact_number: target.contact_number.value,
              contact_email: target.contact_email.value,
              name: target.name.value,
            });
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
              <PersonIcon color="primary" style={{ display: "flex" }} />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h6">
                <strong>{client?.preferred_name}</strong>
              </Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <ListItem
                  onClick={(e) => {
                    history.push(`/clients/${clientId}`);
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Cancel changes")}</ListItemText>
                </ListItem>
              </MoreMenu>
            </Grid>
            <Grid item className={classes.zeroWidthOnMobile}>
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                startIcon={<PersonOutlineIcon />}
                type="submit"
              >
                {i18n.t("Save client")}
              </Button>
            </Grid>
          </Grid>
          <ClientForm client={client} readOnly={false} detailedView={true} />
        </form>
      </Container>
    </Layout>
  );
};

export default Page;
