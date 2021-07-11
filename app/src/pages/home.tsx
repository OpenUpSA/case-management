import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import { RedirectIfLoggedIn } from "../auth";

const Page = () => {
  RedirectIfLoggedIn();
  
  return (
    <LayoutSimple>
      <Typography
        variant="body2"
        color="textPrimary"
        align="center"
        gutterBottom
      >
        {i18n.t("Welcome to CaseFile")}
      </Typography>
      <Link to="/login">
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Link>
    </LayoutSimple>
  );
};

export default Page;
