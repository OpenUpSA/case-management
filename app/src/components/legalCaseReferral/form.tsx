import { Grid } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import i18n from "../../i18n";
import { ILegalCaseReferral } from "../../types";
import { useStyles } from "../../utils";

type Props = {
  legalCaseReferral: ILegalCaseReferral;
  setLegalCaseReferral: (legalCaseReferral: ILegalCaseReferral) => void;
};

const Component = (props: Props) => {
  const classes = useStyles();

  return (
    <div>
      <Grid
        className={classes.pageBar}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="referred_to"
              shrink={true}
            >
              {i18n.t("Referred to")}:
            </InputLabel>
            <Input
              id="referred_to"
              autoFocus
              disableUnderline={true}
              className={classes.textField}
              aria-describedby="Input referred to"
              value={props.legalCaseReferral.referred_to}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setLegalCaseReferral({
                  ...props.legalCaseReferral,
                  referred_to: e.target.value,
                });
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="reference_number"
              shrink={true}
            >
              {i18n.t("Reference/case number")}:
            </InputLabel>
            <Input
              id="reference_number"
              disableUnderline={true}
              className={classes.textField}
              aria-describedby="Input the reference number"
              value={props.legalCaseReferral.reference_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setLegalCaseReferral({
                  ...props.legalCaseReferral,
                  reference_number: e.target.value,
                });
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="referral_date"
              shrink={true}
            >
              {i18n.t("Referral date")}:
            </InputLabel>
            <Input
              id="referral_date"
              disableUnderline={true}
              className={classes.textField}
              type={"date"}
              aria-describedby="Input the referral date"
              value={props.legalCaseReferral.referral_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setLegalCaseReferral({
                  ...props.legalCaseReferral,
                  referral_date: e.target.value,
                });
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="details"
              shrink={true}
            >
              {i18n.t("Referral details")}:
            </InputLabel>
            <Input
              id="details"
              rows={5}
              multiline
              disableUnderline={true}
              className={classes.textField}
              aria-describedby="input for official identity number"
              value={props.legalCaseReferral.details}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setLegalCaseReferral({
                  ...props.legalCaseReferral,
                  details: e.target.value,
                });
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {};

export default Component;
