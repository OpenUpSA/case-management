import withWidth from "@material-ui/core/withWidth";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  return <div>{props.children}</div>;
};

export default withWidth()(Layout);
