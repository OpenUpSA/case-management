import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
} from "@material-ui/core";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

import { useStyles } from "../../utils";
import { updateLegalCaseFile } from "../../api";
import { SnackbarState, ILegalCaseFile } from "../../types";
import SnackbarAlert from "../general/snackBar";
import LegalCaseFileForm from "./form";

type Props = {
  open: boolean;
  dialogClose: () => void;
  legalCaseFile: ILegalCaseFile;
  setLegalCaseFile: (legalCaseFile: ILegalCaseFile) => void;
  updateListHandler: () => void;
};

const UpdateDialog = (props: Props) => {
  const classes = useStyles();

  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar({
          open: false,
          message: "",
          severity: undefined,
        });
      }, 6000);
    };
    resetState();
  }, [showSnackbar.open]);

  const submitHandler = () => {
    props.dialogClose();
  };

  const updateExisting = () => {
    setIsLoading(true);
    updateLegalCaseFile(props.legalCaseFile)
      .then((res: any) => {
        if (res.id) {
          setShowSnackbar({
            open: true,
            message: "File updated successfully",
            severity: "success",
          });
          props.dialogClose();
          console.log("1");
          props.updateListHandler();
        } else {
          setShowSnackbar({
            open: true,
            message: "File update failed",
            severity: "error",
          });
        }
      })
      .catch(() => {
        setShowSnackbar({
          open: true,
          message: "File rename failed",
          severity: "error",
        });
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
            <Box flexGrow={1}>Edit file details</Box>
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
          <LegalCaseFileForm
            legalCaseFile={props.legalCaseFile}
            setLegalCaseFile={props.setLegalCaseFile}
          ></LegalCaseFileForm>
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
            onClick={updateExisting}
          >
            Save{" "}
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

export default UpdateDialog;
