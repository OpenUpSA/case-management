import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

//TODO: Find I18n version of this
export function toSentence(items: string[]): string {
  let sentence: string =
    items.slice(0, -1).join(", ") + " and " + items.slice(-1).join();
  return sentence;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formError: {
      color: "#990000",
      textAlign: "center",
    },
    body: {
      paddingBottom: "10em",
      [theme.breakpoints.down("xs")]: {
        paddingBottom: "4em",
      },
    },
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
        zIndex: "1300!important" as any,
      },
    },
    customAppBar: {
      zIndex: "100000!important" as any,
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
      position: "fixed!important" as any,
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
      paddingTop: "0.45em",
      paddingBottom: "0.55em",
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      "& ol": {
        maxWidth: "960px",
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.up("md")]: {
          paddingLeft: "24px",
          paddingRight: "24px",
        },
        [theme.breakpoints.down("xs")]: {
          paddingLeft: "14px",
          paddingRight: "14px",
        },
        "& li": {
          "& div": {
            padding: "6px 8px",
            lineHeight: "1.75",
            fontWeight: "500",
            letterSpacing: "0.02857em",
            fontSize: "0.75em",
            color: "black",
            minWidth: "7em",
            textAlign: "center",
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
            minHeight: "2.5em",
            minWidth: "7em",
          },
        },
      },
    },
    table: {
      backgroundColor: "transparent",
      borderCollapse: "separate!important" as any,
      borderSpacing: "0 10px!important" as any,
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
        padding: "10px 10px 4px 0!important" as any,
      },
      "&>:nth-last-child(2)": {
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
    tableBodyRowEmpty: {
      "&>:last-child": {
        padding: "1.5em!important" as any,
      },
      "&:hover td": {
        cursor: "unset",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
    },
    tableBodyCell: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      padding: "6px 10px!important" as any,
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
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    selectStatus: {
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        "&>:nth-child(2)": {
          width: "90vw!important" as any,
        },
        "& p": {
          margin: 0,
        },
      },
      "& p": {
        fontSize: "14px",
        fontWeight: "700",
        //margin: "1px"
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
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        "&>:nth-child(3)": {
          order: 4,
        },
        "&>:nth-child(4)": {
          order: 3,
        },
      },
    },
    cursorPointer: {
      cursor: "pointer",
    },
    vertButton: {
      borderRadius: "4px!important" as any,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      padding: "8px 7px 7px 7px!important" as any,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)!important" as any,
      },
    },
    root: {
      paddingTop: "20px",
      paddingLeft: "20px",
      marginTop: "30px",
      backgroundColor: "#f2f2ff",
    },
    media: {
      height: "100px",
      width: "100px",
      borderRadius: "50%",
    },
    cardUserName: {
      fontWeight: 700,
    },
    userCaseOffice: {
      fontWeight: 700,
    },
    containerMarginBottom: {
      marginBottom: "28px",
      [theme.breakpoints.down("md")]: {
        marginBottom: "26px",
      },
    },
  })
);
