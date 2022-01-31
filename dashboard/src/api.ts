import {
  ICaseOffice,
  IDbDataMonthly,
  IDbDataDailyPerMonth,
  IUser,
  ICredentials,
  IUserInfo
} from "./types";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

async function http<T>(path: string, config: RequestInit): Promise<T> {
  path = `${API_BASE_URL}${path}`;
  const request = new Request(path, config);
  const response = await fetch(request);
  return response.json().catch((e) => {
    console.log(e);
  });
}

export async function httpPost<T, U>(
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
  const init = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
  const init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...config,
  };
  return await http<T>(path, init);
}

export const getCaseOffices = async () => {
  return await httpGet<ICaseOffice[]>(`/case-offices/`);
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
  return await httpPost<ICredentials, IUserInfo>(`/authenticate`, credentials);
};
