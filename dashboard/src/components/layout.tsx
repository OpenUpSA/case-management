import withWidth from "@material-ui/core/withWidth";
import { ReactNode } from "react";
import { useStyles } from "../utils";

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  const classes = useStyles();
  return <div className={classes.body}>{props.children}</div>;
};

export default withWidth()(Layout);
