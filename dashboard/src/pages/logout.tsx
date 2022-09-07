import LayoutSimple from "../components/layout-simple";
import i18n from "../i18n";
import Typography from "@material-ui/core/Typography";
import { UserInfo } from "../auth";
import { useHistory } from "react-router-dom";

const Page = () => {
  const history = useHistory();
  const userInfo = UserInfo.getInstance();
  userInfo.clear();
  history.push("/");

  return (
    <LayoutSimple>
      <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
        {i18n.t("Logout")}
      </Typography>
    </LayoutSimple>
  );
};

export default Page;
