import {
  ILegalCase,
  IClient,
  ICaseType,
  ICaseOffice,
  IMeeting,
  IToken,
  IAuthenticate,
} from "./types";

export async function httpGet<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}

async function http<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(path, config);
  const response = await fetch(request);
  return response.json().catch(() => ({}));
}

export async function httpDelete<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  const init = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...config,
  };
  return await http<T>(path, init);
}

export async function httpPost<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = {
    method: "post",
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

export const getLegalCases = async (id?: number) => {
  return await httpGet<ILegalCase[]>(`/api/v1/cases/`);
};

export const getLegalCase = async (id: number) => {
  return await httpGet<ILegalCase>(`/api/v1/cases/${id}/`);
};

export const getClients = async () => {
  return await httpGet<IClient[]>(`/api/v1/clients/`);
};

export const getClient = async (id: number) => {
  return await httpGet<IClient>(`/api/v1/clients/${id}/`);
};

export const getCaseTypes = async () => {
  return await httpGet<ICaseType[]>(`/api/v1/case-types/`);
};

export const getCaseOffices = async () => {
  return await httpGet<ICaseOffice[]>(`/api/v1/case-offices/`);
};

export const getMeetings = async () => {
  return await httpGet<IMeeting[]>(`/api/v1/meetings/`);
};

export const getMeeting = async (id: number) => {
  return await httpGet<IMeeting>(`/api/v1/meetings/${id}/`);
};

export const createMeeting = async (meeting: IMeeting) => {
  const body = meeting;
  return await httpPost<IMeeting, IMeeting>("/api/v1/meetings/", body);
};

export const updateMeeting = async (meeting: IMeeting) => {
  const body = meeting;
  return await httpPatch<IMeeting, IMeeting>(
    `/api/v1/meetings/${meeting.id}/`,
    body
  );
};

export const deleteMeeting = async (id: number) => {
  return await httpDelete<IMeeting>(`/api/v1/meetings/${id}/`);
};

export const authenticate = async (username: string, password: string) => {
  const body = {
    username: username,
    password: password,
  };
  return await httpPost<IAuthenticate, IToken>("/api/v1/authenticate", body);
};
