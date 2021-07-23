import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";

import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function Page() {
  return (
    <LayoutSimple>
      <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
        {i18n.t("Lost")}
      </Typography>
      <p>{i18n.t("Lost message")}</p>
      <Link to="/" component={Button}>
        <Button variant="contained" color="primary">
          {i18n.t("Home")}
        </Button>
      </Link>
    </LayoutSimple>
  );
}