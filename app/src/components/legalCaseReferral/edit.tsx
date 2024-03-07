import { useState } from "react";
import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { ILegalCaseReferral, SnackbarState } from "../../types";
import { useStyles } from "../../utils";

import LegalCaseReferralForm from "../../components/legalCaseReferral/form";
import { updateLegalCaseReferral, deleteLegalCaseReferral } from "../../api";
import i18n from "../../i18n";

import MoreMenu from "../moreMenu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import SnackbarAlert from "../general/snackBar";

type Props = {
  open: boolean;
  dialogClose: () => void;
  legalCaseReferral: ILegalCaseReferral;
  setLegalCaseReferral: (legalCaseReferral: ILegalCaseReferral) => void;
  updateListHandler: () => void;
};

const Component = (props: Props) => {
  const classes = useStyles();

  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

  const destroyReferral = async () => {
    try {
      setDeleteLoader(true);
      if (
        window.confirm(i18n.t("Are you sure you want to delete this referral?"))
      ) {
        await deleteLegalCaseReferral(props.legalCaseReferral.id as number);
        setShowSnackbar({
          open: true,
          message: "Referral deleted",
          severity: "success",
        });
        props.updateListHandler();
        props.dialogClose();
      }
      setDeleteLoader(false);
    } catch (e) {
      setDeleteLoader(false);
      setShowSnackbar({
        open: true,
        message: "Referral delete failed",
        severity: "error",
      });
    }
  };

  const updateExisting = () => {
    updateLegalCaseReferral(props.legalCaseReferral).then((response) => {
      props.dialogClose();
      props.updateListHandler();
    });
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.dialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className={classes.dialogTitle}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Update referral</Box>
            <Box>
              <MoreMenu>
                <MenuItem
                  style={{ position: "relative" }}
                  disabled={deleteLoader}
                  onClick={() => destroyReferral()}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{i18n.t("Delete referral")}</ListItemText>
                  {deleteLoader && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </MenuItem>
              </MoreMenu>
            </Box>
            <Box sx={{ width: "50px" }}>
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
            disableElevation={true}
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
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </>
  );
};

Component.defaultProps = {};

export default Component;
