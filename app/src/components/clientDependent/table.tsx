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
import { getClientDependentsForClient } from "../../api";
import { IClientDependent } from "../../types";
import { CaseTypesContext } from "../../contexts/caseTypesContext";

type Props = {
  clientId: number;
  clientDependents: IClientDependent[];
  standalone: boolean;
};

const Component = (props: Props) => {
  const history = useHistory();
  const classes = useStyles();
  const [clientDependents, setClientDependents] =
    React.useState<IClientDependent[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const dataClientDependents = await getClientDependentsForClient(props.clientId);
        setClientDependents(dataClientDependents);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          {clientDependents && clientDependents.length > 0 ? (
            <TableBody>
              {clientDependents.map((clientDependent) => (
                <TableRow
                  key={clientDependent.id}
                  className={classes.tableBodyRow}
                  onClick={() => {
                    history.push(`/dependents/${clientDependent.id}`);
                  }}
                >
                  <TableCell className={classes.tableBodyCell}>
                    {clientDependent.preferred_name}
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
                <TableCell className={classes.tableBodyCell}></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {isLoading && (
        <Grid container justifyContent="center">
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
