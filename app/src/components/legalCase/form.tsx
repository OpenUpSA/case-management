import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { ICaseType, ICaseOffice, ILegalCase } from "../../types";
import { format } from "date-fns";
import { useStyles } from "casemgtstyleutils";
import { getCaseTypes, getCaseOffices } from "casemgtapi";
import React from "react";

//TODO: Get from API
const LegalCaseStates = [
  "Opened",
  "InProgress",
  "Hanging",
  "Pending",
  "Referred",
  "Resolved",
  "Escalated",
];

type Props = {
  legalCase?: ILegalCase;
  readOnly: boolean;
  detailedView: boolean;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [caseOffices, setCaseOffices] = React.useState<ICaseOffice[]>();
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
    async function fetchData() {
      const dataCaseTypes = await getCaseTypes();
      const dataCaseOffices = await getCaseOffices();
      setCaseTypes(dataCaseTypes);
      setCaseOffices(dataCaseOffices);
    }
    fetchData();
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
          <input type="hidden" id="state" value={legalCase.state} />
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="case_state_select"
              shrink={true}
            >
              {i18n.t("Status")}:
            </InputLabel>
            <Select
              id="case_state_select"
              disabled={props.readOnly}
              className={classes.select}
              disableUnderline
              onChange={(e: React.ChangeEvent<{ value: any }>) => {
                setLegalCase((legalCase) => ({
                  ...legalCase,
                  state: e.target.value,
                }));
              }}
              input={<Input id="select-multiple-chip" />}
              value={legalCase.state}
              renderValue={() => {
                return LegalCaseStates.filter(
                  (caseState) => legalCase.state === caseState
                ).join(", ");
              }}
            >
              {LegalCaseStates?.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
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
              disabled={true}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={format(
                new Date(legalCase.created_at || new Date().toISOString()),
                "MM/dd/yyyy (h:ma)"
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <input
            type="hidden"
            id="case_types"
            value={legalCase.case_types.join(",")}
          />
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="case_types_select"
              shrink={true}
            >
              {i18n.t("Case type")}:
            </InputLabel>
            <Select
              id="case_types_select"
              disabled={props.readOnly}
              className={classes.select}
              disableUnderline
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setLegalCase((legalCase) => ({
                  ...legalCase,
                  case_types: [e.target.value as number],
                }));
              }}
              input={<Input id="select-multiple-chip" />}
              value={legalCase.case_types}
              renderValue={() => {
                return caseTypes
                  ?.filter(
                    (caseType) => legalCase.case_types.indexOf(caseType.id) > -1
                  )
                  .map((caseType) => caseType.title)
                  .join(", ");
              }}
            >
              {caseTypes?.map(({ id, title }) => (
                <MenuItem key={id} value={id}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <input
            type="hidden"
            id="case_offices"
            value={legalCase.case_offices.join(",")}
          />
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="case_offices_select"
              shrink={true}
            >
              {i18n.t("Case office")}:
            </InputLabel>
            <Select
              id="case_offices_select"
              disabled={props.readOnly}
              className={classes.select}
              disableUnderline
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setLegalCase((legalCase) => ({
                  ...legalCase,
                  case_offices: [e.target.value as number],
                }));
              }}
              input={<Input id="select-multiple-chip" />}
              value={legalCase.case_offices}
              renderValue={() => {
                return caseOffices
                  ?.filter(
                    (caseOffice) => legalCase.case_offices.indexOf(caseOffice.id) > -1
                  )
                  .map((caseOffice) => caseOffice.name)
                  .join(", ");
              }}
            >
              {caseOffices?.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
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
