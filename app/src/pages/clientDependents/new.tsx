import React, { useEffect } from "react";
import { useHistory, Prompt, useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MoreMenu from "../../components/moreMenu";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { createClientDependent, getClient } from "../../api";
import { IClientDependent, IClient } from "../../types";
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
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@mui/material/CircularProgress";

import ClientDependentForm from "../../components/clientDependent/form";
import SnackbarAlert from "../../components/general/snackBar";

type RouteParams = {
  id: string;
};

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const [clientDependent] = React.useState<IClientDependent>();
  const [changed, setChanged] = React.useState<boolean>(false);

  const [lastNameError, setLastNameError] = React.useState<boolean>(false);
  const [firstNamesError, setFirstNamesError] = React.useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] =
    React.useState<boolean>(false);
  const [phoneErrorMessage, setPhoneErrorMessage] =
    React.useState<boolean>(false);
  const [nonFieldError, setNonFieldError] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar(false);
      }, 6000);
    };
    resetState();
  }, [showSnackbar]);

  const params = useParams<RouteParams>();
  const clientId = parseInt(params.id);

  const [client, setClient] = React.useState<IClient>();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const dataClient = await getClient(clientId);
        setClient(dataClient);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [clientId]);

  const newClientDependent = async (clientDependent: IClientDependent) => {
    try {
      setIsLoading(true);
      const {
        id,
        first_names,
        last_name,
        contact_email,
        contact_number,
        non_field_errors,
      } = await createClientDependent({
        ...clientDependent,
        client: clientId,
      });
      setIsLoading(false);
      setFirstNamesError(false);
      setLastNameError(false);
      setEmailErrorMessage(false);
      setPhoneErrorMessage(false);
      setNonFieldError(false);

      if (typeof first_names === "object") {
        setFirstNamesError(true);
      }

      if (typeof last_name === "object") {
        setLastNameError(true);
      }

      if (typeof contact_email === "object") {
        setEmailErrorMessage(true);
        return false;
      }

      if (typeof contact_number === "object") {
        setPhoneErrorMessage(true);
      }

      if (typeof non_field_errors === "object") {
        setNonFieldError(true);
      }

      id &&
        history.push({
          pathname: `/dependents/${id}`,
          state: {
            open: true,
            message: "New dependent created",
            severity: "success",
          },
        });
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar(true);
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
        <Button
          disabled={client ? false : true}
          onClick={() => history.push(`/clients/${client?.id}/cases`)}
        >
          Client: {client ? client.preferred_name : ""}
        </Button>
        <div>{i18n.t("New client dependent")}</div>
      </Breadcrumbs>
        </Container>
      </header>
      <Container maxWidth="md">
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              preferred_name: { value: string };
              official_identifier: { value: string | null };
              official_identifier_type: { value: string | null };
              contact_number: { value: string };
              contact_email: { value: string };
              first_names: { value: string };
              last_name: { value: string };
              relationship_to_client: { value: string };
            };

            newClientDependent({
              preferred_name: target.preferred_name.value,
              official_identifier:
                target.official_identifier.value!.length > 0
                  ? target.official_identifier.value
                  : null,
              official_identifier_type:
                target.official_identifier_type.value!.length > 0
                  ? target.official_identifier_type.value
                  : null,
              contact_number: target.contact_number.value,
              contact_email: target.contact_email.value,
              first_names: target.first_names.value,
              last_name: target.last_name.value,
              relationship_to_client: target.relationship_to_client.value,
            } as IClientDependent);
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
              <EscalatorWarningIcon
                color="primary"
                style={{ display: "flex" }}
              />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Typography variant="h6">
                {i18n.t("New client dependent")}
              </Typography>
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
            <Grid
              //style={{ position: "relative" }}
              item
              className={classes.zeroWidthOnMobile}
            >
              <Button
                disableElevation={true}
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                disabled={isLoading}
                startIcon={<PersonAddIcon />}
                type="submit"
                onClick={() => setChanged(false)}
              >
                {i18n.t("Save dependent")}
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      zIndex: 10000,
                      left: "50%",
                    }}
                  />
                )}
              </Button>
            </Grid>
          </Grid>
          <Prompt
            when={changed}
            message={() =>
              "You have already made some changes\nAre you sure you want to leave?"
            }
          />
          <ClientDependentForm
            emailErrorMessage={emailErrorMessage}
            phoneErrorMessage={phoneErrorMessage}
            firstNamesError={firstNamesError}
            lastNameError={lastNameError}
            nonFieldError={nonFieldError}
            clientDependent={clientDependent}
            readOnly={false}
            detailedView={true}
            changed={changed}
            setChanged={setChanged}
          />
        </form>
      </Container>
      {showSnackbar && (
        <SnackbarAlert
          open={showSnackbar}
          message={"New dependent failed"}
          severity={"error"}
        />
      )}
    </Layout>
  );
};

export default Page;
