import { useState } from "react";
import { Button, IconButton } from "@material-ui/core";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { ILegalCase, ILegalCaseReferral } from "../../types";
import { useStyles } from "../../utils";

import { createLegalCaseReferral } from "../../api";
import LegalCaseReferralForm from "../../components/legalCaseReferral/form";

type Props = {
  open: boolean;
  dialogClose: () => void;
  legalCase: ILegalCase;
  updateListHandler: () => void;
};

const Component = (props: Props) => {
  const classes = useStyles();

  const defaultLegalCaseReferral: ILegalCaseReferral = {
    referred_to: "",
    referral_date: new Date().toISOString().split("T")[0],
    reference_number: "",
    details: "",
    legal_case: props.legalCase.id || -1,
  };

  const [legalCaseReferral, setLegalCaseReferral] =
    useState<ILegalCaseReferral>(defaultLegalCaseReferral);

  const saveNew = () => {
    createLegalCaseReferral(legalCaseReferral).then(() => {
      props.dialogClose();
      props.updateListHandler();
      setLegalCaseReferral(defaultLegalCaseReferral);
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.dialogClose}
      fullWidth
      maxWidth="sm"
    >
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
          legalCaseReferral={legalCaseReferral}
          setLegalCaseReferral={setLegalCaseReferral}
        ></LegalCaseReferralForm>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          disableElevation={true}
          onClick={props.dialogClose}
          fullWidth
          variant="contained"
          className={classes.dialogSubmit}
        >
          Cancel
        </Button>

        <Button
          disableElevation={true}
          fullWidth
          color="primary"
          variant="contained"
          className={classes.dialogSubmit}
          onClick={saveNew}
        >
          Add referral
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Component.defaultProps = {};

export default Component;
