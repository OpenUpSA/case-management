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

type Props = {
  dialogClose: () => void;
  dialogNewOpen: () => void;
  legalCaseReferrals: ILegalCaseReferral[];
};

const Component = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Dialog open={true} onClose={props.dialogClose} fullWidth maxWidth="md">
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
                    history.push(`/referrals/${row.id}`);
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
  );
};

Component.defaultProps = {};

export default Component;
