import { Component } from "react";
import Dashboard from "../components/dashboard";
import { IDbDataByRange, IDbDataMonthly, IDbDataDailyPerMonth } from "../types";
import { getRangeSummary, getDailySummary, getMonthlySummary } from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid, Box } from "@mui/material";

interface IProps {}

interface IState {
  dataByRange: IDbDataByRange;
  dataMonthly: IDbDataMonthly;
  dataDaily: IDbDataDailyPerMonth;
  isLoading: boolean;
}
class Page extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      dataByRange: {},
      dataMonthly: {},
      dataDaily: {},
      isLoading: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const dataByRange = await getRangeSummary();
    const dataMonthly = await getMonthlySummary();
    const dataDaily = await getDailySummary();
    this.setState({
      dataByRange: dataByRange,
      dataMonthly: dataMonthly,
      dataDaily: dataDaily,
      isLoading: false,
    });
  }

  public render(): any {
    return (
      <Box style={{ position: "relative" }}>
        <Dashboard
          dataByRange={this.state.dataByRange}
          dataMonthly={this.state.dataMonthly}
          dataDaily={this.state.dataDaily}
        ></Dashboard>
        {this.state.isLoading && (
          <Grid
            container
            justifyContent="center"
            style={{ position: "absolute", top: "480px" }}
          >
            <CircularProgress />
          </Grid>
        )}
      </Box>
    );
  }
}

export default Page;
