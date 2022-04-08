import {
  ICaseOffice,
  IDbDataByRange,
  IDbDataMonthly,
  IDbDataDailyPerMonth,
  IUser,
  ICredentials,
  IUserInfo,
} from "./types";
import { UserInfo } from "./auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

async function http<T>(path: string, config: RequestInit): Promise<T> {
  path = `${API_BASE_URL}${path}`;
  const request = new Request(path, config);
  const response = await fetch(request);
  if (response.status === 401) {
    const userInfo = UserInfo.getInstance();
    userInfo.clear();
    window.location.href = "/login";
  }
  return response.json().catch((e) => {
    console.log(e);
  });
}

export async function httpPost<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const init = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    ...config,
  };
  return await http<U>(path, init);
}

export async function httpPostNoAuth<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...config,
  };
  return await http<U>(path, init);
}

export async function httpPatch<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const init = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    ...config,
  };
  return await http<U>(path, init);
}

export async function httpGet<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...config,
  };
  return await http<T>(path, init);
}

export const getCaseOffices = async () => {
  return await httpGet<ICaseOffice[]>(`/case-offices/`);
};

export const getRangeSummary = async () => {
  return await httpGet<IDbDataByRange>("/reports/range-summary");
};

export const getMonthlySummary = async () => {
  return await httpGet<IDbDataMonthly>("/reports/monthly-summary");
};

export const getDailySummary = async () => {
  return await httpGet<IDbDataDailyPerMonth>("/reports/daily-summary");
};

export const getUser = async (id: number) => {
  return await httpGet<IUser>(`/users/${id}/`);
};

export const updateUser = async (user: IUser) => {
  return await httpPatch<IUser, IUser>(`/users/${user.id}/`, user);
};

export const authenticate = async (credentials: ICredentials) => {
  return await httpPostNoAuth<ICredentials, IUserInfo>(
    `/authenticate`,
    credentials
  );
};
