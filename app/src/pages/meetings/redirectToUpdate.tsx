import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { getMeeting } from "../../api";
import { RedirectIfNotLoggedIn } from "../../auth";

import CircularProgress from "@mui/material/CircularProgress";

type RouteParams = { id: string };

const RedirectToUpdateFromMeeting = () => {
  RedirectIfNotLoggedIn();
  const history = useHistory();
  const params = useParams<RouteParams>();

  useEffect(() => {
    async function fetchData() {
      const dataMeeting = await getMeeting(Number(params.id));
      if ('detail' in dataMeeting) {
        history.push("/404");
      } else {
        history.push(`/updates/${dataMeeting.case_update}/edit`);
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

export default RedirectToUpdateFromMeeting;
