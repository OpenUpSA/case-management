import { useState } from "react";
import {
  Button,
  IconButton,
} from "@material-ui/core";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { ILegalCaseReferral } from "../../types";
import { useStyles } from "../../utils";

import { format } from "date-fns";

import LegalCaseReferralEdit from "../../components/legalCaseReferral/edit";

type Props = {
  open: boolean;
  dialogClose: () => void;
  dialogNewOpen: () => void;
  legalCaseReferrals: ILegalCaseReferral[];
  updateListHandler: () => void;
};

const Component = (props: Props) => {
  const classes = useStyles();

  const [editOpen, setEditOpen] = useState<boolean>(true);
  const [legalCaseReferral, setLegalCaseReferral] =
    useState<ILegalCaseReferral>();

  const dialogEditClose = () => {
    setEditOpen(false);
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.dialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className={classes.dialogTitle}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              Case referrals ({props.legalCaseReferrals.length})
            </Box>
            <Box>
              <IconButton
                size={"medium"}
                onClick={props.dialogClose}
                className={classes.closeButton}
              >
                <CloseIcon className={classes.closeButtonIcon} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Divider />
          <TableContainer>
            <Table className={classes.tableVariant} aria-label="simple table">
              <TableHead>
                <TableRow className={classes.tableHeadRowVariant}>
                  <TableCell className={classes.tableHeadCellVariant}>
                    <span className={classes.tableHeadCellValueWrapperVariant}>
                      Referred to
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableHeadCellVariant}>
                    <span className={classes.tableHeadCellValueWrapperVariant}>
                      Reference/case number
                    </span>
                  </TableCell>
                  <TableCell
                    className={classes.tableHeadCellVariant}
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.legalCaseReferrals.map((row: ILegalCaseReferral) => (
                  <TableRow
                    key={row.id}
                    className={classes.tableBodyRowVariant}
                  >
                    <TableCell
                      className={classes.tableBodyCellVariant}
                      onClick={() => {
                        setLegalCaseReferral(row);
                        setEditOpen(true);
                      }}
                    >
                      <span
                        className={classes.tableBodyCellValueWrapperVariant}
                      >
                        {row.referred_to}
                      </span>
                    </TableCell>
                    <TableCell
                      className={classes.tableBodyCellVariant}
                      onClick={() => {
                        setLegalCaseReferral(row);
                        setEditOpen(true);
                      }}
                    >
                      <span
                        className={classes.tableBodyCellValueWrapperVariant}
                      >
                        {row.reference_number}
                      </span>
                    </TableCell>
                    <TableCell
                      className={classes.tableBodyCellVariant}
                      onClick={() => {
                        setLegalCaseReferral(row);
                        setEditOpen(true);
                      }}
                    >
                      {format(new Date(row.referral_date!), "MMM dd, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            disableElevation={true}
            onClick={props.dialogClose}
            fullWidth
            variant="contained"
            className={classes.dialogSubmit}
          >
            Close
          </Button>

          <Button
            disableElevation={true}
            onClick={props.dialogNewOpen}
            fullWidth
            color="primary"
            variant="contained"
            className={classes.dialogSubmit}
          >
            Add new referral
          </Button>
        </DialogActions>
      </Dialog>

      {legalCaseReferral && (
        <LegalCaseReferralEdit
          open={editOpen}
          dialogClose={dialogEditClose}
          legalCaseReferral={legalCaseReferral}
          setLegalCaseReferral={setLegalCaseReferral}
          updateListHandler={props.updateListHandler}
        ></LegalCaseReferralEdit>
      )}
    </>
  );
};

Component.defaultProps = {};

export default Component;
