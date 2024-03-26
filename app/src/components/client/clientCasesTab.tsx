import LegalCasesTable from "../../components/legalCase/table";
import { ILegalCase } from "../../types";

type Props = {
  legalCases: ILegalCase[];
  newCaseHandler: () => void;
};

const ClientCasesTab = (props: Props) => {
  return (
    <LegalCasesTable
      legalCases={props.legalCases ? props.legalCases : []}
      standalone={false}
      newCaseHandler={props.newCaseHandler}
    />
  );
};

export default ClientCasesTab;
