import React, { useContext, useState, useEffect } from "react";
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

import LockIcon from "@mui/icons-material/Lock";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";

import { BlackTooltip } from "../general/tooltip";
import { useStyles } from "../../utils";
import SnackbarAlert from "../../components/general/snackBar";
import { format } from "date-fns";
import { CaseOfficesContext } from "../../contexts/caseOfficesContext";
import { CaseTypesContext } from "../../contexts/caseTypesContext";
import UpdateDialog from "./updateDialog";
import { updateLegalCase, getLogs, getLegalCase } from "../../api";
import {
  ILegalCase,
  ICaseType,
  ICaseOffice,
  IClient,
  IUser,
  ILog,
  LocationState,
  ILegalCaseFile
} from "../../types";

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
  client: IClient | undefined;
  caseHistory: ILog[];
  caseWorker: IUser | undefined;
  setCaseHistory: (caseHistory: ILog[]) => void;
  setLegalCase: (legalCase: ILegalCase) => void;
  setStatus: (status: string) => void;
  setCaseUpdates: (caseUpdates: any) => void;
  setLegalCaseFiles: (legalCaseFiles: ILegalCaseFile[]) => void;
};

export default function CaseInfoTab(props: Props) {
  const classes = useStyles();
  const [contextOffices] = useContext(CaseOfficesContext);
  const [contextCaseTypes] = useContext(CaseTypesContext);
  const [caseSummary, setCaseSummary] = useState<string | undefined>("");
  const [selectCaseType, setSelectCaseType] = useState<number[] | undefined>(
    []
  );
  const [selectCaseOffice, setSelectCaseOffice] = useState<
    number[] | undefined
  >([]);
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);
  const [showSnackbar, setShowSnackbar] = useState<LocationState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summaryLoader, setSummaryLoader] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setSelectCaseOffice(props.legalCase?.case_offices);
    setCaseSummary(props.legalCase?.summary);
    setSelectCaseType(props.legalCase?.case_types);
    setWidth(window.innerWidth);

    setIsLoading(false);
  }, [props.legalCase]);

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

  const discardChange = () => {
    setCaseSummary(props.legalCase?.summary);
    setShowButton(false);
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
        updateCase();
        updateHistory();
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
      if (id) {
        setShowSnackbar({
          open: true,
          message: "Case edit successful",
          severity: "success",
        });
        updateHistory();
        updateCase();
      }
    } catch (e) {
      setIsLoading(false);
      setShowSnackbar({
        open: true,
        message: "Case edit failed",
        severity: "error",
      });
    }
  };

  const updateCase = async () => {
    const dataLegalCase = await getLegalCase(props.legalCase.id as number);
    props.setLegalCase(dataLegalCase);
  };

  const updateHistory = async () => {
    const historyData = await getLogs(props.legalCase?.id!, "LegalCase");
    props.setCaseHistory(historyData);
  };

  const dialogOpen = () => {
    setOpen(true);
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
              <Button variant="contained" onClick={() => dialogOpen()}>
                Add update
              </Button>

              <UpdateDialog
                open={open}
                setOpen={setOpen}
                setStatus={props.setStatus}
                legalCase={props.legalCase}
                setLegalCase={props.setLegalCase}
                setLegalCaseFiles={props.setLegalCaseFiles}
                setCaseUpdates={props.setCaseUpdates}
              />
           
            </Grid>
          </Grid>
          <List sx={{ width: "100%", marginBottom: "26px" }}>
            <Divider />
            {props.caseHistory.length > 0
              ? props.caseHistory
                  ?.slice(0)
                  .reverse()
                  .map((item) => (
                    <React.Fragment key={`caseHistory_${item.id}`}>
                      <ListItem className={classes.caseHistoryList}>
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
                    </React.Fragment>
                  ))
              : ""}
          </List>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="caption">
                Showing {props.caseHistory?.length} of{" "}
                {props.caseHistory?.length} updates
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
              return contextCaseTypes
                ?.filter(
                  (caseType: ICaseType) =>
                    selectCaseType!.indexOf(caseType.id) > -1
                )
                .map((caseType: ICaseType) => caseType.title)
                .join(", ");
            }}
          >
            {contextCaseTypes?.map(({ id, title }: any) => (
              <MenuItem key={id} value={id}>
                {title}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>
            If you chose <em>Other</em>, please use the feedback tab to suggest
            a new case type.
          </FormHelperText>

          <InputLabel htmlFor="put-later" className={classes.plainLabel}>
            Client name:
          </InputLabel>
          <TextField
            variant="standard"
            value={props.client?.preferred_name || ""}
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
            value={props.caseWorker?.name || ""}
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

          <TextField
            variant="standard"
            value={contextOffices
              ?.filter(
                (caseOffice: ICaseOffice) =>
                  selectCaseOffice!.indexOf(caseOffice.id) > -1
              )
              .map((caseOffice: ICaseOffice) => caseOffice.name)
              .join(", ")}
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
