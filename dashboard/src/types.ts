export type Nullable<T> = T | null;

export interface IDbDataPoint {
  date: string;
  value: number;
}

export interface IDbDataByRange {
  startDate?: string
  endDate?: string
  dataPerCaseOffice?: {
    [office: string]: {
      [metric: string]: number;
    };
  }
}

export interface IDbDataMonthly {
  startMonth?: string
  endMonth?: string
  dataPerCaseOffice?: {
    [office: string]: {
      [metric: string]: IDbDataPoint[];
    };
  };
}

export interface IDbDataDailyPerMonth {
  startMonth?: string
  endMonth?: string
  dataPerCaseOffice?: {
    [office: string]: {
      [metric: string]: {
        [month: string]: IDbDataPoint[];
      };
    };
  };
}

export interface IChartDataPoint {
  label: string;
  value: number;
}

export interface IBarChart {
  metric: string;
  info: string;
  type: "bar";
  rangeDetail: string;
  dataMonthly: IDbDataMonthly;
  dataByRange: IDbDataByRange;
}

export interface IHeatmapChart {
  type: "heatmap";
  data: IDbDataDailyPerMonth;
  metrics: string[];
}
export interface ICaseOffice {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  case_office_code: string;
}

export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface IUser {
  id?: number;
  name: string;
  membership_number: string;
  contact_number: string;
  email: string;
  case_office: Nullable<number>;
}

export interface ICredentials {
  username: string;
  password: string;
}

export interface IUserInfo {
  token: string;
  user_id: number;
}

export interface LocationState {
  pathname?: string;
  open?: boolean;
  message?: string;
  severity?: "success" | "error" | undefined;
}
