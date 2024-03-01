import { Grid, MenuItem, Select } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { ILegalCaseReferral, ILegalCase } from "../../types";
import { useStyles } from "../../utils";

type Props = {
  legalCaseReferral?: ILegalCaseReferral;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [legalCaseReferral, setLegalCaseRefferal] =
    useState<ILegalCaseReferral>({
      referred_to: "",
      referral_date: "",
      reference_number: "",
      details: "",
      legal_case: -1
    });

  useEffect(() => {
    if (props.legalCaseReferral) {
      setLegalCaseRefferal(props.legalCaseReferral);
    }
  }, [props.legalCaseReferral]);

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
              value={legalCaseReferral?.referred_to}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLegalCaseRefferal((legalCaseReferral) => ({
                  ...legalCaseReferral,
                  referred_to: e.target.value,
                }));
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
              value={legalCaseReferral.reference_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLegalCaseRefferal((legalCaseReferral) => ({
                  ...legalCaseReferral,
                  reference_number: e.target.value,
                }));
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
              value={legalCaseReferral.referral_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLegalCaseRefferal((legalCaseReferral) => ({
                  ...legalCaseReferral,
                  referral_date: e.target.value,
                }));
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
              value={legalCaseReferral.details}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLegalCaseRefferal((legalCaseReferral) => ({
                  ...legalCaseReferral,
                  details: e.target.value,
                }));
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
