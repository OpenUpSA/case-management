import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { getLegalCaseFile } from "../../api";
import { RedirectIfNotLoggedIn } from "../../auth";

import CircularProgress from "@mui/material/CircularProgress";

type RouteParams = { id: string };

const RedirectToFile = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const params = useParams<RouteParams>();

  useEffect(() => {
    async function fetchData() {
      const dataFile = await getLegalCaseFile(Number(params.id));
      if ("detail" in dataFile) {
        history.push("/404");
      } else {
        window.location.assign(dataFile.upload);
      }
    }
    fetchData();
  }, []);

  return (
    <CircularProgress
      size={24}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: "-12px",
        marginLeft: "-12px",
      }}
    />
  );
};

export default RedirectToFile;
