import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Hidden,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputLabel,
  Select,
  Input,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { format } from "date-fns";
import { getClients } from "../../api";
import { ILegalCase, IClient, ICaseType } from "../../types";
import { CaseTypesContext } from "../../contexts/caseTypesContext";

type Props = {
  legalCases: ILegalCase[];
  standalone: boolean;
};

const Component = (props: Props) => {
  const history = useHistory();
  const classes = useStyles();
  const [contextCaseTypes] = useContext(CaseTypesContext);
  const [clients, setClients] = React.useState<IClient[]>();
  const [filteredLegalCases, setFilteredLegalCases] =
    React.useState<ILegalCase[]>();
  const [filterLegalCasesValue, setFilterLegalCasesValue] =
    React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const filterKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    filterLegalCases();
  };

  const filterLegalCases = () => {
    if (filterLegalCasesValue) {
      const rightCaseType: ICaseType[] | undefined = contextCaseTypes?.filter(
        (el1: ICaseType) =>
          el1.title.toLowerCase().includes(filterLegalCasesValue.toLowerCase())
      );

      let stringFilter: ILegalCase[] = props.legalCases?.filter((legalCase) => {
        return (
          legalCase.case_number
            .toLowerCase()
            .includes(filterLegalCasesValue.toLowerCase()) ||
          legalCase.state
            .toLowerCase()
            .includes(filterLegalCasesValue.toLowerCase())
        );
      });

      let numberArrayFilter = (arr_lc: ILegalCase[], arr_ct: ICaseType[]) => {
        let result: ILegalCase[] = [];
        for (let i = 0; i < arr_lc.length; i++) {
          for (let j = 0; j < arr_ct?.length; j++) {
            if (Number(arr_lc[i].case_types.join()) === arr_ct[j].id) {
              result.push(arr_lc[i]);
            }
          }
        }
        return result;
      };

      let combinedFilter: ILegalCase[] = [
        ...stringFilter,
        ...numberArrayFilter(props.legalCases, rightCaseType!),
      ];
      let uniqueCombinedFilter: ILegalCase[] = combinedFilter.filter(
        (item, pos) => combinedFilter.indexOf(item) === pos
      );
      setFilteredLegalCases(uniqueCombinedFilter);
    } else {
      setFilteredLegalCases(props.legalCases);
    }
  };

  useEffect(() => {
    if (
      props.legalCases.length > 0 &&
      typeof filteredLegalCases === "undefined"
    ) {
      filterLegalCases();
    }
  });

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const dataClients = await getClients();
        setClients(dataClients);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item style={{ flexGrow: 1 }}>
          <strong>
            {filteredLegalCases ? filteredLegalCases.length : "0"}{" "}
            {i18n.t("Cases")}
          </strong>
        </Grid>
        <Grid item>
          <InputLabel className={classes.plainLabel} htmlFor="sort_table">
            {i18n.t("Sort")}:
          </InputLabel>
        </Grid>
        <Grid item>
          <Select
            id="sort_table"
            className={classes.select}
            disableUnderline
            input={<Input />}
            value="alphabetical"
          >
            <MenuItem key="alphabetical" value="alphabetical">
              {i18n.t("Alphabetical")}
            </MenuItem>
          </Select>
        </Grid>
        <Grid item md={12}>
          <Input
            id="table_search"
            fullWidth
            placeholder={i18n.t("Enter a case number, status, or type...")}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon color="primary" />
                </IconButton>
              </InputAdornment>
            }
            disableUnderline={true}
            className={classes.textField}
            aria-describedby="my-helper-text"
            value={filterLegalCasesValue}
            onChange={(e) => setFilterLegalCasesValue(e.target.value)}
            onKeyUp={filterKeyUp}
          />
        </Grid>
      </Grid>

      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
              {props.standalone ? (
                <TableCell className={classes.tableHeadCell}>
                  {i18n.t("Client")}
                </TableCell>
              ) : null}
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Case type")}
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                {i18n.t("Case number")}
              </TableCell>
              <Hidden mdDown>
                <TableCell className={classes.tableHeadCell}>
                  {i18n.t("Last updated")}
                </TableCell>
              </Hidden>
              <TableCell className={classes.tableHeadCell} colSpan={2}>
                {i18n.t("Status")}
              </TableCell>
            </TableRow>
          </TableHead>
          {filteredLegalCases && filteredLegalCases.length > 0 ? (
            <TableBody>
              {filteredLegalCases.map((legalCase) => (
                <TableRow
                  key={legalCase.id}
                  className={classes.tableBodyRow}
                  onClick={() => {
                    history.push(`/cases/${legalCase.id}`);
                  }}
                >
                  {props.standalone ? (
                    <TableCell className={classes.tableBodyCell}>
                      {clients
                        ?.filter((client) => client.id === legalCase.client)
                        .map((client) => client.preferred_name)}
                    </TableCell>
                  ) : null}
                  <TableCell className={classes.tableBodyCell}>
                    {contextCaseTypes
                      ?.filter(
                        (caseType: ICaseType) =>
                          legalCase.case_types.indexOf(caseType.id) > -1
                      )
                      .map((caseType: ICaseType) => caseType.title)
                      .join(", ")}
                  </TableCell>
                  <TableCell className={classes.tableBodyCell}>
                    {legalCase.case_number}
                  </TableCell>
                  <Hidden mdDown>
                    <TableCell className={classes.tableBodyCell}>
                      {format(
                        new Date(
                          legalCase?.updated_at || new Date().toISOString()
                        ),
                        "dd/MM/yyyy (h:ma)"
                      )}
                    </TableCell>
                  </Hidden>
                  <TableCell className={classes.tableBodyCell}>
                    {legalCase.state}
                  </TableCell>
                  <TableCell className={classes.tableBodyCell} align="right">
                    <ArrowRightAltIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow
                className={`${classes.tableBodyRow} ${classes.tableBodyRowEmpty}`}
              >
                <TableCell
                  colSpan={5}
                  className={classes.tableBodyCell}
                ></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {isLoading && (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
};

Component.defaultProps = {
  standalone: true,
};

export default Component;
