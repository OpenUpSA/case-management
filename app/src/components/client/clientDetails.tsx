import { Grid, MenuItem, Select, Typography } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import FormHelperText from "@material-ui/core/FormHelperText";

import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IClient } from "../../types";
import { useStyles } from "../../utils";

//TODO: Get from API
const OfficialIdentifierTypes = ["National", "Passport"];

type Props = {
  client?: IClient;
  readOnly: boolean;
  phoneErrorMessage?: boolean;
  emailErrorMessage?: boolean;
  idErrorMessage?: boolean;
  nameError?: boolean;
  prefNameError?: boolean;
  idTypeErrorMessage?: boolean;
  changed?: boolean;
  setChanged?: any;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [client, setClient] = useState<IClient>({
    preferred_name: "",
    official_identifier: "",
    official_identifier_type: "",
    contact_number: "",
    contact_email: "",
    name: "",
  });
  const [showDetailedInfo, setShowDetailedInfo] = useState<boolean>(false);

  const [showFullName, setShowFullName] = useState<boolean>(false);

  useEffect(() => {
    if (props.client) {
      setClient(props.client);
    }
  }, [props.client]);

  return (
    <div>
      <Grid
        className={classes.pageBar}
        style={{ marginBottom: 5 }}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="name"
              shrink={true}
            >
              {i18n.t("Full name")}:
            </InputLabel>
            <Input
              id="name"
              disableUnderline={true}
              disabled={false}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={client.name}
              onClick={() => setShowFullName((prevState)=>!prevState)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  name: e.target.value,
                }));
                props.setChanged(true);
              }}
              endAdornment={
                showFullName ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowFullName((prevState)=> !prevState);
                      }}
                      aria-label="delete icon"
                      edge="end"
                    >
                      {<DeleteIcon sx={{ color: "#a9a9a9" }} />}
                    </IconButton>

                    <IconButton
                      style={{
                        backgroundColor: "#00d97e",
                        borderRadius: 5,
                        marginLeft: 12,
                      }}
                      aria-label="check icon"
                      onClick={() => {}}
                      edge="end"
                    >
                      {<CheckIcon style={{ color: "#fff" }} />}
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ""
                )
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="preferred_name"
              shrink={true}
            >
              {i18n.t("Preferred name")}:
            </InputLabel>
            <Input
              id="preferred_name"
              autoFocus
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={client.preferred_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  preferred_name: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="contact_number"
              shrink={true}
            >
              {i18n.t("Contact number")}:
            </InputLabel>
            <Input
              id="contact_number"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={client.contact_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  contact_number: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="contact_email"
              shrink={true}
            >
              {i18n.t("Email address")}:
            </InputLabel>
            <Input
              id="contact_email"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={client.contact_email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  contact_email: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="name"
              shrink={true}
            >
              {i18n.t("Physical address")}:
            </InputLabel>
            <Input
              id="name"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={client.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  name: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="official_identifier"
              shrink={true}
            >
              {i18n.t("Identification number")}:
            </InputLabel>
            <Input
              id="official_identifier"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={client.official_identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  official_identifier: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
      </Grid>

      {showDetailedInfo ? (
        ""
      ) : (
        <Typography
          onClick={() => {
            setShowDetailedInfo(true);
          }}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            marginBottom: 5,
          }}
        >
          Show detailed client information
        </Typography>
      )}

      {showDetailedInfo ? (
        <Grid
          className={classes.pageBar}
          style={{ marginBottom: 5 }}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="official_identifier_type_select"
                shrink={true}
              >
                {i18n.t("Identification type")}:
              </InputLabel>
              <Input
                id="name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="official_identifier_type_select"
                shrink={true}
              >
                {i18n.t("Client added")}:
              </InputLabel>
              <Input
                id="name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="name"
                shrink={true}
              >
                {i18n.t("Gender")}:
              </InputLabel>
              <Input
                id="name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="name"
                shrink={true}
              >
                {i18n.t("Preferred language")}:
              </InputLabel>
              <Input
                id="name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="name"
                shrink={true}
              >
                {i18n.t("Marital status")}:
              </InputLabel>
              <Input
                id="name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="name"
                shrink={true}
              >
                {i18n.t("Next of kin")}:
              </InputLabel>
              <Input
                id="name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="contact_number"
                shrink={true}
              >
                {i18n.t("Next of kin contact number")}:
              </InputLabel>
              <Input
                id="contact_number"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.contact_number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    contact_number: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="contact_number"
                shrink={true}
              >
                {i18n.t("Number of dependants")}:
              </InputLabel>
              <Input
                id="contact_number"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.contact_number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    contact_number: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      ) : (
        ""
      )}

      {showDetailedInfo ? (
        <Typography
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => {
            setShowDetailedInfo(false);
          }}
        >
          Hide detailed client information
        </Typography>
      ) : (
        ""
      )}
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
};

export default Component;
