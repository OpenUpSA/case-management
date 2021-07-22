import { FormControl, Grid, Input, InputLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IMeeting } from "../../types";
import { useStyles } from "../../utils";

type Props = {
  meeting?: IMeeting;
  readOnly: boolean;
};

const Component = (props: Props) => {
  const classes = useStyles();
  const [meeting, setMeeting] = useState<IMeeting>({
    location: "",
    meeting_date: new Date().toISOString().slice(0, 16),
    meeting_type: "",
    legal_case: 0,
    notes: "",
  });

  useEffect(() => {
    if (props.meeting) {
      setMeeting(props.meeting);
    }
  }, [props.meeting]);

  return (
    <div>
      <Grid
        className={classes.pageBar}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="location"
              shrink={true}
            >
              {i18n.t("Location")}:
            </InputLabel>
            <Input
              id="location"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  location: e.target.value,
                }));
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="meeting_type"
              shrink={true}
            >
              {i18n.t("Meeting type")}:
            </InputLabel>
            <Input
              id="meeting_type"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.meeting_type}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  meeting_type: e.target.value,
                }));
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="meeting_date"
              shrink={true}
            >
              {i18n.t("Meeting date")}:
            </InputLabel>
            <Input
              id="meeting_date"
              type="datetime-local"
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={new Date(meeting.meeting_date || 0).toISOString().slice(0, 16)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  meeting_date: e.target.value,
                }));
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="notes"
              shrink={true}
            >
              {i18n.t("Notes")}:
            </InputLabel>
            <Input
              id="notes"
              multiline
              rows={25}
              disableUnderline={true}
              disabled={props.readOnly}
              className={classes.textField}
              aria-describedby="my-helper-text"
              value={meeting.notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMeeting((meeting) => ({
                  ...meeting,
                  notes: e.target.value,
                }));
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
};

export default Component;
