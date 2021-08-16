import i18next from "i18next";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noData: {
      padding: "3rem",
    },
  })
);

export default function NoData() {
  const classes = useStyles();

  return (
    <Box className={classes.noData}>{i18next.t("No data")}</Box>
  );
}
