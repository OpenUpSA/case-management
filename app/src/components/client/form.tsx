import { Grid, MenuItem, Select } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IClient } from "../../types";
import { useStyles } from "../../utils";
import { constants } from "../../contexts/dropDownConstants";

type Props = {
  client?: IClient;
  readOnly: boolean;
  detailedView: boolean;
  phoneErrorMessage?: boolean;
  emailErrorMessage?: boolean;
  firstNamesError?: boolean;
  lastNameError?: boolean;
  nonFieldError?: boolean;
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
    first_names: "",
    last_name: "",
  });

  useEffect(() => {
    if (props.client) {
      setClient(props.client);
    }
  }, [props.client]);

  return (
    <div>
      <Grid
        className={classes.pageBar}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        {props.detailedView ? (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="first_names"
                shrink={true}
              >
                {i18n.t("First name(s)")}:
              </InputLabel>
              <Input
                id="first_names"
                autoFocus
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="Input your first name(s)"
                value={client.first_names}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    first_names: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
            {props.firstNamesError && (
              <FormHelperText
                error
                id="name_text"
                style={{ marginTop: "-19px" }}
              >
                Enter names
              </FormHelperText>
            )}
          </Grid>
        ) : (
          ""
        )}
        {props.detailedView ? (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="last_name"
                shrink={true}
              >
                {i18n.t("Last name")}:
              </InputLabel>
              <Input
                id="last_name"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="Input your last name"
                value={client.last_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    last_name: e.target.value,
                  }));
                  props.setChanged(true);
                }}
              />
            </FormControl>
            {props.lastNameError && (
              <FormHelperText
                error
                id="name_text"
                style={{ marginTop: "-19px" }}
              >
                Enter a name
              </FormHelperText>
            )}
          </Grid>
        ) : (
          ""
        )}
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
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="input for preferred name"
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
              htmlFor="official_identifier"
              shrink={true}
            >
              {i18n.t("Identity number")}:
            </InputLabel>
            <Input
              id="official_identifier"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="input for official identity number"
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
          {props.nonFieldError && (
            <FormHelperText
              error
              id="non_field_error"
              style={{ marginTop: "-19px" }}
            >
              Enter a unique identity number
            </FormHelperText>
          )}
        </Grid>
        {props.detailedView ? (
          <Grid item xs={12} md={4}>
            <input
              type="hidden"
              id="official_identifier_type"
              value={client.official_identifier_type}
            />
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="official_identifier_type_select"
                shrink={true}
              >
                {i18n.t("Identity number type")}:
              </InputLabel>
              <Select
                style={{ marginBottom: 25 }}
                id="official_identifier_type_select"
                disabled={props.readOnly}
                className={classes.select}
                disableUnderline
                onChange={(e: React.ChangeEvent<{ value: any }>) => {
                  setClient((client) => ({
                    ...client,
                    official_identifier_type: e.target.value,
                  }));
                  props.setChanged(true);
                }}
                input={<Input id="select-multiple-chip" />}
                aria-describedby="dropdown to select identity type"
                value={client.official_identifier_type}
                renderValue={() => {
                  return constants.officialIdentifierTypes
                    .filter(
                      (item) => item[0] === client.official_identifier_type
                    )
                    .map((item) => {
                      return item.length > 1 ? item[1] : item[0];
                    });
                }}
              >
                {constants.officialIdentifierTypes.map((item) => (
                  <MenuItem key={item[0]} value={item[0]}>
                    {item.length > 1 ? item[1] : item[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          ""
        )}
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
              aria-describedby="input for contact number"
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
          {props.phoneErrorMessage && (
            <FormHelperText
              error
              id="contact_number-text"
              style={{ marginTop: "-19px" }}
            >
              Enter a valid phone number
            </FormHelperText>
          )}
        </Grid>
        {props.detailedView ? (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                className={classes.inputLabel}
                htmlFor="contact_email"
                shrink={true}
              >
                {i18n.t("Contact email")}:
              </InputLabel>
              <Input
                id="contact_email"
                disableUnderline={true}
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="input for contact email"
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
            {props.emailErrorMessage && (
              <FormHelperText
                error
                id="contact_email-text"
                style={{ marginTop: "-19px" }}
              >
                Enter a valid Email address
              </FormHelperText>
            )}
          </Grid>
        ) : (
          ""
        )}
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
  detailedView: false,
};

export default Component;
