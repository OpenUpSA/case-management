import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IClient } from "../../types";

type Props = {
  client: IClient;
  readOnly: boolean;
  detailedView: boolean;
};

const Component = (props: Props) => {
  const [client, setClient] = useState<IClient>({
    preferred_name: "",
    official_identifier: "",
    official_identifier_type: "",
    contact_number: "",
    contact_email: "",
    name: "",
  });

  useEffect(() => {
    setClient(props.client);
  }, [props.client]);

  return (
    <div>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item xs={12} md={props.detailedView ? 4 : 8}>
          <TextField
            id="preferred_name"
            label={i18n.t("Preferred name")}
            value={client.preferred_name}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setClient((client) => ({
                ...client,
                preferred_name: e.target.value,
              }));
            }}
          />
        </Grid>
        {props.detailedView ? (
          <Grid item xs={12} md={4}>
            <TextField
              id="name"
              label={i18n.t("Full name")}
              value={client.name}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: props.readOnly }}
              variant={props.readOnly ? "filled" : "outlined"}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  name: e.target.value,
                }));
              }}
            />
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12} md={4}>
          <TextField
            id="official_identifier"
            label={i18n.t("Identity number")}
            value={client.official_identifier}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setClient((client) => ({
                ...client,
                official_identifier: e.target.value,
              }));
            }}
          />
        </Grid>
        {props.detailedView ? (
          <Grid item xs={12} md={4}>
            <TextField
              id="official_identifier_type"
              label={i18n.t("Identity number type")}
              value={client.official_identifier_type}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: props.readOnly }}
              variant={props.readOnly ? "filled" : "outlined"}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setClient((client) => ({
                  ...client,
                  official_identifier_type: e.target.value,
                }));
              }}
            />
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12} md={4}>
          <TextField
            id="contact_number"
            label={i18n.t("Contact number")}
            value={client.contact_number}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setClient((client) => ({
                ...client,
                contact_number: e.target.value,
              }));
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="contact_email"
            label={i18n.t("Contact email")}
            value={client.contact_email}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setClient((client) => ({
                ...client,
                contact_email: e.target.value,
              }));
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
  detailedView: false,
};

export default Component;
