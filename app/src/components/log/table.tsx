import React, { useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";

import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import userDefaultAvatar from "../../user-default-avatar.jpeg";
import { BlackTooltip } from "../general/tooltip";

import {
  Divider,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Box,
} from "@material-ui/core";
import List from "@mui/material/List";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { format } from "date-fns";
import { ILog, IUser } from "../../types";

const LogLabels = new Map([
  ["LegalCase Create", "Case created"],
  ["LegalCase Update", "Case update"],
  ["LegalCase Delete", "Case deleted"],
  ["Meeting Create", "New meeting"],
  ["Meeting Update", "Meeting updated"],
  ["Meeting Delete", "Meeting deleted"],
  ["File Create", "File uploaded"],
  ["File Update", "File updated"],
  ["File Delete", "File deleted"],
  ["Note Create", "New note"],
  ["Note Update", "Note updated"],
  ["Note Delete", "Note deleted"],
  ["CaseOffice Create", "New case office"],
  ["CaseType Create", "New case type"],
  ["Client Create", "New client"],
  ["Client Update", "Client update"],
  ["Client Delete", "Client deleted"],
  ["CaseUpdate Create", "New update"],
  ["CaseUpdate Delete", "Update deleted"],
]);

const logLabel = (
  targetAction: string | undefined,
  targetType: string | undefined
) => {
  return LogLabels.get(`${targetType} ${targetAction}`);
};

type Props = {
  logs: ILog[];
  standalone: boolean;
  users: IUser[];
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [filteredLogs, setfilteredLogs] = React.useState<ILog[]>();
  const [filterLogsValue, setfilterLogsValue] = React.useState<string>();

  const filterKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    filterLogs();
  };

  //TODO: Better filtering
  const filterLogs = () => {
    if (filterLogsValue) {
      setfilteredLogs(
        props.logs.filter((log) => {
          return (
            log.action.toLowerCase().includes(filterLogsValue.toLowerCase()) ||
            log.note?.toLowerCase().includes(filterLogsValue.toLowerCase()) ||
            log.target_type
              .toLowerCase()
              .includes(filterLogsValue.toLowerCase())
          );
        })
      );
    } else {
      setfilteredLogs(props.logs);
    }
  };

  useEffect(() => {
    if (props.logs.length > 0 && typeof filteredLogs === "undefined") {
      filterLogs();
    }
  });

  return (
    <div>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item style={{ flexGrow: 1 }}>
          <strong>
            {filteredLogs ? filteredLogs.length : "0"} {i18n.t("Logs")}
          </strong>
        </Grid>
        <Grid item>
          <InputLabel
            className={classes.inputLabel}
            htmlFor="sort_table"
            shrink={true}
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
        <Grid item md={12}>
          <Input
            id="table_search"
            fullWidth
            placeholder={i18n.t("Search updates...")}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon color="primary" />
                </IconButton>
              </InputAdornment>
            }
            disableUnderline={true}
            className={classes.textField}
            aria-describedby="my-helper-text"
            value={filterLogsValue}
            onChange={(e) => setfilterLogsValue(e.target.value)}
            onKeyUp={filterKeyUp}
          />
        </Grid>
      </Grid>
      <List sx={{ width: "100%", marginBottom: "26px" }}>
        <Divider />
        {filteredLogs
          ? filteredLogs
              ?.slice(0)
              .reverse()
              .map((item) => (
                <>
                  <ListItem className={classes.caseHistoryList}>
                    <Chip
                      label={logLabel(item.action, item.target_type)}
                      className={classes.chip}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="caption">{item.note}</Typography>
                      }
                      style={{ flexGrow: 1 }}
                      className={`${classes.caseHistoryText} ${classes.noOverflow}`}
                    />
                    <Box className={classes.caseHistoryBox}>
                      <BlackTooltip
                        title={props.users
                          ?.filter(
                            (user: IUser) =>
                              [item.user].indexOf(user.id as number) > -1
                          )
                          .map((user: IUser) => user.name)}
                        arrow
                        placement="top"
                      >
                        <img
                          className={classes.updateAvatar}
                          src={userDefaultAvatar}
                          alt={"user"}
                          loading={"lazy"}
                        />
                      </BlackTooltip>
                      <Typography sx={{ fontSize: "11px", color: "#616161" }}>
                        {format(new Date(item?.created_at!), "MMM dd, yyyy")}
                      </Typography>
                    </Box>
                  </ListItem>
                  <Divider />
                </>
              ))
          : ""}
      </List>
    </div>
  );
};

Component.defaultProps = {
  standalone: true,
};

export default Component;
