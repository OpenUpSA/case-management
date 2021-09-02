import i18n from "../i18n";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { LayoutSimple } from "casemgtlayoutsimple";
import logo from "../logo.svg";

export default function Page() {
  const history = useHistory();
  return (
    <LayoutSimple svgImage={logo}>
      <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
        {i18n.t("Lost")}
      </Typography>
      <p>{i18n.t("Lost message")}</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/")}
      >
        {i18n.t("Home")}
      </Button>
    </LayoutSimple>
  );
}
