import {
  ILegalCase,
  IClient,
  ICaseType,
  ICaseOffice,
  IMeeting,
  IUserInfo,
  ICredentials,
} from "./types";

const API_BASE_URL = process.env.API_BASE_URL || "https://casemanagement.openup.org.za/api/v1"; //|| "http://localhost:8000/api/v1";

async function http<T>(path: string, config: RequestInit): Promise<T> {
  path = `${API_BASE_URL}${path}`;
  const request = new Request(path, config);
  const response = await fetch(request);
  return response.json().catch(() => ({}));
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

export const getLegalCases = async (client?: number) => {
  return await httpGet<ILegalCase[]>(
    `/cases/${client ? `?client=${client}` : ""}`
  );
};

export const getLegalCase = async (id: number) => {
  return await httpGet<ILegalCase>(`/cases/${id}/`);
};

export const createLegalCase = async (legalCase: ILegalCase) => {
  return await httpPost<ILegalCase, ILegalCase>(`/cases/`, legalCase);
};

export const updateLegalCase = async (legalCase: ILegalCase) => {
  return await httpPatch<ILegalCase, ILegalCase>(
    `/cases/${legalCase.id}/`,
    legalCase
  );
};

export const deleteLegalCase = async (id: number) => {
  return await httpDelete<IMeeting>(`/cases/${id}/`);
};

export const getClients = async () => {
  return await httpGet<IClient[]>(`/clients/`);
};

export const getClient = async (id: number) => {
  return await httpGet<IClient>(`/clients/${id}/`);
};

export const updateClient = async (client: IClient) => {
  return await httpPatch<IClient, IClient>(`/clients/${client.id}/`, client);
};

export const createClient = async (client: IClient) => {
  return await httpPost<IClient, IClient>(`/clients/`, client);
};

export const deleteClient = async (id: number) => {
  return await httpDelete<IMeeting>(`/clients/${id}/`);
};

export const getCaseTypes = async () => {
  return await httpGet<ICaseType[]>(`/case-types/`);
};

export const getCaseOffices = async () => {
  return await httpGet<ICaseOffice[]>(`/case-offices/`);
};

export const getMeetings = async (legal_case?: number) => {
  return await httpGet<IMeeting[]>(
    `/meetings/${legal_case ? `?legal_case=${legal_case}` : ""}`
  );
};

export const getMeeting = async (id: number) => {
  return await httpGet<IMeeting>(`/meetings/${id}/`);
};

export const createMeeting = async (meeting: IMeeting) => {
  return await httpPost<IMeeting, IMeeting>(`/meetings/`, meeting);
};

export const updateMeeting = async (meeting: IMeeting) => {
  return await httpPatch<IMeeting, IMeeting>(
    `/meetings/${meeting.id}/`,
    meeting
  );
};

export const deleteMeeting = async (id: number) => {
  return await httpDelete<IMeeting>(`/meetings/${id}/`);
};

export const authenticate = async (credentials: ICredentials) => {
  return await httpPost<ICredentials, IUserInfo>(`/authenticate`, credentials);
};
