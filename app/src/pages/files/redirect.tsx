import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getLegalCaseFile } from "../../api";
import { RedirectIfNotLoggedIn } from "../../auth";

import CircularProgress from "@mui/material/CircularProgress";

type RouteParams = { id: string };

const RedirectToFile = () => {
  RedirectIfNotLoggedIn();
  const params = useParams<RouteParams>();

  useEffect(() => {
    async function fetchData() {
      const dataFile = await getLegalCaseFile(Number(params.id));
      window.location.assign(dataFile.upload);
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
