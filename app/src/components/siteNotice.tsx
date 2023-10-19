import React, { useState, useEffect } from "react";
import { IconButton, Button } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

import { useStyles } from "../utils";
import { getSiteNotices } from "../api";
import { ISiteNotice, LocationState } from "../types";
import i18n from "../i18n";
import SnackbarAlert from "../components/general/snackBar";

const SiteNoticeDialog = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [siteNotices, setSiteNotices] = React.useState<ISiteNotice[]>([]);
  const [showSnackbar, setShowSnackbar] = useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const siteNoticesData = await getSiteNotices(true);
        setSiteNotices(siteNoticesData);
        if (siteNoticesData.length > 0) {
          setOpen(true);
        }
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        setShowSnackbar({
          open: true,
          message: e.message,
          severity: "error",
        });
      }
    }
    fetchData();
  }, []);

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

  const dialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={dialogClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <Box style={{ margin: 20 }}>
          <Grid
            container
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <DialogTitle className={classes.dialogTitle}>
                {siteNotices[0]?.title}
              </DialogTitle>
            </Grid>
            <Grid item className={classes.spaceItems}>
              <IconButton
                className={classes.closeButton}
                size={"medium"}
                onClick={dialogClose}
              >
                <CloseIcon className={classes.closeButtonIcon} />
              </IconButton>
            </Grid>
          </Grid>

          <div dangerouslySetInnerHTML={{ __html: siteNotices[0]?.message }} />

          <DialogActions style={{ padding: 0 }}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              className={classes.dialogSubmit}
              onClick={() => setOpen(false)}
              disabled={isLoading}
              style={{ position: "relative" }}
            >
              {isLoading && (
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
              {i18n.t("Dismiss")}
            </Button>
          </DialogActions>
        </Box>
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

export default SiteNoticeDialog;
