import React, { useState, useEffect } from "react";
import { IconButton, Button } from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@material-ui/core/Box";

import { useStyles } from "../utils";
import { getSiteNotices } from "../api";
import { ISiteNotice } from "../types";
import i18n from "../i18n";

const SiteNoticeDialog = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [siteNotices, setSiteNotices] = React.useState<ISiteNotice[]>([]);

  useEffect(() => {
    async function fetchData() {
      const siteNoticesSeen =
        window.localStorage.getItem("site_notices_seen")?.split(",") || [];
      setIsLoading(true);
      try {
        const siteNoticesData = await getSiteNotices(true);
        setSiteNotices(siteNoticesData);
        if (
          siteNoticesData.length > 0 &&
          !siteNoticesSeen.includes(siteNoticesData[0]?.id.toString())
        ) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      setTimeout(fetchData, 3600000);
    }
    fetchData();
  }, []);

  const dialogClose = () => {
    const siteNoticesSeen =
      window.localStorage.getItem("site_notices_seen")?.split(",") || [];
    window.localStorage.setItem(
      "site_notices_seen",
      Array.from(new Set([...siteNoticesSeen, siteNotices[0]?.id])).join(",")
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={dialogClose}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1 }}>
          <DialogTitle className={classes.dialogTitle}>
            {siteNotices[0]?.title}
          </DialogTitle>
        </Box>
        <Box>
          <IconButton
            className={classes.closeButtonNoPos}
            size={"medium"}
            onClick={dialogClose}
          >
            <CloseIcon className={classes.closeButtonIcon} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent className={classes.dialogContent}>
        <div dangerouslySetInnerHTML={{ __html: siteNotices[0]?.message }} />
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          disableElevation={true}
          fullWidth
          color="primary"
          variant="contained"
          className={classes.dialogSubmit}
          onClick={dialogClose}
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
    </Dialog>
  );
};

export default SiteNoticeDialog;
