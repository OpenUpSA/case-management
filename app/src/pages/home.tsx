import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { RedirectIfLoggedIn } from "../auth";

const Page = () => {
  RedirectIfLoggedIn();
  const history = useHistory();

  return (
    <LayoutSimple>
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
