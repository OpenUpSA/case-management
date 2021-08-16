import i18next from "i18next";
import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Layout from "../components/layout";
import BarChart from "../components/bar-chart";
import HeatmapChart from "../components/heatmap-chart";
import { IDbDataMonthly, IDbDataDailyPerMonth, IBarChart, IHeatmapChart } from "../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      padding: "1rem",
    },
    title: {
      fontSize: "1.5rem",
    },
    select: {
      backgroundColor: theme.palette.secondary.main,
      paddingLeft: "1rem",
    },
    chartContainer: {
      marginTop: "1rem",
    },
  })
);

interface IProps {
  dataMonthly: IDbDataMonthly
  dataDaily: IDbDataDailyPerMonth
};

export default function Dashboard(props: IProps) {
  const classes = useStyles();

  const generateChartData = (): Array<IBarChart | IHeatmapChart> => {
    const charts: Array<IBarChart | IHeatmapChart> = []
    const barChartMetrics = [
      "Active case officers",
      "Total cases",
      "Average cases per officer",
      "Average days per case",
      "Cases opened",
      "Cases closed"
    ];
    barChartMetrics.forEach((name: string) => {
      charts.push({
        type: "bar",
        metric: name,
        data: props.dataMonthly
      })
    })
    charts.push({
      type: "heatmap",
      data: props.dataDaily,
      metrics: [
        "Cases opened",
        "Cases closed",
        "Cases with activity"
      ]
    })
    return charts;
  };

  const [state, setState] = React.useState({
    selectedOffice: '',
    charts: generateChartData(),
  });

  const updateOffice = (office: string) => {
    const charts: Array<IBarChart | IHeatmapChart> = generateChartData();
    setState({
      ...state,
      charts,
      selectedOffice: office,
    });
  }

  const offices = Object.keys({...props.dataMonthly, ...props.dataDaily});

  if (state.selectedOffice === '' && offices.length) {
    updateOffice(offices[0])
  }

  const handleOfficeSelect = (event: React.ChangeEvent<any>) => {
    const office = event.target.value;
    updateOffice(office);
  };

  const renderChart = (chart: IBarChart | IHeatmapChart) => {
    switch (chart.type) {
      case "bar":
        return <BarChart selectedOffice={state.selectedOffice} metric={chart.metric} data={chart.data}></BarChart>
      case "heatmap":
        return <HeatmapChart selectedOffice={state.selectedOffice} metrics={chart.metrics} data={chart.data}></HeatmapChart>
    }
  }

  return (
    <Layout>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.header}>
        <Typography variant="h1" className={classes.title}>
          {i18next.t("Reporting Dashboard")}
        </Typography>
        <FormControl>
          <Select
            native
            value={state.selectedOffice}
            onChange={handleOfficeSelect}
            inputProps={{
              name: "office",
              id: "office-select",
            }}
            className={classes.select}
          >
            {offices.map((office) => (
              <option key={office} value={office}>{office}</option>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Container className={classes.chartContainer}>
        <Grid container spacing={3}>
          {state.charts.map((chart, i) => (
            <Grid key={i} item xs={12} sm={6} md={4}>
              {renderChart(chart)}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}
