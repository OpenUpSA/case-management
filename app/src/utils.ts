import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";

//TODO: Find I18n version of this
export function toSentence(items: string[]): string {
  let sentence: string =
    items.slice(0, -1).join(", ") + " and " + items.slice(-1).join();
  return sentence;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        overflowY: "scroll",
      },
      ".MuiDialog-root": {
        zIndex: "2147483640!important",
      },
      ".MuiPopover-root": {
        zIndex: "2147483640!important",
      },
      ".MuiSvgIcon-colorPrimary": {
        color: "#2b61f0!important",
      },
      ".MuiDivider-root": {
        borderColor: "rgba(0, 0, 0, 0.05)!important",
      },
      ".MuiBreadcrumbs-separator": {
        fontSize: "1em",
        color: "#000"
      },
    },
    underBreadCrumbHeader: {
      position: "sticky",
      top: "50px",
      backgroundColor: "#666666",
      color: "#fff",
      fontWeight: 700,
      minHeight: "3rem",
      display: "flex",
      alignItems: "center",
      fontSize: "18.2px",
      zIndex: 11,
      marginBottom: "25px"
    },
    underBreadCrumbHeaderIcon: {
      marginRight: "10px",
      verticalAlign: "-3px",
      fontSize: "18px!important",
    },
    underBreadCrumbHeaderLink: {
      color: "#fff",
      cursor: "pointer",
      "&:hover": {
        color: "#fff",
        textDecoration: "underline",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
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
        margin: "0",
        right: "16px",
        bottom: "20px",
        position: "fixed",
        zIndex: "1300!important" as any,
      },
    },
    bigCanBeFab: {
      paddingTop: "10px",
      paddingBottom: "10px",
      textTransform: "none",
      [theme.breakpoints.down("xs")]: {
        width: "90%",
        margin: "0",
        right: "16px",
        bottom: "20px",
        position: "fixed",
        zIndex: "1300!important" as any,
      },
    },
    customAppBar: {
      zIndex: "2000!important" as any,
      height: "66px",
    },
    drawer: {
      flexShrink: 0,
    },
    navbarUserContext: {},
    navbarUserName: {
      letterSpacing: "-.03em",
      fontWeight: 700,
      fontSize: "14px",
      padding: 0,
      margin: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "20em",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "10em",
      },
    },
    navbarInstanceAndOffice: {
      color: "rgba(0, 0, 0, .5)",
      letterSpacing: "-0.03em",
      fontSize: "14px",
      padding: 0,
      margin: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "20em",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "10em",
      },
    },
    navbarOfficeName: {},
    navbarInstanceName: {
      paddingLeft: "0.3em",
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
      "& ol": {
        "& li": {
          "& div": {
            padding: "6px 0px",
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
            backgroundColor: "#e6e6e6",
            textTransform: "none",
            color: "black",
            minHeight: "2.5em",
            minWidth: "7em",
            "&:hover": {
              backgroundColor: "#d9d9d9",
            },
          },
        },
      },
    },
    breadCrumbHeader: {
      position: "sticky",
      top: "0",
      zIndex: 11,
      backgroundColor: "#f2f2f2",
      minHeight: "50px",
      display: "flex",
      alignItems: "center",
    },

    table: {
      backgroundColor: "transparent",
      borderCollapse: "separate!important" as any,
      borderSpacing: "0 10px!important" as any,
      "& .MuiTableCell-root": {
        borderBottomColor: "rgba(0, 0, 0, 0.05)",
      },
    },
    tableHeadRow: {
      backgroundColor: "transparent",
      boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.05)",
      marginBottom: "20px!important" as any,
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

    tableVariant: {
      marginTop: "20px",
      "& .MuiTableCell-root": {
        borderBottomColor: "rgba(0, 0, 0, 0.05)",
      },
      "& .MuiTableCell-head": {
        fontWeight: "600",
      },
    },
    tableHeadRowVariant: {
      boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.05)",
    },
    tableHeadCellVariant: {},
    tableHeadCellValueWrapperVariant: {
      borderRight: "solid 1px rgba(0, 0, 0, 0.05)",
      display: "block",
    },
    tableBodyRowVariant: {
      "&:last-child td": {
        border: "none",
      },
      "&:hover td": {
        cursor: "pointer",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
    },
    tableBodyRowEmptyVariant: {
      "&:hover td": {
        cursor: "unset",
        backgroundColor: "unset",
        display: "none",
      },
    },
    tableBodyCellVariant: {},
    tableBodyCellValueWrapperVariant: {
      borderRight: "solid 1px rgba(0, 0, 0, 0.05)",
      display: "block",
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
      fontSize: "14px",
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
      },
    },
    textField: {
      backgroundColor: "rgba(0, 0, 0, 0.035)",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "2px",
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
      },
      "&.Mui-focused": {      
      },
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
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
      marginBottom: "20px",
      marginTop: "25px",
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
    pageBarHead: {
      boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.05)",
    },
    lineHeightSmall: {
      lineHeight: "1",
    },
    pageBarTemp: {
      marginTop: "-24px",
      marginBottom: "20px",
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
    fullHeightContainedButton:
    { 
      height: "52px",
      width: "53px",
      minWidth: "53px",
      backgroundColor: "#e5e5e5",
    },
    
    logo: {
      cursor: "pointer",
      height: "35px",
    },
    logoCustom: {
      height: "35px",
      width: "35px",
      marginRight: "5px",
      borderRadius: "100%",
    },
    cursorPointer: {
      cursor: "pointer",
    },
    vertButton: {
      borderRadius: "8px!important" as any,
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
    caseInfoContainer: {
      position: "relative",
      "&>:first-child": {
        order: 1,
        [theme.breakpoints.down("sm")]: {
          order: 2,
        },
      },
      "&>:last-child": {
        order: 2,
        [theme.breakpoints.down("sm")]: {
          order: 1,
        },
      },
    },
    aWithCursorPointer: {
      cursor: "pointer",
    },
    caseHistoryList: {
      height: "52px",
      maxHeight: "52px!important" as any,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.035)!important" as any,
      },
    },
    caseHistoryAvatar: {
      width: "28px!important" as any,
      height: "28px!important" as any,
      border: "0.5px solid transparent",
      "&:hover": {
        border: "0.5px solid blue",
      },
    },
    caseHistoryText: {
      flexGrow: 1,
      paddingRight: "20px!important" as any,
      [theme.breakpoints.down("xs")]: {
        paddingRight: 0,
      },
    },
    caseHistoryBox: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      minWidth: 120,
      marginLeft: "auto",
      [theme.breakpoints.down("xs")]: {
        minWidth: 60,
      },
    },
    smallTextField: {
      minHeight: "36px!important" as any,
      backgroundColor: "#f2f2f2",
      borderRadius: "5px!important" as any,
      padding: "8px 0 0 10px!important" as any,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    discardButton: {
      backgroundColor: "#dadada!important" as any,
      borderRadius: "5px!important" as any,
      padding: "15px!important" as any,
    },
    saveButton: {
      borderRadius: "5px!important" as any,
      backgroundColor: "#00d97e!important" as any,
      padding: "15px!important" as any,
      marginRight: "8px!important" as any,
      position: "relative",
      "&.Mui-disabled": {
        backgroundColor: "#dadada!important" as any,
      },
    },
    plainLabel: {
      fontSize: "12px!important" as any,
      color: "#000!important" as any,
      marginTop: "10px!important" as any,
      marginBottom: "3px!important" as any,
    },
    chip: {
      backgroundColor: "#deebff!important" as any,
      borderRadius: "5px!important" as any,
      color: "blue!important" as any,
      marginRight: "5px!important" as any,
      fontSize: "12px!important" as any,
      height: "20px!important" as any,
      minWidth: "69px!important" as any,
    },
    chipGrey: {
      backgroundColor: "#eee!important" as any,
      borderRadius: "5px!important" as any,
      color: "000!important" as any,
      marginRight: "5px!important" as any,
      fontSize: "12px!important" as any,
      height: "20px!important" as any,
    },
    caseSummary: {
      marginBottom: "26px",
      backgroundColor: "#f2f2f2",
      position: "relative",
      zIndex: 10,
      "&:hover": {
        backgroundColor: "#dadada!important" as any,
      },
    },
    caseSelect: {
      backgroundColor: "#f2f2f2",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      fontSize: "13px!important" as any,
      height: "42px!important" as any,
      width: "102%!important" as any,
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
        "&>.MuiSelect-icon": {
          display: "none",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(0, 0, 0, 0.035)",
        borderColor: "rgba(0, 0, 0, 0.1)",
      },
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    caseSelectMenuItem: {
      fontSize: "13px!important" as any,
    },
    caseFiles: {
      height: "46px",
      backgroundColor: "#f2f2f2",
      marginBottom: "10px",
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      borderRadius: "4px",
      cursor: "pointer",
      "& p": {
        fontSize: "13px",
        fontWeight: 600,
      },
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    caseFilesItem: {
      display: "flex",
      alignItems: "center",
    },
    caseFileLabel: {
      color: "#000",
      fontSize: "13px",
      fontWeight: 600,
      paddingBottom: "20px",
    },
    caseTabButton: {
      "& p": {
        padding: "4px 12px 4px 0!important" as any,
        textTransform: "none",
        color: "black",
        fontWeight: 700,
      },
      "&.Mui-selected": {
        backgroundColor: "#f4f7fe",
      },
    },
    dialogTabButton: {
      height: "45px!important" as any,
      minHeight: "45px!important" as any,
      display: "flex!important" as any,
      flexDirection: "row!important" as any,
      alignItems: "center!important" as any,
      justifyContent: "space-around!important" as any,
      margin: "0 8px 16px 8px!important" as any,
      borderRadius: "6px!important" as any,
      backgroundColor: "#e5e5e5!important" as any,
      [theme.breakpoints.down("xs")]: {
        padding: "0!important" as any,
        maxWidth: "70px!important" as any,
        minWidth: "70px!important" as any,
        flexDirection: "column!important" as any,
        margin: "0 4px 16px 4px!important" as any,
      },
      "& p": {
        padding: "2px 4px!important" as any,
        textTransform: "none",
        color: "#000!important" as any,
        fontSize: "13px!important" as any,
        fontWeight: 700,
        lineHeight: "1.2!important" as any,
        [theme.breakpoints.down("xs")]: {
          padding: "0!important" as any,
        },
      },
      "&>.MuiSvgIcon-root": {
        marginBottom: "0!important" as any,
        color: "#000!important" as any,
        [theme.breakpoints.down("xs")]: {
          padding: "0!important" as any,
        },
      },
      "&.Mui-selected": {
        backgroundColor: "#2b61f0!important" as any,
        "&:hover": {
          backgroundColor: "#043ed9!important" as any,
        },
        "& p": {
          color: "#fff!important" as any,
        },
        "&>.MuiSvgIcon-root": {
          color: "#fff!important" as any,
        },
      },
      "&:hover": {
        backgroundColor: "#cccccc!important" as any,
      },
      "&.Mui-disabled": {
        display: "none!important" as any,
      },
    },
    clientDetailLabel: {
      color: "#000",
      fontSize: "1.2em",
      "&.Mui-focused": {
        color: "unset",
      },
    },
    clientDetailInput: {
      backgroundColor: "rgba(0, 0, 0, 0.035)",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      fontSize: "13px!important" as any,
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "#00d97e",
      },
      "& textarea": {
        paddingTop: "8px",
        paddingBottom: "8px",
      },
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
      "&.MuiInputBase-root": {
        marginTop: "25px",
      },
    },
    clientDetailSelect: {
      backgroundColor: "rgba(0, 0, 0, 0.035)",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      fontSize: "13px!important" as any,
      height: "42px!important" as any,
      width: "100%!important" as any,
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
        "&>.MuiSelect-icon": {
          display: "none",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(0, 0, 0, 0.035)",
        borderColor: "#00d97e",
      },
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
      "&.MuiInputBase-root": {
        marginTop: "25px",
      },
    },
    twoButtonContainer: {
      marginTop: "15px",
      marginBottom: "30px",
      zIndex: 2,
      position: "relative",
      transition: "all 0.3s ease-in-out",
    },
    fileMoreMenu: {
      position: "absolute",
      left: -150,
      display: "flex",
      flexDirection: "column",
      width: 180,
      backgroundColor: "#fff",
      borderRadius: 4,
      transition:
        "opacity 214ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 143ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
      boxShadow:
        "0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%);",
      fontSize: 16,
    },
    meetingFileButton: {
      width: "50%",
    },
    meetingCaseFile: {
      backgroundColor: "#f2f2f2",
      display: "flex",
      height: "42px",
      marginTop: "4px",
      marginLeft: "10px",
      marginRight: "10px",
      alignItems: "center",
      borderRadius: "4px",
      [theme.breakpoints.up("md")]: {
        justifyContent: "center",
      },
      "& p": {
        fontSize: "13px",
        fontWeight: 600,
      },
    },
    helpersBox: {
      width: "100%",
      [theme.breakpoints.up("md")]: {
        top: -40,
        position: "absolute",
      },
    },
    deleteMeetingFile: {
      width: "50%",
      textTransform: "none",
      backgroundColor: "maroon",
      color: "white",
      lineHeight: 1,
      "&:hover": {
        backgroundColor: "#b30900",
      },
    },
    noIndicator: {
      display: "none",
    },
    closeButton: {
      borderRadius: "8px",
      backgroundColor: "#f2f2f2",
      marginLeft: 10,
      width: "38px",
      height: "38px",
      position: "absolute",
      right: "28px",
      top: "28px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.2)!important" as any,
      },
    },
    closeButtonNoPos: {
      borderRadius: "50%",
      backgroundColor: "#f2f2f2",
      marginLeft: 10,
      width: "38px",
      height: "38px",
      marginTop: "28px",
      marginRight: "28px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.2)!important" as any,
      },
    },
    closeButtonIcon: {
      color: "#000",
      fontSize: "20px!important" as any,
      [theme.breakpoints.up("md")]: {
        fontSize: "28px!important" as any,
      },
    },
    dialogCancel: {
      backgroundColor: "#f2f2f2!important" as any,
      textTransform: "none!important" as any,
      color: "#000000!important" as any,
      paddingTop: "10px!important" as any,
      paddingBottom: "10px!important" as any,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.2)!important" as any,
      },
    },
    dialogSubmit: {
      paddingTop: "10px!important" as any,
      paddingBottom: "10px!important" as any,
      textTransform: "none!important" as any,
      whiteSpace: "nowrap!important" as any,
    },
    updateAlert: {
      height: "67px",
      margin: "20px 0",
      borderRadius: "6px!important" as any,
      backgroundColor: "#e9f0fe!important" as any,
      "&>.MuiAlert-icon": {
        alignItems: "center",
      },
      "& svg": {
        color: "#2b61f0",
      },
      "& div": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      "&>.MuiAlert-message": {
        color: "#2b61f0",
        overflow: "hidden!important" as any,
        textOverflow: "ellipsis!important" as any,
        [theme.breakpoints.down("xs")]: {
          display: "block",
        },
      },
    },
    dialogInput: {
      fontSize: "13px",
      backgroundColor: "rgba(0, 0, 0, 0.035)",
      border: "solid 1px rgba(0, 0, 0, 0)",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      marginBottom: "20px",
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
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.07)",
      },
    },
    centerItems: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
    },
    spaceItems: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dialogLabel: {
      color: "#222222!important" as any,
      fontSize: "14px!important" as any,
    },
    attachmentButton: {
      padding: "7px 15px!important" as any,
      fontSize: "13px!important" as any,
      backgroundColor: "#f2f2f2!important" as any,
      textTransform: "none!important" as any,
      color: "#000000!important" as any,
      lineHeight: "1.2!important" as any,
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.2)!important" as any,
      },
    },
    attachmentIcon: {
      transform: "rotate(135deg)",
      color: "#797979!important" as any,
      fontSize: "30px!important" as any,
    },
    tabBox: {
      width: "100%",
      overflowY: "auto",
      minHeight: "200px",
      marginTop: "10px",
    },
    deleteIcon: {
      marginRight: 10,
      marginLeft: 20,
      borderRadius: "1px",
      padding: "17px 10px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)!important" as any,
      },
    },
    renameIcons: {
      borderRadius: "8px",
      padding: "3px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)!important" as any,
      },
    },
    dialogTitle: {
      padding: "28px!important" as any,
      fontWeight: "bold!important" as any,
      fontSize: "23px!important" as any,
      [theme.breakpoints.down("xs")]: {
        fontSize: "16px!important" as any,
      },
    },
    dialogContent: {
      paddingTop: "0!important",
      paddingBottom: "0!important",
      paddingLeft: "28px!important",
      paddingRight: "28px!important",
    },
    dialogActions: {
      padding: "28px!important",
    },
    dialogFileInput: {
      fontSize: "13px",
      fontWeight: "bold",
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "solid 1px blue",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      marginRight: "10px",
      "&.Mui-disabled": {
        backgroundColor: "#f2f2f2",
        border: "solid 1px #f2f2f2",
        color: "#000000",
      },
      "& textarea": {
        paddingTop: "8px",
        paddingBottom: "8px",
      },
    },
    renameFile: {
      minWidth: "85px!important" as any,
      fontSize: "14px!important" as any,
      textDecorationLine: "underline!important" as any,
      cursor: "pointer!important" as any,
    },
    updateTableBodyCell: {
      padding: "6px 10px!important" as any,
      border: "none",
      borderRight: "solid 1px rgba(0, 0, 0, 0.05)",
      borderBottom: "solid 1px rgba(0, 0, 0, 0.05)",
      "& p": {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    blueText: {
      color: "#2b61f0",
      textDecorationLine: "underline",
    },
    updateAvatar: {
      height: "33px",
      width: "33px",
      borderRadius: "50%",
    },
    dateInput: {
      flexWrap: "wrap",
    },
    dateLabel: {
      paddingRight: 15,
      width: 100,
      [theme.breakpoints.down("xs")]: {
        paddingRight: 0,
      },
    },
    noOverflow: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  })
);

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const LogLabels = new Map([
  ["CaseOffice Create", "Admin"],
  ["CaseType Create", "Admin"],
  ["CaseUpdate Create", "Admin"],
  ["CaseUpdate Delete", "Admin"],
  ["Client Create", "Admin"],
  ["Client Delete", "Admin"],
  ["Client Update", "Admin"],
  ["File Create", "Files"],
  ["File Delete", "Files"],
  ["File Update", "Files"],
  ["LegalCase Create", "Admin"],
  ["LegalCase Delete", "Admin"],
  ["LegalCase Update", "Admin"],
  ["Meeting Create", "Updates"],
  ["Meeting Delete", "Updates"],
  ["Meeting Update", "Updates"],
  ["Note Create", "Updates"],
  ["Note Delete", "Updates"],
  ["Note Update", "Updates"],
  ["LegalCaseReferral Create", "Updates"],
  ["LegalCaseReferral Update", "Updates"],
  ["LegalCaseReferral Delete", "Updates"],
]);

export const logLabel = (
  targetAction: string | undefined,
  targetType: string | undefined
) => {
  return LogLabels.get(`${targetType} ${targetAction}`);
};

export const paddedUpdateId = (id: number | string | undefined) => {
  return `UD${id?.toString().padStart(5, "0")}`;
};

export const fileTypeText = (fileType: string | undefined) => {
  switch (fileType) {
    case "pdf":
      return "PDF";
    case "docx":
      return "Word document";
    case "xlsx":
      return "Excel document";
    case "pptx":
      return "PowerPoint document";
    case "jpg":
      return "image";
    case "jpeg":
      return "image";
    case "png":
      return "image";
    default:
      return "file";
  }
};
