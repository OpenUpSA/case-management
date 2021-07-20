import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import i18n from "../../i18n";
import { IMeeting } from "../../types";

type Props = {
  meeting: IMeeting;
  readOnly: boolean;
};

const Component = (props: Props) => {
  const [meeting, setMeeting] = useState<IMeeting>({
    location: "",
    meeting_date: new Date().toISOString().slice(0, 16),
    meeting_type: "",
    legal_case: 0,
    notes: "",
  });

  useEffect(() => {
    setMeeting(props.meeting);
  }, [props.meeting]);

  return (
    <div>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item style={{ flexGrow: 1 }}>
          <TextField
            id="location"
            label={i18n.t("Location")}
            value={meeting.location}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMeeting((meeting) => ({
                ...meeting,
                location: e.target.value,
              }));
            }}
          />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <TextField
            id="meetingType"
            label={i18n.t("Meeting type")}
            value={meeting.meeting_type}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMeeting((meeting) => ({
                ...meeting,
                meeting_type: e.target.value,
              }));
            }}
          />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <TextField
            id="meetingDate"
            label={i18n.t("Meeting date")}
            value={new Date(meeting.meeting_date).toISOString().slice(0, 16)}
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            variant={props.readOnly ? "filled" : "outlined"}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMeeting((meeting) => ({
                ...meeting,
                meeting_date: new Date(e.target.value).toISOString().slice(0, 16),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="notes"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: props.readOnly }}
            label={i18n.t("Notes")}
            multiline
            rows={10}
            fullWidth
            value={meeting.notes}
            variant={props.readOnly ? "filled" : "outlined"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMeeting((meeting) => ({
                ...meeting,
                notes: e.target.value,
              }));
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {
  readOnly: true,
};

export default Component;
