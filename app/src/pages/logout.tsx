import LayoutSimple from "../components/layoutSimple";
import i18n from "../i18n";
import Typography from "@material-ui/core/Typography";
import { UserInfo } from "../auth";
import { useHistory } from "react-router-dom";
import React from "react";

const Page = () => {
  const history = useHistory();
  const userInfo = UserInfo.getInstance();
  userInfo.clear();
  React.useEffect(() => {
    history.push("/");
  }, []);

  return (
    <LayoutSimple>
      <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
        {i18n.t("Logout")}
      </Typography>
    </LayoutSimple>
  );
};

export default Page;
