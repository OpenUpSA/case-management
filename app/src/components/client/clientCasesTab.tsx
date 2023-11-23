import LegalCasesTable from "../../components/legalCase/table";
import { ILegalCase } from "../../types";

type Props = {
  legalCases: ILegalCase[];
};

const ClientCasesTab = (props: Props) => {
  return (
    <LegalCasesTable
      legalCases={props.legalCases ? props.legalCases : []}
      standalone={false}
    />
  );
};

export default ClientCasesTab;
