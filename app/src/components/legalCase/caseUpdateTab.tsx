import React, { useState } from "react";
import {
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CloseIcon from "@mui/icons-material/Close";

import { useStyles } from "../../utils";
import i18n from "../../i18n";
import UpdateDialogContent from "./updateDialogContent";

const CaseUpdateTab = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const dialogClose = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      alignItems="center"
      className={classes.containerMarginBottom}
    >
      <Grid item xs={12} md={12}>
        <Button
          className={classes.bigCanBeFab}
          fullWidth
          color="primary"
          variant="contained"
          startIcon={<AddCommentIcon />}
          style={{ textTransform: "none" }}
          onClick={() => setOpen(true)}
        >
          {i18n.t("Add new update")}
        </Button>
        <Dialog open={open} onClose={dialogClose} fullWidth maxWidth="md">
          <Box style={{ margin: 20 }}>
            <Grid
              container
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item>
                <DialogTitle
                  style={{ padding: 5, fontWeight: "bold", fontSize: 24 }}
                >
                  {i18n.t("New update")}
                </DialogTitle>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.closeButton}
                  size={"small"}
                  onClick={dialogClose}
                >
                  <CloseIcon fontSize={"large"} style={{ color: "black" }} />
                </IconButton>
              </Grid>
            </Grid>
            <UpdateDialogContent />
            <DialogActions
              style={{
                padding: "10px 0px 0px 0px",
                borderTop: "1px solid rgb(0,0,0,0.2)",
              }}
            >
              <Button
                fullWidth
                onClick={dialogClose}
                className={classes.dialogCancel}
              >
                {i18n.t("Cancel")}
              </Button>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                style={{ textTransform: "none" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {i18n.t("Submit update")}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Grid>
      <Grid item style={{ flexGrow: 1 }}>
        <strong>
          {127} {i18n.t("Case Updates")}
        </strong>
      </Grid>
      <Grid item>
        <InputLabel
          className={classes.inputLabel}
          htmlFor="sort_table"
          shrink={true}
          style={{ marginRight: "-20px" }}
        >
          {i18n.t("Sort")}:
        </InputLabel>
      </Grid>
      <Grid item>
        <Select
          id="sort_table"
          className={classes.select}
          disableUnderline
          input={<Input />}
          value="alphabetical"
        >
          <MenuItem key="alphabetical" value="alphabetical">
            {i18n.t("Alphabetical")}
          </MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default CaseUpdateTab;
