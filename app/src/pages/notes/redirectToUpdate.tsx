import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { getNote } from "../../api";
import { RedirectIfNotLoggedIn } from "../../auth";

import CircularProgress from "@mui/material/CircularProgress";

type RouteParams = { id: string };

const RedirectToUpdateFromNote = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const params = useParams<RouteParams>();

  useEffect(() => {
    async function fetchData() {
      const dataNote = await getNote(Number(params.id));
      if ("detail" in dataNote) {
        history.push("/404");
      } else {
        history.push(`/updates/${dataNote.case_update}/edit`);
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

export default RedirectToUpdateFromNote;
