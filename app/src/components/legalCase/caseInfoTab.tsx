import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Input, MenuItem } from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LockIcon from "@mui/icons-material/Lock";
import CircularProgress from "@mui/material/CircularProgress";

import { BlackTooltip } from "../general/tooltip";
import { useStyles } from "../../utils";
import SnackbarAlert from "../../components/general/snackBar";
import { format } from "date-fns";
import { CaseOfficesContext } from "../../contexts/caseOfficesContext";
import {
  ILegalCase,
  ICaseType,
  ICaseOffice,
  IUser,
  IClient,
  ILog,
  LocationState,
} from "../../types";
import {
  updateLegalCase,
  getCaseTypes,
  getClient,
  getUser,
  getLogs,
  createLog,
} from "../../api";

const LogLabels = new Map([
  ["LegalCase Create", "Case created"],
  ["LegalCase Update", "Case update"],
  ["Meeting Create", "New meeting"],
  ["Meeting Update", "Meeting updated"],
  ["LegalCaseFile Create", "File uploaded"],
  ["LegalCaseFile Update", "File updated"],
]);

const logLabel = (
  targetAction: string | undefined,
  targetType: string | undefined
) => {
  return LogLabels.get(`${targetType} ${targetAction}`);
};

type Props = {
  legalCase: ILegalCase;
};

export default function CaseInfoTab(props: Props) {
  const classes = useStyles();
  const [caseSummary, setCaseSummary] = React.useState<string | undefined>("");
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [caseWorker, setCaseWorker] = React.useState<IUser | undefined>();
  const [client, setClient] = React.useState<IClient>();
  const [selectCaseType, setSelectCaseType] = React.useState<
    number[] | undefined
  >([]);
  const [selectCaseOffice, setSelectCaseOffice] = React.useState<
    number[] | undefined
  >([]);
  const [caseHistory, setCaseHistory] = React.useState<ILog[]>([]);
  const [open, setOpen] = React.useState(false);
  const [manualUpdateValue, setManualUpdateValue] = React.useState<string>("");
  const [showButton, setShowButton] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState<number>(0);
  const [showSnackbar, setShowSnackbar] = React.useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [updateLoader, setUpdateLoader] = React.useState<boolean>(false);
  const [summaryLoader, setSummaryLoader] = React.useState<boolean>(false);
  const [contextOffices] = useContext(CaseOfficesContext);

  React.useEffect(() => {
    setIsLoading(true);
    setSelectCaseOffice(props.legalCase?.case_offices);
    setCaseSummary(props.legalCase?.summary);
    setSelectCaseType(props.legalCase?.case_types);
    setWidth(window.innerWidth);

    async function fetchData() {
      try {
        const dataCaseTypes = await getCaseTypes();
        const clientInfo = await getClient(props.legalCase?.client);
        const userNumber = Number(props.legalCase?.users?.join());
        const userInfo = await getUser(userNumber);
        const historyData = await getLogs(props.legalCase?.id!, "LegalCase");

        setClient(clientInfo);
        setCaseWorker(userInfo);
        setCaseTypes(dataCaseTypes);
        setCaseHistory(historyData);
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
  }, [props.legalCase]);

  React.useEffect(() => {
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

  const discardChange = () => {
    setCaseSummary(props.legalCase?.summary);
    setShowButton(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setManualUpdateValue("");
  };

  const addUpdateHandler = async (
    parent_id: number | undefined,
    parent_type: string,
    target_id: number | undefined,
    target_type: string,
    action: string,
    user: number,
    note: string
  ) => {
    try {
      setUpdateLoader(true);
      const caseHistory: ILog = {
        id: 0,
        created_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        parent_id: parent_id,
        parent_type: parent_type,
        target_id: target_id,
        target_type: target_type,
        action: action,
        user: user,
        note: note,
      };
      const { id } = await createLog(caseHistory);
      setUpdateLoader(false);
      if (id) {
        handleClose();
        setShowSnackbar({
          open: true,
          message: "Case update successful",
          severity: "success",
        });
      }
      const historyData = await getLogs(props.legalCase?.id!, "LegalCase");
      setCaseHistory(historyData);
    } catch (e) {
      setUpdateLoader(false);
      handleClose();
      setShowSnackbar({
        open: true,
        message: "Case update failed",
        severity: "error",
      });
    }
  };

  const caseSummaryPatch = async () => {
    try {
      setSummaryLoader(true);
      const updatedSummary: ILegalCase = {
        id: props.legalCase.id,
        summary: caseSummary,
        case_number: props.legalCase.case_number,
        state: props.legalCase.state,
        client: props.legalCase.client,
        case_types: props.legalCase.case_types,
        case_offices: props.legalCase.case_offices,
      };
      const { id } = await updateLegalCase(updatedSummary);

      if (id) {
        setSummaryLoader(false);
        setShowButton(false);
        setShowSnackbar({
          open: true,
          message: "Case edit successful",
          severity: "success",
        });
      }
    } catch (e) {
      setSummaryLoader(false);
      setShowSnackbar({
        open: true,
        message: "Case edit failed",
        severity: "error",
      });
    }
  };

  const caseTypePatch = async (arg: any) => {
    try {
      setIsLoading(true);
      const updatedSummary: ILegalCase = {
        id: props.legalCase.id,
        summary: props.legalCase.summary,
        case_number: props.legalCase.case_number,
        state: props.legalCase.state,
        client: props.legalCase.client,
        case_types: arg,
        case_offices: props.legalCase.case_offices,
      };
      const { id } = await updateLegalCase(updatedSummary);
      setIsLoading(false);
      id &&
        setShowSnackbar({
          open: true,
          message: "Case edit successful",
          severity: "success",
        });
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Case edit failed",
        severity: "error",
      });
    }
  };

  const caseOfficePatch = async (arg: any) => {
    try {
      setIsLoading(true);
      const updatedSummary: ILegalCase = {
        id: props.legalCase.id,
        summary: props.legalCase.summary,
        case_number: props.legalCase.case_number,
        state: props.legalCase.state,
        client: props.legalCase.client,
        case_types: props.legalCase.case_types,
        case_offices: arg,
      };
      const { id } = await updateLegalCase(updatedSummary);
      setIsLoading(false);
      id &&
        setShowSnackbar({
          open: true,
          message: "Case edit successful",
          severity: "success",
        });
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Case edit failed",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Grid container spacing={3} className={classes.caseInfoContainer}>
        <Grid item xs={12} md={8}>
          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Case summary:
          </InputLabel>
          <TextField
            multiline
            fullWidth
            rows={4}
            className={classes.caseSummary}
            variant="standard"
            value={caseSummary}
            onChange={(e: React.ChangeEvent<{ value: any }>) => {
              setCaseSummary(e.target.value);
              setShowButton(true);
            }}
            InputProps={{
              style: { fontSize: 12, padding: "14px 16.8px", lineHeight: 1.6 },
              disableUnderline: true,
            }}
          />
          <Grid
            style={{
              transform: showButton ? "translateY(0)" : "translateY(-150%)",
            }}
            className={classes.twoButtonContainer}
          >
            <BlackTooltip title="save changes" arrow placement="top">
              <IconButton
                onClick={() => caseSummaryPatch()}
                className={classes.saveButton}
                disabled={summaryLoader}
              >
                <Typography
                  color={summaryLoader ? "#767271" : "#ffffff"}
                  variant="caption"
                >
                  Save
                </Typography>
                {summaryLoader && (
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
              </IconButton>
            </BlackTooltip>
            <BlackTooltip title="Discard changes" arrow placement="top">
              <IconButton
                onClick={() => discardChange()}
                className={classes.discardButton}
              >
                <Typography color="#767271" variant="caption">
                  Discard
                </Typography>
              </IconButton>
            </BlackTooltip>
          </Grid>
          {isLoading && (
            <Grid container justifyContent="center">
              <CircularProgress
                style={{ position: "absolute", top: 190, left: "50%" }}
              />
            </Grid>
          )}
          <Grid
            container
            justifyContent="space-between"
            sx={{ marginBottom: "10px" }}
          >
            <Grid item>
              <InputLabel htmlFor="put-later" className={classes.plainLabel}>
                Case history:
              </InputLabel>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleClickOpen}>
                Add update
              </Button>

              <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Add Update</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Note"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={manualUpdateValue}
                    onChange={(e: React.ChangeEvent<{ value: any }>) => {
                      setManualUpdateValue(e.target.value);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    style={{ position: "relative" }}
                    color="primary"
                    variant="contained"
                    disabled={manualUpdateValue.length === 0 || updateLoader}
                    onClick={(e) =>
                      addUpdateHandler(
                        props.legalCase?.id,
                        "LegalCase",
                        props.legalCase?.id,
                        "LegalCase",
                        "Update",
                        Number(props.legalCase?.users?.join()),
                        manualUpdateValue
                      )
                    }
                  >
                    Submit
                    {updateLoader && (
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
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
          <List sx={{ width: "100%", marginBottom: "26px" }}>
            <Divider />
            {caseHistory.length > 0
              ? caseHistory
                  ?.slice(0)
                  .reverse()
                  .map((item) => (
                    <>
                      <ListItem
                        key={`caseHistory_${item.id}`}
                        className={classes.caseHistoryList}
                      >
                        <Chip
                          label={logLabel(item.action, item.target_type)}
                          className={classes.chip}
                        />
                        <ListItemText
                          primary={
                            <Typography variant="caption">
                              {item.note.length > 12 && width <= 500
                                ? item.note.slice(0, 10) + "..."
                                : item.note}
                            </Typography>
                          }
                          className={classes.caseHistoryText}
                        />
                        <Box className={classes.caseHistoryBox}>
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar
                              alt="Paul Watson"
                              src="/static/images/avatar/1.jpg"
                              className={classes.caseHistoryAvatar}
                              sx={{ width: 28, height: 28 }}
                            />
                          </ListItemAvatar>
                          <Typography
                            sx={{ fontSize: "11px", color: "#616161" }}
                          >
                            {format(
                              new Date(item?.created_at!),
                              "MMM dd, yyyy"
                            )}
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider />
                    </>
                  ))
              : ""}
          </List>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="caption">
                Showing {caseHistory?.length} of {caseHistory?.length} updates
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {/* <a href="/#">Show all updates</a> */}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Case number:
          </InputLabel>
          <TextField
            variant="standard"
            value={props.legalCase?.case_number}
            fullWidth
            className={classes.smallTextField}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              style: { fontSize: 13 },
              endAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" style={{ color: "#c2c2c2" }} />
                </InputAdornment>
              ),
            }}
          />
          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Case type:
          </InputLabel>

          <Select
            id="select"
            disableUnderline
            className={classes.caseSelect}
            input={<Input />}
            value={selectCaseType}
            defaultValue={[0]}
            onChange={(event: SelectChangeEvent<number[]>) => {
              setSelectCaseType([event.target.value as any]);
              caseTypePatch([event.target.value as any]);
            }}
            renderValue={() => {
              return caseTypes
                ?.filter(
                  (caseType) => selectCaseType!.indexOf(caseType.id) > -1
                )
                .map((caseType) => caseType.title)
                .join(", ");
            }}
          >
            {caseTypes?.map(({ id, title }) => (
              <MenuItem key={id} value={id}>
                {title}
              </MenuItem>
            ))}
          </Select>

          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Client name:
          </InputLabel>
          <TextField
            variant="standard"
            value={client?.preferred_name}
            fullWidth
            className={classes.smallTextField}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              style: { fontSize: 13 },
              endAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" style={{ color: "#c2c2c2" }} />
                </InputAdornment>
              ),
            }}
          />

          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Case worker:
          </InputLabel>
          <TextField
            variant="standard"
            value={caseWorker?.name}
            fullWidth
            className={classes.smallTextField}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              style: { fontSize: 13 },
              endAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" style={{ color: "#c2c2c2" }} />
                </InputAdornment>
              ),
            }}
          />
          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Case office:
          </InputLabel>

          <Select
            id="case_offices_select"
            className={classes.caseSelect}
            disableUnderline
            onChange={(event: SelectChangeEvent<number[]>) => {
              setSelectCaseOffice([event.target.value as any]);
              caseOfficePatch([event.target.value as any]);
            }}
            input={<Input />}
            value={selectCaseOffice}
            defaultValue={[0]}
            renderValue={() => {
              return contextOffices
                ?.filter(
                  (caseOffice: ICaseOffice) => selectCaseOffice!.indexOf(caseOffice.id) > -1
                )
                .map((caseOffice: ICaseOffice) => caseOffice.name)
                .join(", ");
            }}
          >
            {contextOffices?.map(({ id, name }: any) => (
              <MenuItem
                className={classes.caseSelectMenuItem}
                key={id}
                value={id}
              >
                {name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Date created:
          </InputLabel>
          <TextField
            variant="standard"
            value={format(
              new Date(props.legalCase?.created_at || new Date().toISOString()),
              "dd/MM/yyyy"
            )}
            fullWidth
            className={classes.smallTextField}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              style: { fontSize: 13 },
              endAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" style={{ color: "#c2c2c2" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </>
  );
}
