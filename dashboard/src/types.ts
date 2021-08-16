export interface IDbDataPoint {
  date: string
  value: number
}

export interface IDbDataMonthly {
  [office: string]: {
    [metric: string]: IDbDataPoint[]
  }
}

export interface IDbDataDailyPerMonth {
  [office: string]: {
    [metric: string]: {
      [month: string]: IDbDataPoint[]
    }
  }
}

export interface IChartDataPoint {
  label: string
  value: number
}

export interface IBarChart {
  metric: string
  type: "bar"
  data: IDbDataMonthly
}

export interface IHeatmapChart {
  type: "heatmap"
  data: IDbDataDailyPerMonth,
  metrics: string[]
}
