import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@material-ui/core";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { ILegalCaseReferral } from "../../types";
import { useStyles } from "../../utils";

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
  const history = useHistory();

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
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}>
                    Referred to
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    Reference/case number
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.legalCaseReferrals.map((row: ILegalCaseReferral) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      setLegalCaseReferral(row);
                      setEditOpen(true);
                    }}
                  >
                    <TableCell>{row.referred_to}</TableCell>
                    <TableCell>{row.reference_number}</TableCell>
                    <TableCell>{row.referral_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={props.dialogClose}
            fullWidth
            variant="contained"
            className={classes.dialogSubmit}
          >
            Close
          </Button>

          <Button
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
