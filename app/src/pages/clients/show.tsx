import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { getClient } from "../../api";
import { IClient } from "../../types";
import { RedirectIfNotLoggedIn } from "../../auth";

type RouteParams = { id: string };

const Page = () => {
  RedirectIfNotLoggedIn();
  const params = useParams<RouteParams>();
  const [client, setClient] = React.useState<IClient>();

  useEffect(() => {
    async function fetchData() {
      const clientId = parseInt(params.id);
      setClient(await getClient(clientId));
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
      {client?.contact_email}
    </Layout>
  );
};

export default Page;
