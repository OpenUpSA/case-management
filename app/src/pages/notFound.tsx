import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";

import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function Page() {
  const history = useHistory();
  return (
    <LayoutSimple>
      <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
        {i18n.t("404")}
      </Typography>
      <p>{i18n.t("Lost message")}</p>
      <Button
        disableElevation={true}
        variant="contained"
        color="primary"
        onClick={() => history.push("/")}
      >
        {i18n.t("Home")}
      </Button>
    </LayoutSimple>
  );
}
