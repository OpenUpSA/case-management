import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { getClient, getLegalCase, getMeeting } from "../../api";
import { ILegalCase, IClient, IMeeting } from "../../types";

type RouteParams = { id: string };

const Page = () => {
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [client, setClient] = React.useState<IClient>();
  const [meeting, setMeeting] = React.useState<IMeeting>();

  useEffect(() => {
    async function fetchData() {
      const meetingId = parseInt(params.id);
      const dataMeeting = await getMeeting(meetingId);
      const dataLegalCase = await getLegalCase(dataMeeting.legal_case);
      setMeeting(dataMeeting);
      setLegalCase(dataLegalCase);
      setClient(await getClient(dataLegalCase.client));
    }
    fetchData();
  }, [params.id]);

  return (
    <Layout>
      <Typography component="h1" variant="h5" style={{ flex: 1 }}>
        <Link to={`/clients/${client?.id}/cases`}>
          {client?.preferred_name}
        </Link>
      </Typography>
      <Typography component="h1" variant="h5" style={{ flex: 1 }}>
        <Link to={`/cases/${legalCase?.id}`}>
          {legalCase?.case_number}
        </Link>
      </Typography>
      <p>
        {meeting?.notes}
      </p>
      
    </Layout>
  );
};

export default Page;
