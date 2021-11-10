import React, { useEffect, useRef } from "react";
import { useStyles } from "../../utils";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/Upload";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import WorkIcon from "@mui/icons-material/Work";
import LinkIcon from "@mui/icons-material/Link";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";

import { ILegalCase, ILegalCaseFile } from "../../types";
import { getLegalCaseFiles, createLegalCaseFile } from "../../api";

import {
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
} from "@material-ui/core";
import i18n from "../../i18n";
import ProgressBar from "../progressBar/progressBar";

type Props = {
  legalCase: ILegalCase;
  legalCaseFiles: ILegalCaseFile[] | undefined;
};

export default function CaseFileTab(props: Props) {
  const [legalCaseFiles, setLegalCaseFiles] =
    React.useState<ILegalCaseFile[]>();
  const classes = useStyles();
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState<number>(0);

  const onFileChange = (event: any) => {
    //console.log(event.target.onprogress);
    createLegalCaseFile(props.legalCase.id, event.target.files[0], (e: any) => {
      const { loaded, total } = e;
      const percent = Math.floor((loaded * 100) / total);

      setProgress(percent);
      if (percent === 100) {
        setTimeout(() => {
          setProgress(0);
        }, 1000);
      }
    }).then((res) => {
      getLegalCaseFiles(props.legalCase.id).then((res) => {
        setLegalCaseFiles(res);
      });
    });
  };

  const showOpenFileDialog = () => {
    if (!uploadFileRef.current) throw Error("uploadFileRef is not assigned");
    uploadFileRef.current.click();
  };

  useEffect(() => {
    setLegalCaseFiles(props.legalCaseFiles);
  }, [props.legalCaseFiles]);
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
            {legalCaseFiles?.length} {i18n.t("Case Files")}
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
          <input
            ref={uploadFileRef}
            type="file"
            onChange={onFileChange}
            hidden
          />

          <Button
            className={classes.canBeFab}
            color="primary"
            variant="contained"
            startIcon={<UploadIcon />}
            style={{ textTransform: "none" }}
            onClick={showOpenFileDialog}
          >
            {i18n.t("Upload file")}
          </Button>
        </Grid>
      </Grid>
      <Grid
        xs={12}
        className={classes.containerMarginBottom}
        style={{ display: "none" }}
      >
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
      {progress > 0 && <ProgressBar progress={progress} />}

      <InputLabel
        className={classes.caseFileLabel}
        style={{ paddingTop: "20px" }}
      >
        All case files:{" "}
      </InputLabel>
      {legalCaseFiles && legalCaseFiles.length > 0 ? (
        <div>
          {legalCaseFiles.map((legalCaseFile) => (
            <Grid
              container
              key={legalCaseFile.id}
              className={classes.caseFiles}
            >
              <Grid
                item
                className={classes.caseFilesItem}
                style={{ flexGrow: 1 }}
              >
                <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
                <Typography>
                  <a
                    href={legalCaseFile.upload}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {legalCaseFile.upload_file_name}
                  </a>
                </Typography>
              </Grid>
              <Grid item className={classes.caseFilesItem}>
                <Divider
                  sx={{ marginRight: 2 }}
                  orientation="vertical"
                  variant="middle"
                  flexItem
                />
                <p>
                  {format(
                    new Date(
                      legalCaseFile.updated_at || new Date().toISOString()
                    ),
                    "dd/MM/yyyy"
                  )}
                </p>
              </Grid>
              <Grid item className={classes.caseFilesItem}>
                <LinkIcon style={{ visibility: "hidden", color: "#3dd997" }} />
                <IconButton>
                  <MoreVertIcon sx={{ color: "#000000" }} />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </div>
      ) : (
        <Grid container className={classes.caseFiles}>
          <Grid item className={classes.caseFilesItem} style={{ flexGrow: 1 }}>
            <WorkIcon style={{ margin: "0px 15px 0px 10px" }} />
            <Typography>{i18n.t("Upload a file above")}</Typography>
          </Grid>
          <Grid item className={classes.caseFilesItem}>
            <LinkIcon style={{ visibility: "hidden", color: "#3dd997" }} />
            <IconButton>
              <MoreVertIcon sx={{ color: "#000000" }} />
            </IconButton>
          </Grid>
        </Grid>
      )}
      <InputLabel className={classes.caseFileLabel}>
        Recommended case files:{" "}
      </InputLabel>
      <Grid container direction="column">
        <Grid item className={classes.caseFiles}>
          <MeetingRoomIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice to vacate</Typography>
          <CheckIcon style={{ color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice of motion</Typography>
          <CheckIcon style={{ color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <GavelIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Eviction order</Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <ReceiptLongIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>
            Proof of rental payment
          </Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <HistoryEduIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Lease agreement</Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <WorkIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>
            Record of attempt to find legal council
          </Typography>
          <IconButton>
            <AddIcon sx={{ color: "#000000" }} />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}
