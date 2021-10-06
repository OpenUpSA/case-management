import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from '@mui/icons-material/AddBox';

import {
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from "@material-ui/core";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { format } from "date-fns";
import { getLegalCases, getClients } from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";

type Props = {
  meetings: IMeeting[];
  standalone: boolean;
};

const Component = (props: Props) => {
  const history = useHistory();
  const classes = useStyles();
  const [clients, setClients] = React.useState<IClient[]>();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [filteredMeetings, setfilteredMeetings] = React.useState<IMeeting[]>();
  const [filterMeetingsValue, setfilterMeetingsValue] =
    React.useState<string>();

  const filterKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    filterMeetings();
  };


  //TODO: Better filtering
  const filterMeetings = () => {
    if (filterMeetingsValue) {
      setfilteredMeetings(
        props.meetings.filter((meeting) => {
          return (
            meeting.location
              .toLowerCase()
              .includes(filterMeetingsValue.toLowerCase()) ||
            meeting.meeting_type
              .toLowerCase()
              .includes(filterMeetingsValue.toLowerCase()) ||
            meeting.notes
              .toLowerCase()
              .includes(filterMeetingsValue.toLowerCase())
          );
        })
      );
    } else {
      setfilteredMeetings(props.meetings);
    }
  };

  useEffect(() => {
    if (props.meetings.length > 0 && typeof filteredMeetings === "undefined") {
      filterMeetings();
    }
  });

  useEffect(() => {
    async function fetchData() {
      const dataClients = await getClients();
      const dataLegalCases = await getLegalCases();
      setLegalCases(dataLegalCases);
      setClients(dataClients);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        className={classes.containerMarginBottom}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <strong>
            {filteredMeetings ? filteredMeetings.length : "0"}{" "}
            {i18n.t("Meetings")}
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
        <Grid item className={classes.zeroWidthOnMobile}>
          <Button
            className={classes.canBeFab}
            color="primary"
            variant="contained"
            startIcon={<AddBoxIcon />}
            style={{ textTransform: "none" }}
          >
            {i18n.t("New meeting")}
          </Button>
        </Grid>
      </Grid>
      <Grid md={12} className={classes.containerMarginBottom}>
        <Input
          id="table_search"
          fullWidth
          placeholder={i18n.t("Enter a meeting location, type, or note...")}
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
          value={filterMeetingsValue}
          onChange={(e) => setfilterMeetingsValue(e.target.value)}
          onKeyUp={filterKeyUp}
        />
      </Grid>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.tableHeadCell}>
                {i18n.t("Meeting name")}
              </TableCell>

              <TableCell className={classes.tableHeadCell} >
                {i18n.t("Date")}
              </TableCell>
              <TableCell className={classes.tableHeadCell} colSpan={2}>
                {i18n.t("Type")}
              </TableCell>
            </TableRow>
          </TableHead>
          {filteredMeetings && filteredMeetings.length > 0 ? (
            <TableBody>
              {filteredMeetings.map((meeting) => (
                <TableRow
                  key={meeting.id}
                  className={classes.tableBodyRow}
                  onClick={() => {
                    history.push(`/meetings/${meeting.id}`);
                  }}
                >
                  
                    <TableCell className={classes.tableBodyCell}>
                      {meeting.name}
                    </TableCell>
                  
                    <TableCell className={classes.tableBodyCell}>
                    {format(
                      new Date(meeting.meeting_date),
                      "MM/dd/yyyy (h:ma)"
                    )}
                  </TableCell>

                  <TableCell className={classes.tableBodyCell}>
                    {meeting.meeting_type}
                  </TableCell>
                  
                  <TableCell className={classes.tableBodyCell} align="right">
                    <ArrowRightAltIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow
                className={`${classes.tableBodyRow} ${classes.tableBodyRowEmpty}`}
              >
                <TableCell
                  colSpan={4}
                  className={classes.tableBodyCell}
                ></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

// Component.defaultProps = {
//   standalone: true,
// };

export default Component;
