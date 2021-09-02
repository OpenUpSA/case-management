import { LayoutSimple } from "casemgtlayoutsimple";
import i18n from "../i18n";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { RedirectIfLoggedIn } from "casemgtauth";
import logo from "../logo.svg"

const Page = () => {
  RedirectIfLoggedIn();
  const history = useHistory();

  return (
    <LayoutSimple svgImage={logo}>
      <p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push("/login")}
        >
          {i18n.t("Login")}
        </Button>
      </p>
    </LayoutSimple>
  );
};

export default Page;
