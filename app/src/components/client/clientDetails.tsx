import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";

import { Grid, Typography } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import FormHelperText from "@mui/material/FormHelperText";

import { IClient, IClientDependent, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import { format } from "date-fns";
import i18n from "../../i18n";

import ReusableInput from "./reusableInput";
import ReusableSelect from "./reusableSelect";
import {
  updateClient,
  getClient,
  getClientDependentsForClient,
} from "../../api";
import { constants } from "../../contexts/dropDownConstants";
import { LanguagesContext } from "../../contexts/languagesContext";
import SnackbarAlert from "../../components/general/snackBar";
import CircularProgress from "@mui/material/CircularProgress";

import ClientDependentsTable from "../../components/clientDependent/table";

type Props = {
  client?: IClient;
  phoneErrorMessage?: boolean;
  emailErrorMessage?: boolean;
  idErrorMessage?: boolean;
  nameError?: boolean;
  prefNameError?: boolean;
  idTypeErrorMessage?: boolean;
};

type RouteParams = {
  id: string;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const params = useParams<RouteParams>();
  const clientId = parseInt(params.id);

  const [contextLanguages] = useContext(LanguagesContext);

  const [client, setClient] = useState<IClient>({
    preferred_name: "",
    home_language: "",
    official_identifier: "",
    official_identifier_type: "",
    contact_number: "",
    contact_email: "",
    first_names: "",
    last_name: "",
    address: "",
    next_of_kin_name: "",
    next_of_kin_contact_number: "",
    marital_status: "",
    dependents: "",
    gender: "",
    alternative_contact_email: "",
    alternative_contact_number: "",
    date_of_birth: "",
    country_of_birth: "",
    nationality: "",
    created_at: new Date(),
  });

  const [clientDependents, setClientDependents] =
    useState<IClientDependent[]>();

  const [phoneErrorMessage, setPhoneErrorMessage] = useState<boolean>(false);
  const [kinPhoneErrorMessage, setKinPhoneErrorMessage] =
    useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<boolean>(false);
  const [altPhoneErrorMessage, setAltPhoneErrorMessage] =
    useState<boolean>(false);
  const [altEmailErrorMessage, setAltEmailErrorMessage] =
    useState<boolean>(false);

  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    try {
      setIsLoading(true);
      if (props.client) {
        setClient(props.client);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  }, [props.client]);

  const editClientInput = async () => {
    try {
      setIsLoading(true);
      const updatedClient: IClient = {
        ...client,
        id: clientId,
      };
      const {
        id,
        contact_number,
        next_of_kin_contact_number,
        contact_email,
        alternative_contact_number,
        alternative_contact_email,
      } = await updateClient(updatedClient);
      setIsLoading(false);

      if (typeof contact_number === "object") {
        setPhoneErrorMessage(true);
        setKinPhoneErrorMessage(false);
        setEmailErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else if (typeof contact_email === "object") {
        setEmailErrorMessage(true);
        setPhoneErrorMessage(false);
        setKinPhoneErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else if (typeof alternative_contact_number === "object") {
        setAltPhoneErrorMessage(true);
        setEmailErrorMessage(false);
        setPhoneErrorMessage(false);
        setKinPhoneErrorMessage(false);
        setAltEmailErrorMessage(false);
        return false;
      } else if (typeof alternative_contact_email === "object") {
        setAltEmailErrorMessage(true);
        setEmailErrorMessage(false);
        setPhoneErrorMessage(false);
        setKinPhoneErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else if (typeof next_of_kin_contact_number === "object") {
        setKinPhoneErrorMessage(true);
        setPhoneErrorMessage(false);
        setEmailErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else {
        setKinPhoneErrorMessage(false);
        setPhoneErrorMessage(false);
        setEmailErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
      }

      if (id) {
        setShowSnackbar({
          open: true,
          message: "Client edit successful",
          severity: "success",
        });
        setClient(await getClient(id));
        setClientDependents(await getClientDependentsForClient(id));
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Client edit failed",
        severity: "error",
      });
    }
  };

  const editClientSelect = async (arg: any, arg2: any) => {
    try {
      setIsLoading(true);
      const updatedClient: any = {
        ...client,
        [arg2]: arg,
        id: clientId,
      };
      const { id } = await updateClient(updatedClient);
      setIsLoading(false);
      if (id) {
        setShowSnackbar({
          open: true,
          message: "Client edit successful",
          severity: "success",
        });
        setClient(await getClient(id));
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Client edit failed",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Grid
        className={classes.pageBar}
        style={{ marginBottom: 5, position: "relative" }}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        {isLoading && (
          <Grid container justifyContent="center">
            <CircularProgress
              style={{ position: "absolute", top: 70, left: "50%" }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" gap={1}>
            <BadgeIcon color="primary" sx={{ marginTop: "-4px" }} />
            <Typography variant="h6" color="primary">
              Identification
            </Typography>
          </Stack>
          <Divider sx={{ marginTop: 1 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ReusableInput
            inputName={"first_names"}
            title={"First name(s)"}
            value={client?.first_names}
            setClient={setClient}
            prevValue={props.client?.first_names!}
            editClientInput={editClientInput}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReusableInput
            inputName={"last_name"}
            title={"Last name"}
            value={client?.last_name}
            setClient={setClient}
            prevValue={props.client?.last_name!}
            editClientInput={editClientInput}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableInput
            inputName={"preferred_name"}
            title={"Preferred name"}
            value={client?.preferred_name}
            setClient={setClient}
            prevValue={props.client?.preferred_name!}
            editClientInput={editClientInput}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Gender"}
            value={client?.gender}
            menuItems={constants.genders}
            inputName={"gender"}
            setClient={setClient}
            editClientSelect={editClientSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Nationality"}
            value={client?.nationality}
            menuItems={constants.countries}
            inputName={"nationality"}
            setClient={setClient}
            editClientSelect={editClientSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Country of birth"}
            value={client?.country_of_birth}
            menuItems={constants.countries}
            inputName={"country_of_birth"}
            setClient={setClient}
            editClientSelect={editClientSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Identification type"}
            value={client?.official_identifier_type}
            menuItems={constants.officialIdentifierTypes}
            inputName={"official_identifier_type"}
            setClient={setClient}
            editClientSelect={editClientSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableInput
            inputName={"official_identifier"}
            title={"Identification number"}
            value={client?.official_identifier}
            setClient={setClient}
            prevValue={props.client?.official_identifier!}
            editClientInput={editClientInput}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableInput
            inputName={"date_of_birth"}
            title={"Date of birth"}
            value={client?.date_of_birth}
            setClient={setClient}
            prevValue={props.client?.date_of_birth!}
            editClientInput={editClientInput}
            type={"date"}
          />
        </Grid>
      </Grid>

      <>
        <Grid
          className={classes.pageBar}
          style={{ marginBottom: 5 }}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" gap={1}>
              <PhoneEnabledIcon color="primary" />
              <Typography variant="h6" color="primary">
                Contact information
              </Typography>
            </Stack>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReusableInput
              inputName={"contact_number"}
              title={"Contact number"}
              value={client?.contact_number}
              setClient={setClient}
              prevValue={props.client?.contact_number!}
              editClientInput={editClientInput}
            />
            {phoneErrorMessage && (
              <FormHelperText error id="contact_number-text">
                Enter a valid phone number
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <ReusableInput
              inputName={"contact_email"}
              title={"Email address"}
              value={client?.contact_email}
              setClient={setClient}
              prevValue={props.client?.contact_email!}
              editClientInput={editClientInput}
            />
            {emailErrorMessage && (
              <FormHelperText error id="contact-email-text">
                Enter a valid email address
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <ReusableInput
              inputName={"alternative_contact_number"}
              title={"Alternative contact number"}
              value={client?.alternative_contact_number}
              setClient={setClient}
              prevValue={props.client?.alternative_contact_number!}
              editClientInput={editClientInput}
            />
            {altPhoneErrorMessage && (
              <FormHelperText error id="contact_number-text">
                Enter a valid phone number
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <ReusableInput
              inputName={"alternative_contact_email"}
              title={"Alternative email address"}
              value={client?.alternative_contact_email}
              setClient={setClient}
              prevValue={props.client?.alternative_contact_email!}
              editClientInput={editClientInput}
            />
            {altEmailErrorMessage && (
              <FormHelperText error id="contact_number-text">
                Enter a valid email address
              </FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <ReusableSelect
              title={"Preferred language"}
              value={client?.home_language}
              menuItems={contextLanguages?.map(({ id, label }: any) => [
                id,
                label,
              ])}
              inputName={"home_language"}
              setClient={setClient}
              editClientSelect={editClientSelect}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableSelect
              title={"Preferred contact method"}
              value={client?.preferred_contact_method}
              menuItems={constants.preferredContactMethods}
              inputName={"preferred_contact_method"}
              setClient={setClient}
              editClientSelect={editClientSelect}
            />
          </Grid>
        </Grid>
        <Grid
          className={classes.pageBar}
          style={{ marginBottom: 5 }}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">
              Additional information
            </Typography>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableInput
              inputName={"address"}
              title={"Physical address"}
              value={client?.address!}
              setClient={setClient}
              prevValue={props.client?.address!}
              editClientInput={editClientInput}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableSelect
              title={"Marital status"}
              value={client?.marital_status}
              menuItems={constants.maritalStatuses}
              inputName={"marital_status"}
              setClient={setClient}
              editClientSelect={editClientSelect}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableInput
              inputName={"next_of_kin_name"}
              title={"Next of kin name"}
              value={client?.next_of_kin_name}
              setClient={setClient}
              prevValue={props.client?.next_of_kin_name!}
              editClientInput={editClientInput}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableInput
              inputName={"next_of_kin_contact_number"}
              title={"Next of kin contact number"}
              value={client?.next_of_kin_contact_number}
              setClient={setClient}
              prevValue={props.client?.next_of_kin_contact_number!}
              editClientInput={editClientInput}
            />
            {kinPhoneErrorMessage && (
              <FormHelperText error id="contact_number-text">
                Enter a valid phone number
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableInput
              inputName={"dependents"}
              title={"Number of dependants"}
              value={client?.dependents}
              setClient={setClient}
              prevValue={props.client?.dependents!}
              editClientInput={editClientInput}
              type={"number"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.clientDetailLabel}
                htmlFor="date"
                shrink={true}
              >
                {i18n.t("Client added")}:
              </InputLabel>
              <Input
                id="date"
                disableUnderline={true}
                disabled={true}
                className={classes.clientDetailInput}
                aria-describedby="date input"
                value={format(new Date(client?.created_at!), "MMM dd, yyyy")}
                endAdornment={
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" style={{ color: "#c2c2c2" }} />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          className={classes.pageBar}
          style={{ marginBottom: 5 }}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" gap={1}>
              <EscalatorWarningIcon color="primary" />
              <Typography variant="h6" color="primary">
                Dependents
              </Typography>
            </Stack>
            <Divider sx={{ marginTop: 1 }} />
          </Grid>
          <Grid item xs={12} md={12}>
            <ClientDependentsTable
              clientDependents={clientDependents ? clientDependents : []}
              standalone={false}
              clientId={clientId}
            />
          </Grid>
        </Grid>
      </>

      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </>
  );
};

export default Component;
