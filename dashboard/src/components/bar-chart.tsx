import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LayoutChart from "./layout-chart";
import NoData from "./no-data";
import { IDbDataByRange, IDbDataMonthly, IChartDataPoint } from "../types";
import { monthLabel } from "../utils";
import { BlackTooltip } from "./general/tooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    value: {
      fontSize: "1.2rem",
    },
    barWithLabels: {
      height: "100%",
      borderRadius: "3px",
      padding: "6px",
      "&:hover": {
        backgroundColor: "#f2f2f2",
      },
    },
    bar: {
      padding: 0,
      textAlign: "center",
      backgroundColor: theme.palette.primary.main,
      borderRadius: "2px",
    },
    labels: {
      opacity: 0.7,
      textTransform: "uppercase",
    },
    boxInsideLayoutChart: {
      backgroundColor: "#fafafa",
      minHeight: 180,
      marginTop: "1rem",
      paddingBottom: "1rem",
      borderRadius: "10px",
      justifyContent: "center",
    },
  })
);

interface IProps {
  selectedOffice: string;
  metric: string;
  info: string;
  rangeDetail: string;
  dataMonthly: IDbDataMonthly;
  dataByRange: IDbDataByRange;
}

export default function BarChart(props: IProps) {
  const classes = useStyles();
  const selectedOfficeData =
    (props.dataMonthly.dataPerCaseOffice || {})[props.selectedOffice] || {};
  const selectedMetricData = selectedOfficeData[props.metric] || [];
  const hasData = selectedMetricData.reduce(
    (has, current) => current.value !== null || has,
    false
  );
  const max = selectedMetricData.reduce(
    (max, dataPoint) => Math.max(max, dataPoint.value),
    0
  );
  const rangeValue = ((props.dataByRange.dataPerCaseOffice || {})[
    props.selectedOffice
  ] || {})[props.metric];
  const data: IChartDataPoint[] = selectedMetricData.map((dataPoint) => ({
    label: monthLabel(new Date(dataPoint.date)),
    value: dataPoint.value,
  }));
  return (
    <LayoutChart title={props.metric} info={props.info}>
      {hasData ? (
        <div>
          <Typography className={classes.value}>
            {rangeValue ? rangeValue : "0"} {props.rangeDetail}
          </Typography>
          <div>
            <Grid
              container
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
                  <BlackTooltip
                    title={dataPoint.value || ""}
                    arrow
                    placement="right-start"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          transform: "translate(0, -10px)!important" as any,
                        },
                      },
                    }}
                  >
                    <Box
                      className={classes.bar}
                      height={`${(dataPoint.value / max) * 5}rem`}
                    ></Box>
                  </BlackTooltip>
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
