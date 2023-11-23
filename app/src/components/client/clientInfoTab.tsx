import ClientDetails from "../../components/client/clientDetails";
import { IClient } from "../../types";

type Props = {
  client: IClient;
};

export default function ClientInfoTab(props: Props) {
  return <ClientDetails client={props.client} />;
}
