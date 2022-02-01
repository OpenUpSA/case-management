import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LayoutChart from "./layout-chart";
import NoData from "./no-data";
import { IDbDataMonthly, IChartDataPoint } from "../types";
import { monthLabel } from "../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    value: {
      fontSize: "1.5rem",
    },
    barWithLabels: {
      height: "100%",
      "&:hover": {
        backgroundColor: theme.palette.background.default,
        borderRadius: "3px",
      },
    },
    bar: {
      padding: 0,
      textAlign: "center",
      backgroundColor: theme.palette.primary.main,
    },
    labels: {
      opacity: 0.7,
    },
    boxInsideLayoutChart: {
      backgroundColor: "#f2f2f2",
      minHeight: 180,
      marginTop: "1rem",
      borderRadius: "10px",
    },
  })
);

interface IProps {
  selectedOffice: string;
  metric: string;
  data: IDbDataMonthly;
}

export default function BarChart(props: IProps) {
  const classes = useStyles();
  const selectedOfficeData = props.data[props.selectedOffice] || {};
  const selectedMetricData = selectedOfficeData[props.metric] || [];
  const hasData = selectedMetricData.length > 0;
  const max = selectedMetricData.reduce(
    (max, dataPoint) => Math.max(max, dataPoint.value),
    0
  );
  const avg = Math.round(max / Math.max(selectedMetricData.length, 1));
  const data: IChartDataPoint[] = selectedMetricData.map((dataPoint) => ({
    label: monthLabel(new Date(dataPoint.date)),
    value: dataPoint.value,
  }));
  return (
    <LayoutChart title={props.metric}>
      {hasData ? (
        <div>
          <Typography className={classes.value}>{avg}</Typography>
          <div>
            <Grid
              container
              spacing={3}
              alignItems="flex-end"
              className={classes.boxInsideLayoutChart}
            >
              {data.map((dataPoint) => (
                <Grid
                  key={dataPoint.label}
                  item
                  xs={1}
                  className={classes.barWithLabels}
                >
                  <Box className={classes.labels} textAlign="center">
                    {dataPoint.value}
                  </Box>
                  <Box
                    className={classes.bar}
                    height={`${(dataPoint.value / max) * 5}rem`}
                  ></Box>
                  <Box className={classes.labels} textAlign="center">
                    {dataPoint.label}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </LayoutChart>
  );
}
