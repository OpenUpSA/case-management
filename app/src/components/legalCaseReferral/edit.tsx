import { useState } from "react";
import {
  Button,
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

import LegalCaseReferralForm from "../../components/legalCaseReferral/form";
import { updateLegalCaseReferral } from "../../api";

type Props = {
  open: boolean;
  dialogClose: () => void;
  legalCaseReferral: ILegalCaseReferral;
  setLegalCaseReferral: (legalCaseReferral: ILegalCaseReferral) => void;
  updateListHandler: () => void;
};

const Component = (props: Props) => {
  const classes = useStyles();

  const updateExisting = () => {
    updateLegalCaseReferral(props.legalCaseReferral).then((response) => {
      props.dialogClose();
      props.updateListHandler();
    });
  };

  return (
    <Dialog open={props.open} onClose={props.dialogClose} fullWidth maxWidth="sm">
      <DialogTitle className={classes.dialogTitle}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>Add new referral</Box>
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
        <LegalCaseReferralForm
          legalCaseReferral={props.legalCaseReferral}
          setLegalCaseReferral={props.setLegalCaseReferral}
        ></LegalCaseReferralForm>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={props.dialogClose}
          fullWidth
          variant="contained"
          className={classes.dialogSubmit}
        >
          Cancel
        </Button>

        <Button
          fullWidth
          color="primary"
          variant="contained"
          className={classes.dialogSubmit}
          onClick={updateExisting}
        >
          Upate referral
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Component.defaultProps = {};

export default Component;
