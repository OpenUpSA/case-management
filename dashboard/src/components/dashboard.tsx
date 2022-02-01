import i18next from "i18next";
import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AssessmentIcon from "@mui/icons-material/Assessment";

import Layout from "../components/layout";
import BarChart from "../components/bar-chart";
import HeatmapChart from "../components/heatmap-chart";
import {
  IDbDataMonthly,
  IDbDataDailyPerMonth,
  IBarChart,
  IHeatmapChart,
} from "../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      padding: "1rem",
      borderRadius: "10px",
    },
    title: {
      fontSize: "1.5rem",
      paddingLeft: "0.6rem",
    },
    select: {
      minWidth: "10rem",
      backgroundColor: "#ffffff",
      border: "solid 1px #f2f2f2",
      borderRadius: "4px",
      padding: "8px 8px 4px 8px",
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "#000000",
        "&>.MuiSelect-icon": {
          display: "none",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#fcfcfc",
        borderColor: "#e5e5e5",
      },
      "&:hover": {
        backgroundColor: "#e5e5e5",
      },
    },
    chartContainer: {
      marginTop: "1rem",
    },
    iconAndTitle: { display: "flex", flexDirection: "row" },
    dropdownStyle: {
      marginTop: "3rem",
    },
  })
);

interface IProps {
  dataMonthly: IDbDataMonthly;
  dataDaily: IDbDataDailyPerMonth;
}

export default function Dashboard(props: IProps) {
  const classes = useStyles();

  const generateChartData = (): Array<IBarChart | IHeatmapChart> => {
    const charts: Array<IBarChart | IHeatmapChart> = [];
    const barChartMetrics = [
      "Active case officers",
      "Total cases",
      "Average cases per officer",
      "Average days per case",
      "Cases opened",
      "Cases closed",
    ];
    barChartMetrics.forEach((name: string) => {
      charts.push({
        type: "bar",
        metric: name,
        data: props.dataMonthly,
      });
    });
    charts.push({
      type: "heatmap",
      data: props.dataDaily,
      metrics: ["Cases opened", "Cases closed", "Cases with activity"],
    });
    return charts;
  };

  const [state, setState] = React.useState({
    selectedOffice: "",
    charts: generateChartData(),
  });

  const updateOffice = (office: string) => {
    const charts: Array<IBarChart | IHeatmapChart> = generateChartData();
    setState({
      ...state,
      charts,
      selectedOffice: office,
    });
  };

  const offices = Object.keys({ ...props.dataMonthly, ...props.dataDaily });

  if (state.selectedOffice === "" && offices.length) {
    updateOffice(offices[0]);
  }

  const handleOfficeSelect = (event: React.ChangeEvent<any>) => {
    const office = event.target.value;
    updateOffice(office);
  };

  const renderChart = (chart: IBarChart | IHeatmapChart) => {
    switch (chart.type) {
      case "bar":
        return (
          <BarChart
            selectedOffice={state.selectedOffice}
            metric={chart.metric}
            data={chart.data}
          ></BarChart>
        );
      case "heatmap":
        return (
          <HeatmapChart
            selectedOffice={state.selectedOffice}
            metrics={chart.metrics}
            data={chart.data}
          ></HeatmapChart>
        );
    }
  };

  return (
    <Layout>
      <Container className={classes.chartContainer}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.header}
        >
          <div className={classes.iconAndTitle}>
            <AssessmentIcon />
            <Typography variant="h1" className={classes.title}>
              {i18next.t("Reporting Dashboard")}
            </Typography>
          </div>

          <FormControl>
            <Select
              className={classes.select}
              disableUnderline
              value={state.selectedOffice}
              onChange={handleOfficeSelect}
              inputProps={{
                name: "office",
                id: "office-select",
              }}
              MenuProps={{ classes: { paper: classes.dropdownStyle } }}
            >
              {offices.map((office) => (
                <MenuItem key={office} value={office}>
                  {office}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <br />
        <Grid container spacing={3}>
          {state.charts.map((chart, i) => (
            <Grid key={i} item sm={12} md={6}>
              {renderChart(chart)}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}
