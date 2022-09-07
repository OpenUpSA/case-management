import { Grid, MenuItem, Select } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IUser, ICaseOffice } from "../../types";
import { useStyles } from "../../utils";
import { getCaseOffices } from "../../api";
import React from "react";

type Props = {
  user?: IUser;
  readOnly: boolean;
  changed?: boolean;
  setChanged?: any;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [caseOffices, setCaseOffices] = React.useState<ICaseOffice[]>();
  const [user, setUser] = useState<IUser>({
    name: "",
    membership_number: "",
    contact_number: "",
    email: "",
    case_office: null,
  });

  useEffect(() => {
    if (props.user) {
      setUser(props.user);
    }
    async function fetchData() {
      const dataCaseOffices = await getCaseOffices();
      setCaseOffices(dataCaseOffices);
    }
    fetchData();
  }, [props.user]);

  return (
    <div>
      <Grid
        className={classes.pageBar}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="name"
              shrink={true}
            >
              {i18n.t("Name")}:
            </InputLabel>
            <Input
              id="name"
              autoFocus
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={user.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUser((user) => ({
                  ...user,
                  name: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="membership_number"
              shrink={true}
            >
              {i18n.t("Membership number")}:
            </InputLabel>
            <Input
              id="membership_number"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={user.membership_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUser((user) => ({
                  ...user,
                  membership_number: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="email"
              shrink={true}
            >
              {i18n.t("Email address")}:
            </InputLabel>
            <Input
              id="email"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={user.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUser((user) => ({
                  ...user,
                  email: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
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
              value={user.contact_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUser((user) => ({
                  ...user,
                  contact_number: e.target.value,
                }));
                props.setChanged(true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <input
            type="hidden"
            id="case_office"
            value={user.case_office || ""}
          />
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="case_office_select"
              shrink={true}
            >
              {i18n.t("Case office")}:
            </InputLabel>
            {caseOffices ? (
              <Select
                id="case_office_select"
                disabled={props.readOnly}
                className={classes.select}
                disableUnderline
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setUser((user) => ({
                    ...user,
                    case_office: e.target.value as number,
                  }));
                  props.setChanged(true);
                }}
                input={<Input id="select-multiple-chip" />}
                value={user.case_office || "0"}
                renderValue={() => {
                  return caseOffices
                    ?.filter((caseOffice) => user.case_office === caseOffice.id)
                    .map((caseOffice) => caseOffice.name)
                    .join(", ");
                }}
              >
                <MenuItem key={0} value={0}>
                  {i18n.t("No case office")}
                </MenuItem>
                {caseOffices?.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            ) : null}
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
};

export default Component;
