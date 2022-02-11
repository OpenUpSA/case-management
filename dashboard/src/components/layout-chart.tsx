import { ReactNode } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import { BlackTooltip } from "./general/tooltip";

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

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography className={classes.title} color="textSecondary">
            {props.title}
          </Typography>
          <BlackTooltip title={props.info} arrow placement="top">
            <InfoIcon />
          </BlackTooltip>
        </Box>
        {props.children}
      </CardContent>
    </Card>
  );
}
