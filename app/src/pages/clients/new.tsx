import React from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { createClient } from "../../api";
import { IClient } from "../../types";
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
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";

import ClientForm from "../../components/client/form";

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const [client] = React.useState<IClient>();

  const newClient = async (client: IClient) => {
    try {
      const { id } = await createClient(client);
      history.push(`/clients/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Link to="/clients" component={Button}>
          {i18n.t("Client list")}
        </Link>
        <div>{i18n.t("New client")}</div>
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

            newClient({
              preferred_name: target.preferred_name.value,
              official_identifier: target.official_identifier.value,
              official_identifier_type: target.official_identifier_type.value,
              contact_number: target.contact_number.value,
              contact_email: target.contact_email.value,
              name: target.name.value,
            } as IClient);
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
              <Typography variant="h6">{i18n.t("New client")}</Typography>
            </Grid>
            <Grid item>
              <MoreMenu>
                <MenuItem
                  onClick={() => {
                    history.push(`/clients`);
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
                startIcon={<PersonAddIcon />}
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
