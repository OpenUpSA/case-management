import { Grid, MenuItem, Select } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IClient } from "../../types";
import { useStyles } from "../../utils";

//TODO: Get from API
const OfficialIdentifierTypes = ["National", "Passport"];

type Props = {
  client?: IClient;
  readOnly: boolean;
  detailedView: boolean;
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
              }}
            />
          </FormControl>
        </Grid>
        {props.detailedView ? (
          <Grid item xs={12} md={8}>
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
                disabled={props.readOnly}
                className={classes.textField}
                aria-describedby="my-helper-text"
                value={client.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    name: e.target.value,
                  }));
                }}
              />
            </FormControl>
          </Grid>
        ) : (
          ""
        )}
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
              aria-describedby="my-helper-text"
              value={client.official_identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  official_identifier: e.target.value,
                }));
              }}
            />
          </FormControl>
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
                id="official_identifier_type_select"
                disabled={props.readOnly}
                className={classes.select}
                disableUnderline
                onChange={(e: React.ChangeEvent<{ value: any }>) => {
                  setClient((client) => ({
                    ...client,
                    official_identifier_type: e.target.value,
                  }));
                }}
                input={<Input id="select-multiple-chip" />}
                value={client.official_identifier_type}
                renderValue={() => {
                  return OfficialIdentifierTypes.filter(
                    (officialIdentifierType) =>
                      client.official_identifier_type === officialIdentifierType
                  ).join(", ");
                }}
              >
                {OfficialIdentifierTypes?.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
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
              aria-describedby="my-helper-text"
              value={client.contact_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  contact_number: e.target.value,
                }));
              }}
            />
          </FormControl>
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
                aria-describedby="my-helper-text"
                value={client.contact_email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setClient((client) => ({
                    ...client,
                    contact_email: e.target.value,
                  }));
                }}
              />
            </FormControl>
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
