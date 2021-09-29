import React from "react";
import { useStyles } from "../../utils";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export default function RecommendedTable() {
  const classes = useStyles();
  return (
    <>
      <p style={{ fontWeight: 700, paddingBottom: 0, marginBottom: 0 }}>
        Recommended case:{" "}
      </p>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableHeadCell}></TableCell>

              <TableCell className={classes.tableHeadCell}></TableCell>

              <TableCell
                className={classes.tableHeadCell}
                colSpan={2}
              ></TableCell>
              <TableCell className={classes.tableHeadCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.tableBodyRow}>
              <TableCell className={classes.tableBodyCell}>icon here</TableCell>
              <TableCell colSpan={10} className={classes.tableBodyCell}>
                <p>Notice to vacate</p>
              </TableCell>
              <TableCell className={classes.tableBodyCell}>icon here</TableCell>
              <TableCell className={classes.tableBodyCell}>icon here</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
