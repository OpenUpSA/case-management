import React from "react";
import { useHistory, Prompt } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
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
import CircularProgress from "@mui/material/CircularProgress";

import ClientForm from "../../components/client/form";
import SnackbarAlert from "../../components/general/snackBar";

const Page = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const classes = useStyles();
  const [client] = React.useState<IClient>();
  const [changed, setChanged] = React.useState<boolean>(false);

  const [nameError, setNameError] = React.useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] =
    React.useState<boolean>(false);
  const [phoneErrorMessage, setPhoneErrorMessage] =
    React.useState<boolean>(false);
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

  const newClient = async (client: IClient) => {
    try {
      setIsLoading(true);
      const { id, name, contact_email, contact_number } = await createClient(
        client
      );
      setIsLoading(false);
      if (typeof name === "object") {
        setNameError(true);
        setEmailErrorMessage(false);
        setPhoneErrorMessage(false);
        return false;
      } else if (typeof contact_email === "object") {
        setEmailErrorMessage(true);
        setPhoneErrorMessage(false);
        setNameError(false);
        return false;
      } else if (typeof contact_number === "object") {
        setPhoneErrorMessage(true);
        setEmailErrorMessage(false);
        setNameError(false);
        return false;
      } else {
        setNameError(false);
        setEmailErrorMessage(false);
        setPhoneErrorMessage(false);
      }

      id &&
        history.push({
          pathname: `/clients/${id}/cases`,
          state: {
            open: true,
            message: "New client created",
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
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <Button onClick={() => history.push("/clients")}>
          {i18n.t("Client list")}
        </Button>
        <div>{i18n.t("New client")}</div>
      </Breadcrumbs>
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
              name: { value: string };
            };

            newClient({
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
            <Grid
              //style={{ position: "relative" }}
              item
              className={classes.zeroWidthOnMobile}
            >
              <Button
                className={classes.canBeFab}
                color="primary"
                variant="contained"
                disabled={isLoading}
                startIcon={<PersonAddIcon />}
                type="submit"
                onClick={() => setChanged(false)}
              >
                {i18n.t("Save client")}
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
          <ClientForm
            emailErrorMessage={emailErrorMessage}
            phoneErrorMessage={phoneErrorMessage}
            nameError={nameError}
            client={client}
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
          message={"New client failed"}
          severity={"error"}
        />
      )}
    </Layout>
  );
};

export default Page;
