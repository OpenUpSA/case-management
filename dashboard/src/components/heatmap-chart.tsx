import i18next from "i18next";
import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

import LayoutChart from "./layout-chart";
import NoData from "./no-data";
import { IDbDataDailyPerMonth } from "../types";
import { yearMonthLabel } from "../utils";
import { BlackTooltip } from "./general/tooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: 0,
      marginBottom: "1rem",
    },
    dayGrid: {
      textAlign: "center",
      fontSize: "12px",
      verticalAlign: "middle",
    },
    dayLabel: {
      backgroundColor: theme.palette.background.default,
    },
    dayValue: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "3px",
      width: "100%",
      height: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      "&:hover": {
        border: " 1px solid black",
      },
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
  })
);

interface IProps {
  selectedOffice: string;
  data: IDbDataDailyPerMonth;
  metrics: string[];
}

export default function HeatmapChart(props: IProps) {
  const classes = useStyles();

  const selectedOfficeData =
    (props.data.dataPerCaseOffice || {})[props.selectedOffice] || {};
  const selectedMetric = props.metrics[0];
  const selectedMetricData = selectedOfficeData[selectedMetric] || {};
  const months = Object.keys(selectedMetricData);
  const selectedMonth = months[0] || '';

  const generateChartData = () => {
    const chartData: {
      [metric: string]: { [month: string]: { max: number; data7x5: any[] } };
    } = {};
    Object.keys(selectedOfficeData).forEach((metric: string) => {
      chartData[metric] = {};
      Object.keys(selectedOfficeData[metric]).forEach((month: string) => {
        const data = selectedOfficeData[metric][month];
        if (data) {
          const flatGrid = [];
          const weeklyGrid = [];
          const firstPosition = new Date(data[0].date).getDay();
          for (let i = 0; i < 35; i++) {
            if (i < firstPosition) {
              flatGrid.push(null);
            } else if (i < data.length + firstPosition) {
              flatGrid.push({
                day: i - firstPosition + 1,
                value: data[i - firstPosition].value || 0,
              });
            } else {
              flatGrid.push(null);
            }
          }
          for (let i = 0; i < 35; i += 7) {
            weeklyGrid.push(flatGrid.slice(i, i + 7));
          }
          chartData[metric][month] = {
            max: data.reduce(
              (max, dataPoint) => Math.max(max, dataPoint.value),
              0
            ),
            data7x5: weeklyGrid,
          };
        }
      });
    });
    return chartData;
  };

  const chartData = generateChartData();

  const [state, setState] = React.useState({
    selectedMetric: selectedMetric,
    selectedMonth: selectedMonth,
    chartData: chartData,
  });

  if (!Object.keys(state.chartData).length && Object.keys(chartData).length) {
    setState({
      ...state,
      chartData,
      selectedMonth,
    });
  }

  const handleSelect = (event: React.ChangeEvent<any>) => {
    const name = event.target.name;
    const value = event.target.value;
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <LayoutChart
      title={i18next.t("Data heatmap")}
      info={i18next.t(
        "The Data Heatmap shows cases; opened, closed and activity (by day of the month)."
      )}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={classes.form}
      >
        <FormControl>
          <Select
            disableUnderline
            className={classes.select}
            value={state.selectedMetric}
            onChange={handleSelect}
            inputProps={{
              name: "selectedMetric",
              id: "metric-select",
            }}
          >
            {props.metrics.map((metric: string) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select
            disableUnderline
            className={classes.select}
            value={state.selectedMonth}
            onChange={handleSelect}
            inputProps={{
              name: "selectedMonth",
              id: "month-select",
            }}
          >
            {months.map((month: string) => (
              <MenuItem key={month} value={month}>
                {yearMonthLabel(new Date(month))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {state.chartData.hasOwnProperty(state.selectedMetric) &&
      state.chartData[state.selectedMetric].hasOwnProperty(
        state.selectedMonth
      ) ? (
        <div>
          <div>
            <Grid
              container
              spacing={1}
              direction="column"
              className={classes.dayGrid}
            >
              <Grid container item xs spacing={1} direction="row">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, j) => (
                  <Grid key={j} item xs>
                    <Box className={classes.dayLabel}>{day}</Box>
                  </Grid>
                ))}
              </Grid>
              {state.chartData[state.selectedMetric][
                state.selectedMonth
              ].data7x5.map(
                (week: Array<{ day: number; value: number }>, i: number) => (
                  <Grid key={i} container item xs spacing={1} direction="row">
                    {week.map(
                      (dayData: { day: number; value: number }, j: number) => (
                        <Grid key={j} item xs>
                          <BlackTooltip
                            title={
                              dayData === null
                                ? ""
                                : `${dayData.day} ${yearMonthLabel(
                                    new Date(state.selectedMonth)
                                  )}: ${dayData.value} ${state.selectedMetric}`
                            }
                            arrow
                            placement="top"
                          >
                            <Box
                              className={classes.dayValue}
                              style={
                                dayData === null
                                  ? { opacity: 0.2, backgroundColor: "grey" }
                                  : {
                                      opacity:
                                        0.2 +
                                        (dayData.value /
                                          (state.chartData[
                                            state.selectedMetric
                                          ][state.selectedMonth].max || 1)) *
                                          0.8,
                                      color: "white",
                                    }
                              }
                            >
                              {dayData === null ? "-" : dayData.value}
                            </Box>
                          </BlackTooltip>
                        </Grid>
                      )
                    )}
                  </Grid>
                )
              )}
            </Grid>
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </LayoutChart>
  );
}
