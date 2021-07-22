import { FormControl, Grid, Input, InputLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { ILegalCase } from "../../types";
import { format } from "date-fns";
import { useStyles } from "../../utils";

type Props = {
  legalCase?: ILegalCase;
  readOnly: boolean;
  detailedView: boolean;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [legalCase, setLegalCase] = useState<ILegalCase>({
    case_number: "",
    state: "",
    case_types: [],
    case_offices: [],
    client: 0,
  });

  useEffect(() => {
    if (props.legalCase) {
      setLegalCase(props.legalCase);
    }
  }, [props.legalCase]);

  return (
    <div>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="case_number"
              shrink={true}
            >
              {i18n.t("Case number")}:
            </InputLabel>
            <Input
              id="case_number"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={legalCase.case_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLegalCase((legalCase) => ({
                  ...legalCase,
                  case_number: e.target.value,
                }));
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="state"
              shrink={true}
            >
              {i18n.t("Status")}:
            </InputLabel>
            <Input
              id="state"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={legalCase.state}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLegalCase((legalCase) => ({
                  ...legalCase,
                  state: e.target.value,
                }));
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="created_at"
              shrink={true}
            >
              {i18n.t("Date added")}:
            </InputLabel>
            <Input
              id="created_at"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={format(
                new Date(legalCase.created_at || new Date().toISOString()),
                "MM/dd/yyyy (h:ma)"
              )}
            />
          </FormControl>
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
