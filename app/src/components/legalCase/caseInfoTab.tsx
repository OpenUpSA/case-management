import React from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useStyles } from "../../utils";
import { Input, MenuItem } from "@material-ui/core";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

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

const caseTypeList = [
  "Eviction",
  "Labour law",
  "Family dispute",
  "Customary law",
  "Child neglect",
  "Estate leasing",
  "Citizenship law",
];

const caseWorkerList = [
  "Matthew",
  "Jonathan",
  "Shaun",
  "Paul",
  "Mbali"
]

const caseOffices = [
  "Lutzville West",
  "uMngeni North",
  "Ndifuna Ukwazi (Cape Town)"
]

export default function CaseInfoTab() {
  const [caseType, setCaseType] = React.useState<string>("Eviction");
  const [caseWorker, setCaseWorker] = React.useState<string>("Matthew");
  const [caseOffice, setCaseOffice] = React.useState<string>("Lutzville West");

  const handleChange = (event: SelectChangeEvent) => {
    setCaseType(event.target.value as string);
  };

  const handleChange2 = (event: SelectChangeEvent) => {
    setCaseWorker(event.target.value as string);
  };

  const handleChange3 = (event: SelectChangeEvent) => {
    setCaseOffice(event.target.value as string);
  }



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
                className={classes.iconButton}
                sx={{
                  marginRight: "8px",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </BlackTooltip>
            <BlackTooltip title="Edit field" arrow placement="top">
              <IconButton className={classes.iconButton}>
                <CreateIcon sx={{ color: "#000" }} />
              </IconButton>
            </BlackTooltip>
          </Grid>
        </Grid>
        <TextField
          multiline
          value="Client (Xoliswa) is being evicted by her landlord who is her sister's husband. He (landlord) has not gone through the lawful eviction process and has cut off her electricity and is intimidating her. She does not have alternative accommodation available to her."
          fullWidth
          rows={4}
          sx={{
            marginBottom: "26px",
            backgroundColor: "#f2f2f2",
          }}
          variant="standard"
          InputProps={{
            style: { fontSize: 12, padding: "14px 16.8px", lineHeight: 1.6 },
            readOnly: true,
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
            <Button variant="contained">Add update</Button>
          </Grid>
        </Grid>
        <List sx={{ width: "100%", marginBottom: "26px" }}>
          <Divider />
          <ListItem className={classes.caseHistoryList}>
            <Chip label="Update" className={classes.chip} />
            <ListItemText
              primary={
                <Typography variant="caption">
                  Client has received her 
                  notice to vacate
                </Typography>
              }
              style={{ flexGrow: 1 }}
            />
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                className={classes.caseHistoryAvatar}
                sx={{ width: 28, height: 28 }}
              />
            </ListItemAvatar>
            <Typography sx={{ fontSize: "11px", color: "#616161" }}>
              Aug 05, 2021
            </Typography>
          </ListItem>
          <Divider />

          <ListItem className={classes.caseHistoryList}>
            <Chip label="Action" className={classes.chip} />
            <ListItemText
              primary={
                <Typography variant="caption">
                  File uploaded <a href="#">"08381998.jpg"</a>
                </Typography>
              }
              style={{ flexGrow: 1 }}
            />
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                className={classes.caseHistoryAvatar}
                sx={{ width: 28, height: 28 }}
              />
            </ListItemAvatar>
            <Typography sx={{ fontSize: "11px", color: "#616161" }}>
              Aug 05, 2021
            </Typography>
          </ListItem>
          <Divider />

          <ListItem className={classes.caseHistoryList}>
            <Chip label="Meeting" className={classes.chip} />
            <ListItemText
              primary={
                <Typography variant="caption">
                  <a href="#">In-person-meeting</a> {" with client"}
                </Typography>
              }
              style={{ flexGrow: 1 }}
            />
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                className={classes.caseHistoryAvatar}
                sx={{ width: 28, height: 28 }}
              />
            </ListItemAvatar>
            <Typography sx={{ fontSize: "11px", color: "#616161" }}>
              Aug 05, 2021
            </Typography>
          </ListItem>
          <Divider />
        </List>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="caption">Showing 6 of 27 updates</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              <a href="#">Show all updates</a>
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
          defaultValue="SMIXOLEVI001"
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
          labelId="select-label"
          id="select"
          disableUnderline
          className={classes.caseSelect}
          input={<Input />}
          value={caseType}
          onChange={handleChange}
          
        >
          {caseTypeList?.map((value) => (
            <MenuItem
              className={classes.caseSelectMenuItem}
              key={value}
              value={value}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
        <InputLabel htmlFor="put-later" className={classes.plainLabel}>
          Client name:
        </InputLabel>
        <TextField
          variant="standard"
          defaultValue="Smith, Xoliswa"
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
        <Select
          labelId="select-label"
          id="select"
          disableUnderline
          className={classes.caseSelect}
          input={<Input />}
          value={caseWorker}
          onChange={handleChange2}
          
        >
          {caseWorkerList?.map((value) => (
            <MenuItem
              className={classes.caseSelectMenuItem}
              key={value}
              value={value}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
        <InputLabel htmlFor="put-later" className={classes.plainLabel}>
          Case office:
        </InputLabel>
        <Select
          labelId="select-label"
          id="select"
          disableUnderline
          className={classes.caseSelect}
          input={<Input  />}
          value={caseOffice}
          onChange={handleChange3}
          
        >
          {caseOffices?.map((value) => (
            <MenuItem
              className={classes.caseSelectMenuItem}
              key={value}
              value={value}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
        <InputLabel htmlFor="put-later" className={classes.plainLabel}>
          Date created:
        </InputLabel>
        <TextField
          variant="standard"
          defaultValue="01/01/2020"
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
