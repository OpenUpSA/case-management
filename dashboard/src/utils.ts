import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

export function yearMonthLabel(date: Date) {
  const label = date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
  });
  return label;
}

export function monthLabel(date: Date) {
  const label = date.toLocaleDateString("en", {
    month: "short",
  });
  return label;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: "100px",
      width: "100px",
      borderRadius: "50%",
    },
    customAppBar: {
      zIndex: "100000!important" as any,
    },
    cursorPointer: {
      cursor: "pointer",
    },
    logo: {
      cursor: "pointer",
      height: "35px",
    },
    logoCustom: {
      height: "35px",
      marginLeft: "10px"
    },
    root: {
      paddingTop: "20px",
      paddingLeft: "20px",
      marginTop: "30px",
      backgroundColor: "#fafafa",
    },
    container: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    inputLabel: {
      color: "#000",
      fontWeight: 700,
      fontSize: "1.2em",
      "&.Mui-focused": {
        color: "unset",
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
      "&.MuiInputBase-root": {
        marginTop: "25px",
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
    body: {
      backgroundColor: "#fafafa",
      paddingBottom: "10em",
      marginTop: "60px!important" as any,
      [theme.breakpoints.down("xs")]: {
        paddingBottom: "4em",
      },
    },
    cardUserName: {
      fontWeight: 700,
    },
    userCaseOffice: {
      fontWeight: 700,
    },
    drawerListFooter: {
      position: "fixed!important" as any,
      bottom: "1em",
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
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
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
  })
);
