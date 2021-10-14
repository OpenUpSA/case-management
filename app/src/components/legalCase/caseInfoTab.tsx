import React from "react";
import { useHistory } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

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
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useStyles } from "../../utils";
import {
  ILegalCase,
  ICaseType,
  ICaseOffice,
  IUser,
  IClient,
  ICaseHistory,
} from "../../types";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import {
  updateLegalCase,
  getCaseTypes,
  getCaseOffices,
  getClient,
  getUser,
  getCaseHistory,
  updateCaseHistory,
} from "../../api";

const BlackTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

type Props = {
  legalCase: ILegalCase;
};

export default function CaseInfoTab(props: Props) {
  const history = useHistory();
  const [toggleButton, setToggleButton] = React.useState<Boolean>(true);
  const [caseSummary, setCaseSummary] = React.useState<string | undefined>("");
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [caseOffices, setCaseOffices] = React.useState<ICaseOffice[]>();
  const [caseWorker, setCaseWorker] = React.useState<IUser | undefined>();
  const [client, setClient] = React.useState<IClient>();
  const [selectCaseType, setSelectCaseType] = React.useState<
    number[] | undefined
  >([]);
  const [selectCaseOffice, setSelectCaseOffice] = React.useState<
    number[] | undefined
  >([]);
  const [caseHistory, setCaseHistory] = React.useState<ICaseHistory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [manualUpdateValue, setManualUpdateValue] = React.useState<string>("");

  React.useEffect(() => {
    setSelectCaseOffice(props.legalCase?.case_offices);
    setCaseSummary(props.legalCase?.summary);
    setSelectCaseType(props.legalCase?.case_types);

    async function fetchData() {
      const dataCaseTypes = await getCaseTypes();
      const dataCaseOffices = await getCaseOffices();
      const clientInfo = await getClient(props.legalCase?.client);
      const userNumber = Number(props.legalCase?.users?.join());
      const userInfo = await getUser(userNumber);
      const historyData = await getCaseHistory(
        props.legalCase?.id!,
        "LegalCase"
      );

      setClient(clientInfo);
      setCaseWorker(userInfo);
      setCaseTypes(dataCaseTypes);
      setCaseOffices(dataCaseOffices);
      setCaseHistory(historyData);
      console.log(historyData);
    }
    fetchData();
  }, [props.legalCase]);


  const discardChange = () => {
    setToggleButton(true);
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
    handleClose();
    try {
      const caseHistory: ICaseHistory = {
        parent_id: parent_id,
        parent_type: parent_type,
        target_id: target_id,
        target_type: target_type,
        action: action,
        user: user,
        note: note,
      };
      await updateCaseHistory(caseHistory);
      const historyData = await getCaseHistory(
        props.legalCase?.id!,
        "LegalCase"
      );
      setCaseHistory(historyData);
    } catch (e) {
      console.log(e);
    }
  };

  const saveCaseSummary = async () => {
    try {
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
      setToggleButton(true);
      history.push(`/cases/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const caseTypePatch = async (arg: any) => {
    try {
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
      history.push(`/cases/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const caseOfficePatch = async (arg: any) => {
    try {
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
      history.push(`/cases/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const classes = useStyles();
  return (
    <Grid container spacing={3} className={classes.caseInfoContainer}>
      <Grid item xs={12} md={8}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <InputLabel htmlFor="put-later" className={classes.plainLabel}>
              Case summary:
            </InputLabel>
          </Grid>
          <Grid item direction="row" sx={{ marginBottom: "-10px", zIndex: 2 }}>
            <BlackTooltip title="Discard changes" arrow placement="top">
              <IconButton
                onClick={() => discardChange()}
                className={classes.iconButton}
                sx={{
                  marginRight: "8px",
                  visibility: !toggleButton ? "visible" : "hidden",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </BlackTooltip>

            {toggleButton ? (
              <BlackTooltip title="Edit field" arrow placement="top">
                <IconButton
                  className={classes.iconButton}
                  onClick={() => setToggleButton(false)}
                >
                  <CreateIcon sx={{ color: "#000" }} />
                </IconButton>
              </BlackTooltip>
            ) : (
              <BlackTooltip title="save changes" arrow placement="top">
                <IconButton
                  onClick={() => saveCaseSummary()}
                  className={classes.checkIconButton}
                >
                  <CheckIcon sx={{ color: "#fff" }} />
                </IconButton>
              </BlackTooltip>
            )}
          </Grid>
        </Grid>
        <TextField
          multiline
          value={caseSummary}
          onChange={(e: React.ChangeEvent<{ value: any }>) => {
            setCaseSummary(e.target.value);
          }}
          fullWidth
          rows={4}
          sx={{
            marginBottom: "26px",
            backgroundColor: "#f2f2f2",
          }}
          variant="standard"
          InputProps={{
            style: { fontSize: 12, padding: "14px 16.8px", lineHeight: 1.6 },
            readOnly: toggleButton ? true : false,
            disableUnderline: true,
          }}
        />
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
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <List sx={{ width: "100%", marginBottom: "26px" }}>
          <Divider />
          {caseHistory.length > 0
            ? caseHistory?.slice(0).reverse().map((item) => (
                <>
                  <ListItem className={classes.caseHistoryList}>
                    <Chip label={item.action} className={classes.chip} />
                    <ListItemText
                      primary={
                        <Typography variant="caption">{item.note}</Typography>
                      }
                      style={{ flexGrow: 1 }}
                    />
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        alt="Paul Watson"
                        src="/static/images/avatar/1.jpg"
                        className={classes.caseHistoryAvatar}
                        sx={{ width: 28, height: 28 }}
                      />
                    </ListItemAvatar>
                    <Typography sx={{ fontSize: "11px", color: "#616161" }}>
                      {format(new Date(item?.created_at!), "MMM dd, yyyy")}
                    </Typography>
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
          onChange={(event: SelectChangeEvent<number[]>) => {
            setSelectCaseType([event.target.value as any]);
            caseTypePatch([event.target.value as any]);
          }}
          renderValue={() => {
            return caseTypes
              ?.filter((caseType) => selectCaseType!.indexOf(caseType.id) > -1)
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
          renderValue={() => {
            return caseOffices
              ?.filter(
                (caseOffice) => selectCaseOffice!.indexOf(caseOffice.id) > -1
              )
              .map((caseOffice) => caseOffice.name)
              .join(", ");
          }}
        >
          {caseOffices?.map(({ id, name }) => (
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
            "MM/dd/yyyy"
          )}
          fullWidth
          className={classes.smallTextField}
          InputProps={{
            readOnly: true,
            disableUnderline: true,
            style: { fontSize: 13 },
          }}
        />
      </Grid>
    </Grid>
  );
}
