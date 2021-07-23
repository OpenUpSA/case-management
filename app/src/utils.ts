import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

//TODO: Find I18n version of this
export function toSentence(items: string[]): string {
  let sentence: string =
    items.slice(0, -1).join(", ") + " and " + items.slice(-1).join();
  return sentence;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    zeroWidthOnMobile: {
      [theme.breakpoints.down("xs")]: {
        width: "0",
        padding: "0!important" as any,
      },
    },
    canBeFab: {
      [theme.breakpoints.down("xs")]: {
        margin: "0px",
        right: "16px",
        bottom: "20px",
        position: "fixed",
        "z-index": "1300",
      },
    },
    appBar: {
      "z-index": "100000",
    },
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      paddingLeft: "2em",
      paddingRight: "2em",
      borderRight: "none",
      width: "350px",
    },
    drawerContainer: {
      overflow: "auto",
    },
    drawerListFooter: {
      position: "fixed",
      bottom: "1em",
    },
    breadcrumbs: {
      [theme.breakpoints.up("md")]: {
        marginTop: "66px",
        marginBottom: "46px",
      },
      [theme.breakpoints.down("xs")]: {
        marginTop: "59px",
        marginBottom: "26px",
      },
      paddingTop: "0.75em",
      paddingBottom: "0.75em",
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      "& ol": {
        maxWidth: "960px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "24px",
        paddingRight: "24px",
        "& li": {
          "& div": {
            padding: "6px 8px",
            lineHeight: "1.75",
            fontWeight: "500",
            letterSpacing: "0.02857em",
            fontSize: "0.75em",
            color: "black",
          },
          "& a": {
            fontSize: "0.75em",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            textTransform: "none",
            color: "black",
          },
          "& button": {
            fontSize: "0.75em",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            textTransform: "none",
            color: "black",
          },
        },
      },
    },
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
      "& td:first-child": {
        fontWeight: "bold",
      },
    },
    tableBodyCell: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      padding: "6px 10px",
      border: "none",
      borderRight: "solid 1px rgba(0, 0, 0, 0.05)",
    },
    hrInvisible: {
      height: "1px",
      border: "none",
    },
    hr: {
      height: "1px",
      border: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      margin: "2em 0",
    },
    select: {
      backgroundColor: "rgba(0, 0, 0, 0.035)",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
        "&>.MuiSelect-icon": {
          display: "none",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(0, 0, 0, 0.01)",
        borderColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    textField: {
      backgroundColor: "rgba(0, 0, 0, 0.035)",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(0, 0, 0, 0.01)",
        borderColor: "rgba(0, 0, 0, 0.1)",
      },
      "& textarea": {
        paddingTop: "8px",
        paddingBottom: "8px",
      },
    },
    inputLabel: {
      color: "#000",
      fontWeight: 700,
      fontSize: "1.2em",
      "&.Mui-focused": {
        color: "unset",
      },
    },
    pageBar: {
      marginBottom: "50px",
    },
    cursorPointer: {
      cursor: "pointer",
    }
  })
);
