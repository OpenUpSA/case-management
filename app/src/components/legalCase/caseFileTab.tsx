import React from "react";
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
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ImageIcon from "@mui/icons-material/Image";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import LinkIcon from "@mui/icons-material/Link";
import Divider from "@mui/material/Divider";

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

export default function CaseFileTab() {
  const [caseFiles, setCaseFiles] = React.useState<number>(0);
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
            disabled={true}
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
      <InputLabel className={classes.caseFileLabel}>
        Recommended case files:{" "}
      </InputLabel>
      <Grid container direction="column">
        <Grid item className={classes.caseFiles}>
          <MeetingRoomIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice to vacate</Typography>
          <CheckIcon style={{ color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <DescriptionIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Notice of motion</Typography>
          <CheckIcon style={{ color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <GavelIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Eviction order</Typography>
          <IconButton>
            <AddIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <ReceiptLongIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>
            Proof of rental payment
          </Typography>
          <IconButton>
            <AddIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <HistoryEduIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>Lease agreement</Typography>
          <IconButton>
            <AddIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
        <Grid item className={classes.caseFiles}>
          <WorkIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography style={{ flexGrow: 1 }}>
            Record of attempt to find legal council
          </Typography>
          <IconButton>
            <AddIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>
      <InputLabel
        className={classes.caseFileLabel}
        style={{ paddingTop: "20px" }}
      >
        All case files:{" "}
      </InputLabel>

      <Grid container className={classes.caseFiles}>
        <Grid
          item
          className={classes.caseFilesItem}
          style={{ flexGrow: 1, width: 150 }}
        >
          <WorkIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography>Meeting-notes-102112</Typography>
        </Grid>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 2 }}>
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <p>04/02/2021</p>
        </Grid>
        <Grid item className={classes.caseFilesItem}>
          <LinkIcon style={{ visibility: "hidden", color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container className={classes.caseFiles}>
        <Grid
          item
          className={classes.caseFilesItem}
          style={{ flexGrow: 1, width: 150 }}
        >
          <ImageIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography>notice-to-vacate</Typography>
        </Grid>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 2 }}>
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <p>04/02/2021</p>
        </Grid>
        <Grid item className={classes.caseFilesItem}>
          <LinkIcon style={{ visibility: "visible", color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container className={classes.caseFiles}>
        <Grid
          item
          className={classes.caseFilesItem}
          style={{ flexGrow: 1, width: 150 }}
        >
          <ImageIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography>notice-of-motion</Typography>
        </Grid>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 2 }}>
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <p>04/02/2021</p>
        </Grid>
        <Grid item className={classes.caseFilesItem}>
          <LinkIcon style={{ visibility: "visible", color: "#3dd997" }} />
          <IconButton>
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container className={classes.caseFiles}>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 1, width: 150 }}>
          <StickyNote2Icon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography>Meeting notes</Typography>
        </Grid>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 2 }}>
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <p>04/02/2021</p>
        </Grid>
        <Grid item className={classes.caseFilesItem}>
          <LinkIcon style={{visibility: 'hidden', color: "#3dd997"}}/>
          <IconButton >
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container className={classes.caseFiles}>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 1, width: 150 }}>
          <StickyNote2Icon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography>meeting-notes-122112</Typography>
        </Grid>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 2 }}>
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <p>04/02/2021</p>
        </Grid>
        <Grid item className={classes.caseFilesItem}>
          <LinkIcon style={{visibility: 'hidden', color: "#3dd997"}}/>
          <IconButton >
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>

      <Grid container className={classes.caseFiles}>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 1, width: 150 }}>
          <GraphicEqIcon style={{ margin: "0px 15px 0px 10px" }} />
          <Typography>recording-10201020</Typography>
        </Grid>
        <Grid item className={classes.caseFilesItem} style={{ flexGrow: 2 }}>
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <p>04/02/2021</p>
        </Grid>
        <Grid item className={classes.caseFilesItem}>
          <LinkIcon style={{visibility: 'hidden', color: "#3dd997"}}/>
          <IconButton >
            <MoreVertIcon sx={{color: "#000000"}}/>
          </IconButton>
        </Grid>
      </Grid>
      
    </>
  );
}
