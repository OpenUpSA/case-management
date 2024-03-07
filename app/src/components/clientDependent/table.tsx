import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
} from "@material-ui/core";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';


import CircularProgress from "@mui/material/CircularProgress";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import AddIcon from "@mui/icons-material/Add";

import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { getClientDependentsForClient } from "../../api";
import { IClientDependent } from "../../types";

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
        const dataClientDependents = await getClientDependentsForClient(
          props.clientId
        );
        setClientDependents(dataClientDependents);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [props.clientId]);
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
                  <TableCell className={classes.tableBodyCell}>
                    ({clientDependent.relationship_to_client})
                  </TableCell>
                  <TableCell className={classes.tableBodyCell} align="right">
                    <ArrowRightAltIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <></>
          )}

          <TableBody>
            <TableRow
              className={`${classes.tableBodyRow}`}
              onClick={() =>
                history.push(`/clients/${props.clientId}/dependents/new`)
              }
            >
              <TableCell className={classes.tableBodyCell} colSpan={2}>
                {i18n.t("Add dependent details")}
              </TableCell>
              <TableCell className={classes.tableBodyCell} align="right">
                <AddIcon />
              </TableCell>
            </TableRow>
          </TableBody>
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
