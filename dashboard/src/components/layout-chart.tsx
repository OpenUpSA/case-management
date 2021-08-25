import { ReactNode } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: "1.2rem",
    },

  })
);

interface IProps {
  title: string
  children: ReactNode;
};

export default function LayoutChart(props: IProps) {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {props.title}
        </Typography>
        {props.children}
      </CardContent>
    </Card>
  );
}
