import React, { useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";

import {
  Divider,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@material-ui/core";
import List from "@mui/material/List";
import { logLabel, useStyles } from "../../utils";
import i18n from "../../i18n";
import { format } from "date-fns";
import { ILog, IUser } from "../../types";
import { caseHistoryUpdateText } from "../../components";

type Props = {
  logs: ILog[];
  standalone: boolean;
  users: IUser[];
};

const Component = (props: Props) => {
  const history = useHistory();
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
        {filteredLogs
          ? filteredLogs
              ?.slice(0)
              .reverse()
              .map((item) => caseHistoryUpdateText(item, classes, history))
          : ""}
      </List>
    </div>
  );
};

Component.defaultProps = {
  standalone: true,
};

export default Component;
