import axios from "axios";
import {
  ILegalCase,
  IClient,
  ICaseType,
  ICaseOffice,
  IMeeting,
  IUserInfo,
  IUser,
  ICredentials,
  ILog,
  ILegalCaseFile,
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

export const getClientsForCaseOffice = async (id: number) => {
  return await httpGet<IClient[]>(`/clients/?caseOffice=${id}`);
};

export const getClientsForUser = async (id: number) => {
  return await httpGet<IClient[]>(`/clients/?user=${id}`);
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

export const getUser = async (id: number) => {
  return await httpGet<IUser>(`/users/${id}/`);
};

export const updateUser = async (user: IUser) => {
  return await httpPatch<IUser, IUser>(`/users/${user.id}/`, user);
};

export const authenticate = async (credentials: ICredentials) => {
  return await httpPost<ICredentials, IUserInfo>(`/authenticate`, credentials);
};

export const getLogs = async (id?: number, parent_type?: string) => {
  const idParam = id ? `parent_id=${id}` : "";
  const parent_typeParam = parent_type ? `&parent_type=${parent_type}` : "";
  return await httpGet<ILog[]>(`/logs/?${idParam}${parent_typeParam}`);
};

export const createLog = async (log: ILog) => {
  return await httpPost<ILog, ILog>("/logs/", log);
};

export const getLegalCaseFiles = async (legal_case?: number) => {
  return await httpGet<ILegalCaseFile[]>(
    `/files/${legal_case ? `?legal_case=${legal_case}` : ""}`
  );
};

type optionsType = {
  method: string | any;
  body: any;
  onUploadProgress: any;
};

export const createLegalCaseFile = async (
  legal_case: number | undefined,
  file: any,
  description: string,
  onUploadProgress: any
) => {
  const formData = new FormData();

  formData.append("upload", file);
  if (legal_case) {
    formData.append("legal_case", legal_case.toString());
  }
  if (description) {
    formData.append("description", description);
  }

  const options: optionsType = {
    method: "POST",
    body: formData,
    onUploadProgress: onUploadProgress,
  };
  const response = await axios.post(
    `${API_BASE_URL}/files/`,
    formData,
    options
  );
  return response.data;
};
