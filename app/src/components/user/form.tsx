import { Grid } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IUser } from "../../types";
import { useStyles } from "../../utils";

type Props = {
  user?: IUser;
  readOnly: boolean;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [user, setUser] = useState<IUser>({
    name: "",
    membership_number: "",
    contact_number: "",
    email: "",
  });

  useEffect(() => {
    if (props.user) {
      setUser(props.user);
    }
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
              }}
            />
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
