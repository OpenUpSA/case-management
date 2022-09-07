import { ReactNode, useState, useEffect } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import { BlackTooltip } from "./general/tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: "1.2rem",
      color: "black",
      fontWeight: "bold",
    },
    card: {
      borderRadius: "10px",
      boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.05)",
      overflow: "visible",
    },
  })
);

interface IProps {
  title: string;
  children: ReactNode;
  info: string;
}

export default function LayoutChart(props: IProps) {
  const classes = useStyles();
  const [desktop, setDesktop] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.innerWidth > 820 ? setDesktop(true) : setDesktop(false);
    
    const mql = window.matchMedia("(max-width: 820px)");
    mql.addEventListener("change", (e) => {
      const mobileView = e.matches;
      if (mobileView) {
        setDesktop(false);
      } else {
        setDesktop(true);
      }
    });
  }, []);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography className={classes.title} color="textSecondary">
            {props.title}
          </Typography>
          {desktop ? (
            <BlackTooltip title={props.info || ""} arrow placement="top">
              <InfoIcon />
            </BlackTooltip>
          ) : (
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <span>
                <BlackTooltip
                  title={props.info || ""}
                  arrow
                  placement="top"
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleTooltipClose}
                  open={open}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                >
                  <InfoIcon onClick={handleTooltipOpen} />
                </BlackTooltip>
              </span>
            </ClickAwayListener>
          )}
        </Box>
        {props.children}
      </CardContent>
    </Card>
  );
}
