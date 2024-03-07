import React, { useState, useEffect } from "react";
import { Input, InputLabel, Button, Grid } from "@material-ui/core";

import AddCommentIcon from "@mui/icons-material/AddComment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useStyles } from "../../utils";
import {
  ILegalCase,
  SnackbarState,
  ILegalCaseFile,
  IUser,
  ILog,
} from "../../types";
import i18n from "../../i18n";
import UpdateDialog from "./updateDialog";
import UpdateTable from "./updateTable";
import SnackbarAlert from "../general/snackBar";

type Props = {
  legalCase: ILegalCase;
  setLegalCase: (legalCase: ILegalCase) => void;
  legalCaseFiles: ILegalCaseFile[];
  setLegalCaseFiles: (legalCaseFiles: ILegalCaseFile[]) => void;
  caseUpdates: any;
  setCaseUpdates: (caseUpdates: any) => void;
  setStatus: (status: string) => void;
  users: IUser[];
  setCaseHistory: (caseHistory: ILog[]) => void;
};

const CaseUpdateTab = (props: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [editView, setEditView] = useState<boolean>(false);

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

  const dialogOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        className={classes.containerMarginBottom}
      >
        <Grid item xs={12} md={12}>
          <Button
            disableElevation={true}
            className={classes.bigCanBeFab}
            fullWidth
            color="primary"
            variant="contained"
            startIcon={<AddCommentIcon />}
            onClick={() => {
              dialogOpen();
              setEditView(false);
            }}
          >
            {i18n.t("Add new update")}
          </Button>

          <UpdateDialog
            open={open}
            setOpen={setOpen}
            setStatus={props.setStatus}
            legalCase={props.legalCase}
            setLegalCase={props.setLegalCase}
            setLegalCaseFiles={props.setLegalCaseFiles}
            setCaseUpdates={props.setCaseUpdates}
            editView={editView}
            setCaseHistory={props.setCaseHistory}
          />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <strong>
            {props.caseUpdates.length} {i18n.t("Case Updates")}
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
      <Grid>
        <UpdateTable
          caseUpdates={props.caseUpdates}
          legalCaseFiles={props.legalCaseFiles ? props.legalCaseFiles : []}
          setStatus={props.setStatus}
          legalCase={props.legalCase}
          setLegalCase={props.setLegalCase}
          setLegalCaseFiles={props.setLegalCaseFiles}
          setCaseUpdates={props.setCaseUpdates}
          users={props.users ? props.users : []}
          editView={editView}
          setEditView={setEditView}
          setCaseHistory={props.setCaseHistory}
        />
        {showSnackbar.open && (
          <SnackbarAlert
            open={showSnackbar.open}
            message={showSnackbar.message ? showSnackbar.message : ""}
            severity={showSnackbar.severity}
          />
        )}
      </Grid>
    </>
  );
};

export default CaseUpdateTab;
