import { makeStyles } from "@material-ui/core";

//TODO: Find I18n version of this
export function toSentence(items: string[]): string {
  let sentence: string =
    items.slice(0, -1).join(", ") + " and " + items.slice(-1).join();
  return sentence;
}

export const useStyles = makeStyles({
  table: {
    backgroundColor: "transparent",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },
  tableHeadRow: {
    backgroundColor: "transparent",
    "&>:last-child": {
      borderRight: "none",
    },
  },
  tableHeadCell: {
    padding: "6px 10px",
    border: "none",
    borderRight: "solid 1px rgba(0, 0, 0, 0.05)",
  },
  tableBodyRow: {
    "&>:last-child": {
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
      borderRight: "none",
    },
    "&>:first-child": {
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
    },
    "&:hover td": {
      cursor: "pointer",
      backgroundColor: "rgba(0, 0, 0, 0.09)",
    },
  },
  tableBodyCell: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: "6px 10px",
    border: "none",
    borderRight: "solid 1px rgba(0, 0, 0, 0.05)",
  },
});
