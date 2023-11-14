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
import FormHelperText from "@mui/material/FormHelperText";

import { IClient, IClientDependent, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import { format } from "date-fns";
import i18n from "../../i18n";

import ReusableInput from "./reusableInput";
import ReusableSelect from "./reusableSelect";
import { updateClientDependent, getClientDependent } from "../../api";
import { constants } from "../../contexts/dropDownConstants";
import { LanguagesContext } from "../../contexts/languagesContext";
import SnackbarAlert from "../../components/general/snackBar";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  client?: IClient;
  clientDependent?: IClientDependent;
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
  const clientDependentId = parseInt(params.id);

  const [contextLanguages] = useContext(LanguagesContext);

  const [clientDependent, setClientDependent] = useState<IClientDependent>({
    preferred_name: "",
    home_language: "",
    official_identifier: "",
    official_identifier_type: "",
    contact_number: "",
    contact_email: "",
    first_names: "",
    last_name: "",
    gender: "",
    alternative_contact_email: "",
    alternative_contact_number: "",
    date_of_birth: "",
    country_of_birth: "",
    nationality: "",
    details: "",
    created_at: new Date(),
    relationship_to_client: "",
  });

  const [phoneErrorMessage, setPhoneErrorMessage] = useState<boolean>(false);
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
      if (props.clientDependent) {
        setClientDependent(props.clientDependent);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  }, [props.clientDependent]);

  const editClientDependentInput = async () => {
    try {
      setIsLoading(true);
      const updatedClientDependent: IClientDependent = {
        ...clientDependent,
        id: clientDependentId,
      };
      const {
        id,
        contact_number,
        contact_email,
        alternative_contact_number,
        alternative_contact_email,
      } = await updateClientDependent(updatedClientDependent);
      setIsLoading(false);

      if (typeof contact_number === "object") {
        setPhoneErrorMessage(true);
        setEmailErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else if (typeof contact_email === "object") {
        setEmailErrorMessage(true);
        setPhoneErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else if (typeof alternative_contact_number === "object") {
        setAltPhoneErrorMessage(true);
        setEmailErrorMessage(false);
        setPhoneErrorMessage(false);
        setAltEmailErrorMessage(false);
        return false;
      } else if (typeof alternative_contact_email === "object") {
        setAltEmailErrorMessage(true);
        setEmailErrorMessage(false);
        setPhoneErrorMessage(false);
        setAltPhoneErrorMessage(false);
        return false;
      } else {
        setPhoneErrorMessage(false);
        setEmailErrorMessage(false);
        setAltEmailErrorMessage(false);
        setAltPhoneErrorMessage(false);
      }

      if (id) {
        setShowSnackbar({
          open: true,
          message: "Dependent edit successful",
          severity: "success",
        });
        setClientDependent(await getClientDependent(id));
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Dependent edit failed",
        severity: "error",
      });
    }
  };

  const editClientDependentSelect = async (arg: any, arg2: any) => {
    try {
      setIsLoading(true);
      const updatedClientDependent: any = {
        ...clientDependent,
        [arg2]: arg,
        id: clientDependentId,
      };
      const { id } = await updateClientDependent(updatedClientDependent);
      setIsLoading(false);
      if (id) {
        setShowSnackbar({
          open: true,
          message: "Client edit successful",
          severity: "success",
        });
        setClientDependent(await getClientDependent(id));
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
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Relationship to client"}
            value={clientDependent?.relationship_to_client}
            menuItems={constants.relationshipToClient}
            inputName={"relationship_to_client"}
            setClientDependent={setClientDependent}
            editClientDependentSelect={editClientDependentSelect}
          />
        </Grid>

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
            value={clientDependent?.first_names}
            setClientDependent={setClientDependent}
            prevValue={props.clientDependent?.first_names!}
            editClientDependentInput={editClientDependentInput}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReusableInput
            inputName={"last_name"}
            title={"Last name"}
            value={clientDependent?.last_name}
            setClientDependent={setClientDependent}
            prevValue={props.clientDependent?.last_name!}
            editClientDependentInput={editClientDependentInput}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableInput
            inputName={"preferred_name"}
            title={"Preferred name"}
            value={clientDependent?.preferred_name}
            setClientDependent={setClientDependent}
            prevValue={props.clientDependent?.preferred_name!}
            editClientDependentInput={editClientDependentInput}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Gender"}
            value={clientDependent?.gender}
            menuItems={constants.genders}
            inputName={"gender"}
            setClientDependent={setClientDependent}
            editClientDependentSelect={editClientDependentSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Nationality"}
            value={clientDependent?.nationality}
            menuItems={constants.countries}
            inputName={"nationality"}
            setClientDependent={setClientDependent}
            editClientDependentSelect={editClientDependentSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Country of birth"}
            value={clientDependent?.country_of_birth}
            menuItems={constants.countries}
            inputName={"country_of_birth"}
            setClientDependent={setClientDependent}
            editClientDependentSelect={editClientDependentSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableSelect
            title={"Identification type"}
            value={clientDependent?.official_identifier_type}
            menuItems={constants.officialIdentifierTypes}
            inputName={"official_identifier_type"}
            setClientDependent={setClientDependent}
            editClientDependentSelect={editClientDependentSelect}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableInput
            inputName={"official_identifier"}
            title={"Identification number"}
            value={clientDependent?.official_identifier}
            setClientDependent={setClientDependent}
            prevValue={props.clientDependent?.official_identifier!}
            editClientDependentInput={editClientDependentInput}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReusableInput
            inputName={"date_of_birth"}
            title={"Date of birth"}
            value={clientDependent?.date_of_birth}
            setClientDependent={setClientDependent}
            prevValue={props.clientDependent?.date_of_birth!}
            editClientDependentInput={editClientDependentInput}
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
              value={clientDependent?.contact_number}
              setClientDependent={setClientDependent}
              prevValue={props.clientDependent?.contact_number!}
              editClientDependentInput={editClientDependentInput}
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
              value={clientDependent?.contact_email}
              setClientDependent={setClientDependent}
              prevValue={props.clientDependent?.contact_email!}
              editClientDependentInput={editClientDependentInput}
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
              value={clientDependent?.alternative_contact_number}
              setClientDependent={setClientDependent}
              prevValue={props.clientDependent?.alternative_contact_number!}
              editClientDependentInput={editClientDependentInput}
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
              value={clientDependent?.alternative_contact_email}
              setClientDependent={setClientDependent}
              prevValue={props.clientDependent?.alternative_contact_email!}
              editClientDependentInput={editClientDependentInput}
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
              value={clientDependent?.home_language}
              menuItems={contextLanguages?.map(({ id, label }: any) => [
                id,
                label,
              ])}
              inputName={"home_language"}
              setClientDependent={setClientDependent}
              editClientDependentSelect={editClientDependentSelect}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReusableSelect
              title={"Preferred contact method"}
              value={clientDependent?.preferred_contact_method}
              menuItems={constants.preferredContactMethods}
              inputName={"preferred_contact_method"}
              setClientDependent={setClientDependent}
              editClientDependentSelect={editClientDependentSelect}
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
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.clientDetailLabel}
                htmlFor="date"
                shrink={true}
              >
                {i18n.t("Dependent added")}:
              </InputLabel>
              <Input
                id="date"
                disableUnderline={true}
                disabled={true}
                className={classes.clientDetailInput}
                aria-describedby="date input"
                value={format(
                  new Date(clientDependent?.created_at!),
                  "MMM dd, yyyy"
                )}
                endAdornment={
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" style={{ color: "#c2c2c2" }} />
                  </InputAdornment>
                }
              />
            </FormControl>
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
