import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import Typography from "@mui/material/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import { ILog } from "./types";
import { fileTypeText, logLabel, paddedUpdateId } from "./utils";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import { BlackTooltip } from "./components/general/tooltip";

export const userInitials = (item: ILog) => {
  // Create circle with text initials
  const name = item.extra ? item.extra.user.name : "@";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("");
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "10px",
        bgcolor: "#f5f5f5",
        border: "1px solid #eee",
      }}
    >
      {initials}
    </Box>
  );
};

export const caseHistoryUpdateText = (
  item: ILog,
  classes: any,
  history: any
) => {
  let text = <></>;
  let display = true;

  switch (true) {
    case item?.changes?.length > 0 &&
      item.action === "Update" &&
      item.target_type === "File":
      text = (
        <>
          Filename updated (
          <Link
            className={classes.aWithCursorPointer}
            href={"/files/" + item.target_id}
            target="_blank"
          >
            {item.note}
          </Link>
          ).
        </>
      );
      break;

    case item.action === "Create" && item.target_type === "File":
      text = (
        <>
          New {fileTypeText(item.note.split(".").pop())} uploaded (
          <Link
            className={classes.aWithCursorPointer}
            href={"/files/" + item.target_id}
            target="_blank"
          >
            {item.note}
          </Link>
          ).
        </>
      );
      break;

    case item.action === "Delete" && item.target_type === "File":
      text = <>File deleted ({item.note}).</>;
      break;

    case item.changes?.length > 0 &&
      item.action === "Create" &&
      item.target_type === "Meeting":
      text = (
        <>
          New {item.changes?.find((c) => c.field === "meeting_type")?.value}{" "}
          meeting added (
          <Link
            className={classes.aWithCursorPointer}
            onClick={() => {
              history.push(`/meetings/${item.target_id}/edit`);
            }}
          >
            {paddedUpdateId(item.target_id)}
          </Link>
          ). "{item.changes?.find((c) => c.field === "notes")?.value}"
        </>
      );
      break;

    case item.action === "Create" && item.target_type === "Note":
      text = (
        <>
          New note added (
          <Link
            className={classes.aWithCursorPointer}
            onClick={() => {
              history.push(`/notes/${item.target_id}/edit`);
            }}
          >
            {paddedUpdateId(item.target_id)}
          </Link>
          ). "{item.note}"
        </>
      );
      break;

    case item?.changes?.length > 0 &&
      item.action === "Update" &&
      item.target_type === "Meeting":
      text = (
        <>
          Meeting updated (
          <Link
            className={classes.aWithCursorPointer}
            onClick={() => {
              history.push(`/meetings/${item.target_id}/edit`);
            }}
          >
            {paddedUpdateId(item.target_id)}
          </Link>
          ). "{item.changes?.slice(-1)[0].value}"
        </>
      );

      break;

    case item.action === "Update" && item.target_type === "Note":
      text = (
        <>
          Note updated (
          <Link
            className={classes.aWithCursorPointer}
            onClick={() => {
              history.push(`/notes/${item.target_id}/edit`);
            }}
          >
            {paddedUpdateId(item.target_id)}
          </Link>
          ). "{item.note}"
        </>
      );
      break;

    case item.changes?.length > 0 &&
      item.action === "Create" &&
      item.target_type === "Client" &&
      typeof item.changes?.find((c) => c.field === "preferred_name") !==
        "undefined":
      text = (
        <>
          New client added:{" "}
          <Link
            className={classes.aWithCursorPointer}
            href={`/clients/${item.target_id}`}
          >
            {item.changes?.find((c) => c.field === "preferred_name")?.value}
          </Link>
          .
        </>
      );
      break;

    case item.changes?.length > 0 &&
      item.action === "Create" &&
      item.target_type === "CaseType":
      text = (
        <>
          New case type added:{" "}
          {item.changes?.find((c) => c.field === "title")?.value}.
        </>
      );
      break;

    case item.changes?.length > 0 &&
      item.action === "Create" &&
      item.target_type === "CaseOffice":
      text = (
        <>
          New case office added:{" "}
          {item.changes?.find((c) => c.field === "name")?.value}.
        </>
      );
      break;

    case item.changes?.length > 0 &&
      item.action === "Create" &&
      item.target_type === "LegalCase" &&
      typeof item.changes?.find((c) => c.field === "client") !== "undefined":
      text = (
        <>
          Case created for{" "}
          {item.changes?.find((c) => c.field === "client")?.value} (
          <Link
            className={classes.aWithCursorPointer}
            href={`/cases/${item.parent_id}`}
          >
            {item.changes?.find((c) => c.field === "case_number")?.value}
          </Link>
          ).
        </>
      );
      break;

    case item?.changes?.length > 0 &&
      item.action === "Update" &&
      item.target_type === "Client" &&
      item.changes?.[0]?.field !== "users" &&
      item.changes?.[0]?.field !== "dependents":
      text = (
        <>
          Client {item.changes?.[0].field.replaceAll("_", " ")} changed (
          <Link
            className={classes.aWithCursorPointer}
            href={`/clients/${item.target_id}`}
          >
            {item.note}
          </Link>
          ). "{item.changes?.[0].value}"
        </>
      );
      break;

    case item?.changes?.length > 0 &&
      item.action === "Update" &&
      item.target_type === "LegalCase" &&
      item.changes?.[0]?.field !== "case_types" &&
      item.changes?.[0]?.field !== "users" &&
      item.changes?.[0]?.value !== "":
      text = (
        <>
          Case {item.changes?.[0]?.field.replaceAll("_", " ")} changed (
          <Link
            className={classes.aWithCursorPointer}
            href={`/cases/${item.parent_id}`}
          >
            {item.note}
          </Link>
          ). "{item.changes?.[0]?.value}"
        </>
      );
      break;

    case item.action === "Delete" && item.target_type === "LegalCase":
      text = <>Case deleted ({item.note}).</>;
      break;

    case item.action === "Delete" && item.target_type === "Client":
      text = <>Client deleted ({item.note}).</>;
      break;

    case item.action === "Create" && item.target_type === "LegalCaseReferral":
      text = (
        <>
          New referral (
          <Link
            className={classes.aWithCursorPointer}
            href={"/referrals/" + item.target_id}
          >
            {paddedUpdateId(item.target_id)}
          </Link>
          ).
        </>
      );
      break;
    case item.action === "Update" && item.target_type === "LegalCaseReferral":
      text = (
        <>
          Updated referral (
          <Link
            className={classes.aWithCursorPointer}
            href={"/referrals/" + item.target_id}
          >
            {paddedUpdateId(item.target_id)}
          </Link>
          ).
        </>
      );
      break;

    case item.action === "Delete" && item.target_type === "LegalCaseReferral":
      text = <>Referral deleted ({paddedUpdateId(item?.note?.match(/(\d+)/)?.[0])}).</>;
      break;

    default:
      display = false;
      text = (
        <>
          <b>
            {item.note} - {item.action} - {item.target_type}
          </b>
        </>
      );
      break;
  }
  if (display) {
    return (
      <React.Fragment key={`caseHistory_${item.id}`}>
        <ListItem className={classes.caseHistoryList}>
          <Chip
            label={logLabel(item.action, item.target_type)}
            className={classes.chip}
          />
          <ListItemText
            primary={<Typography variant="caption">{text}</Typography>}
            className={`${classes.caseHistoryText} ${classes.noOverflow}`}
          />
          <Box className={classes.caseHistoryBox}>
            <BlackTooltip
              title={item.extra ? item.extra.user.name : "System"}
              arrow
              placement="top"
            >
              {userInitials(item)}
            </BlackTooltip>

            <Typography sx={{ fontSize: "11px", color: "#616161" }}>
              {format(new Date(item?.created_at!), "MMM dd, yyyy")}
            </Typography>
          </Box>
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  }
};
