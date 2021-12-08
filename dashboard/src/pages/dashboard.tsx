import { Component } from "react";
import Dashboard from "../components/dashboard";
import { IDbDataMonthly, IDbDataDailyPerMonth } from "../types";
import { http } from "../api";

interface IProps {}

interface IState {
  dataMonthly: IDbDataMonthly
  dataDaily: IDbDataDailyPerMonth
}
class Page extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      dataMonthly: {},
      dataDaily: {},
    };
  }

  async componentDidMount() {
    const dataMonthly = await http<IDbDataMonthly>("/reports/monthly-summary");
    const dataDaily = await http<IDbDataDailyPerMonth>("/reports/daily-summary");
    this.setState({
      dataMonthly: dataMonthly,
      dataDaily: dataDaily
    });
  }

  public render(): any {
    return (
      <Dashboard dataMonthly={this.state.dataMonthly} dataDaily={this.state.dataDaily}></Dashboard>
    );
  }
}

export default Page;
