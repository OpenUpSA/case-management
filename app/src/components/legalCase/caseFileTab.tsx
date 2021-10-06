import React from "react";
import { useStyles } from "../../utils";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/Upload";
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
  Button,
  Container,
} from "@material-ui/core";
import i18n from "../../i18n";

export default function CaseFileTab() {
  const [caseFiles, setCaseFiles] = React.useState<number>(2);
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        className={classes.containerMarginBottom}
      >
        <Grid item style={{ flexGrow: 1 }}>
          <strong>
            {caseFiles ? caseFiles : "0"} {i18n.t("Case Files")}
          </strong>
        </Grid>
        <Grid item style={{ flexShrink: 2 }}>
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
            startIcon={<UploadIcon />}
            style={{ textTransform: "none" }}
          >
            {i18n.t("Upload file")}
          </Button>
        </Grid>
      </Grid>
      <Grid xs={12} className={classes.containerMarginBottom}>
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
          value={"Enter a meeting location, type, or note..."}
        />
      </Grid>
      <p style={{ fontWeight: 700, paddingBottom: 0, marginBottom: 0 }}>
        Recommended case files:{" "}
      </p>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          {/* <TableHead>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableHeadCell}></TableCell>

              <TableCell className={classes.tableHeadCell}></TableCell>

              <TableCell
                className={classes.tableHeadCell}
                colSpan={2}
              ></TableCell>
              <TableCell className={classes.tableHeadCell}></TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            <TableRow className={classes.tableBodyRow}>
              <TableCell className={classes.tableBodyCell}>icon here</TableCell>
              <TableCell colSpan={14} className={classes.tableBodyCell}>
                <p>Notice to vacate</p>
              </TableCell>
              <TableCell className={classes.tableBodyCell}>
                <CheckIcon color={"success"} />
              </TableCell>
              <TableCell className={classes.tableBodyCell}>icon here</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
