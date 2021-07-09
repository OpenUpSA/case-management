import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { getCaseOffices, getCaseTypes, getClient, getLegalCase } from "../../api";
import { ILegalCase, IClient, ICaseType, ICaseOffice } from "../../types";

type RouteParams = { id: string };

const Page = () => {
  const params = useParams<RouteParams>();
  const [legalCase, setLegalCase] = React.useState<ILegalCase>();
  const [caseTypes, setCaseTypes] = React.useState<ICaseType[]>();
  const [caseOffices, setCaseOffices] = React.useState<ICaseOffice[]>();
  const [client, setClient] = React.useState<IClient>();

  useEffect(() => {
    async function fetchData() {
      const caseId = parseInt(params.id);
      const dataLegalCase = await getLegalCase(caseId);
      const dataCaseTypes = await getCaseTypes();
      const dataCaseOffices = await getCaseOffices();
      setLegalCase(dataLegalCase);
      setCaseTypes(dataCaseTypes);
      setCaseOffices(dataCaseOffices);
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
      <p>{`${i18n.t("Case Number")}: ${legalCase?.case_number}`}</p>
      <p>{`${i18n.t("Case State")}: ${legalCase?.state}`}</p>
      <p>
        {legalCase ? (
          <>
            {i18n.t("Case Types")}:{" "}
            {caseTypes
              ?.filter(
                (caseType) => legalCase.case_types.indexOf(caseType.id) > -1
              )
              .map((caseType) => caseType.title)
              .join(", ")}
          </>
        ) : null}
      </p>
      <p>
        {legalCase ? (
          <>
            {i18n.t("Case Offices")}:{" "}
            {caseOffices
              ?.filter(
                (caseOffice) => legalCase.case_offices.indexOf(caseOffice.id) > -1
              )
              .map((caseOffice) => caseOffice.name)
              .join(", ")}
          </>
        ) : null}
      </p>
    </Layout>
  );
};

export default Page;
