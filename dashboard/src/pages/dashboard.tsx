import { Component } from "react";
import Dashboard from "../components/dashboard";
import { IDbDataByRange, IDbDataMonthly, IDbDataDailyPerMonth } from "../types";
import { getRangeSummary, getDailySummary, getMonthlySummary } from "../api";

interface IProps {}

interface IState {
  dataByRange: IDbDataByRange;
  dataMonthly: IDbDataMonthly;
  dataDaily: IDbDataDailyPerMonth;
}
class Page extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      dataByRange: {},
      dataMonthly: {},
      dataDaily: {},
    };
  }

  async componentDidMount() {
    const dataByRange = await getRangeSummary();
    const dataMonthly = await getMonthlySummary();
    const dataDaily = await getDailySummary();
    this.setState({
      dataByRange: dataByRange,
      dataMonthly: dataMonthly,
      dataDaily: dataDaily,
    });
  }

  public render(): any {
    return (
      <Dashboard
        dataByRange={this.state.dataByRange}
        dataMonthly={this.state.dataMonthly}
        dataDaily={this.state.dataDaily}
      ></Dashboard>
    );
  }
}

export default Page;
