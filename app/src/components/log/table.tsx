
import React, { useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {
  Grid,
  IconButton,
  Input,
  InputAdornment,
} from "@material-ui/core";
import List from "@mui/material/List";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
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
        <Grid item md={12}>
          <Input
            fullWidth
            placeholder={i18n.t("Filter history...")}
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
              .map((item) => caseHistoryUpdateText(item, classes, history))
          : ""}
      </List>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="caption">
            Showing {filteredLogs?.length} of {props.logs?.length}{" "}
            updates
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  standalone: true,
};

export default Component;
