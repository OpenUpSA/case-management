import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { RedirectIfLoggedIn } from "../auth";

const Page = () => {
  RedirectIfLoggedIn();

  return (
    <LayoutSimple>
      <p>
        <Link to="/login" component={Button}>
          <Button variant="contained" color="primary">
            {i18n.t("Login")}
          </Button>
        </Link>
      </p>
    </LayoutSimple>
  );
};

export default Page;
