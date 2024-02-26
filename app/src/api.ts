import axios from "axios";
import {
  ILegalCase,
  IClient,
  IClientDependent,
  ICaseType,
  ICaseOffice,
  IMeeting,
  IUserInfo,
  IUser,
  ICredentials,
  ILog,
  ILegalCaseFile,
  ILegalCaseReferral,
  ILanguage,
  ISiteNotice,
  ISetting,
  IClientFile,
  INote,
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
  // If response OK then return it otherwise return empty JSON
  if (response.ok) {
    return response.json().catch((e) => {
      console.log(e);
    });
  } else {
    return Promise.reject(new Error("Failed to fetch"));
  }
}

type renameOptionsType = {
  method: string | any;
  body: any;
  headers: any;
};

type optionsType = {
  method: string | any;
  body: any;
  onUploadProgress: any;
  headers: any;
};

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

export async function httpDelete<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const init = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const getLanguages = async () => {
  return await httpGet<ILanguage[]>(`/languages/`);
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

export const getUsers = async () => {
  return await httpGet<IUser[]>(`/users/`);
};

export const authenticate = async (credentials: ICredentials) => {
  return await httpPostNoAuth<ICredentials, IUserInfo>(
    `/authenticate`,
    credentials
  );
};

export const getLogs = async (id?: number, parent_type?: string) => {
  const idParam = id ? `parent_id=${id}` : "";
  const parent_typeParam = parent_type ? `&parent_type=${parent_type}` : "";
  return await httpGet<ILog[]>(`/logs/?${idParam}${parent_typeParam}`);
};

export const getSiteNotices = async (active?: boolean) => {
  const activeParam = active ? `active=${active}` : "";
  return await httpGet<ISiteNotice[]>(`/site-notices/?${activeParam}`);
};

export const getSettings = async (name?: string) => {
  const nameParam = name ? `name=${name}` : "";
  return await httpGet<ISetting[]>(`/settings/?${nameParam}`);
};

export const getInstanceSettings = async () => {
  const data = await httpGet<ISetting[]>(`/settings/?name=instance`);
  if (data.length === 0) {
    return null;
  }
  return data[0]["value"];
};

export const createLog = async (log: ILog) => {
  return await httpPost<ILog, ILog>("/logs/", log);
};

export const getLegalCaseFiles = async (legal_case?: number) => {
  return await httpGet<ILegalCaseFile[]>(
    `/files/${legal_case ? `?legal_case=${legal_case}` : ""}`
  );
};

export const getLegalCaseFile = async (file_id: number) => {
  return await httpGet<ILegalCaseFile>(`/files/${file_id}/`);
};

export const createLegalCaseFile = async (
  legal_case: number | undefined,
  file: any,
  description: string,
  onUploadProgress: any
) => {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
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
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${API_BASE_URL}/files/`,
    formData,
    options
  );
  return response.data;
};

export const getClientFiles = async (client?: number) => {
  return await httpGet<IClientFile[]>(
    `/client-files/${client ? `?client=${client}` : ""}`
  );
};

export const getClientFile = async (file_id: number) => {
  return await httpGet<IClientFile>(`/client-files/${file_id}/`);
};

export const createClientFile = async (
  client: number | undefined,
  file: any,
  description: string,
  onUploadProgress: any
) => {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const formData = new FormData();
  formData.append("upload", file);
  if (client) {
    formData.append("client", client.toString());
  }
  if (description) {
    formData.append("description", description);
  }

  const options: optionsType = {
    method: "POST",
    body: formData,
    onUploadProgress: onUploadProgress,
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${API_BASE_URL}/client-files/`,
    formData,
    options
  );
  return response.data;
};

export const getCaseUpdates = async (id: number) => {
  return await httpGet<any>(`/case-updates/?legal_case=${id}`);
};

export const getCaseUpdate = async (id: number) => {
  return await httpGet<any>(`/case-updates/${id}`);
};

export const createCaseUpdate = async (caseUpdate: any) => {
  return await httpPost<any, any>(`/case-updates/`, caseUpdate);
};

export const deleteCaseUpdate = async (id: number) => {
  return await httpDelete<any>(`/case-updates/${id}/`);
};

export const getNote = async (id: number) => {
  return await httpGet<INote>(`/notes/${id}/`);
};

export const updateNote = async (note: INote) => {
  return await httpPatch<any, any>(`/notes/${note.id}/`, note);
};

export const deleteLegalCaseFile = async (id: number) => {
  return await httpDelete<ILegalCaseFile>(`/files/${id}/`);
};

export const renameLegalCaseFile = async (legalCaseFile: any) => {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const formData = new FormData();
  formData.append("legal_case", legalCaseFile.legal_case);
  formData.append("description", legalCaseFile.description);

  const renameOptions: renameOptionsType = {
    method: "PATCH",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.patch(
    `${API_BASE_URL}/files/${legalCaseFile.id}/`,
    formData,
    renameOptions
  );
  return response.data;
};

export const deleteClientFile = async (id: number) => {
  return await httpDelete<IClientFile>(`/client-files/${id}/`);
};

export const renameClientFile = async (clientFile: any) => {
  const userInfo = UserInfo.getInstance();
  const token = userInfo.getAccessToken();
  const formData = new FormData();
  formData.append("client", clientFile.client);
  formData.append("description", clientFile.description);

  const renameOptions: renameOptionsType = {
    method: "PATCH",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.patch(
    `${API_BASE_URL}/client-files/${clientFile.id}/`,
    formData,
    renameOptions
  );
  return response.data;
};

export const getClientDependentsForClient = async (id: number) => {
  return await httpGet<IClientDependent[]>(`/client-dependents/?client=${id}`);
};

export const getClientDependent = async (id: number) => {
  return await httpGet<IClientDependent>(`/client-dependents/${id}/`);
};

export const deleteClientDependent = async (id: number) => {
  return await httpDelete<IClientDependent>(`/client-dependents/${id}/`);
};

export const updateClientDependent = async (
  clientDependent: IClientDependent
) => {
  return await httpPatch<IClientDependent, IClientDependent>(
    `/client-dependents/${clientDependent.id}/`,
    clientDependent
  );
};

export const createClientDependent = async (
  clientDependent: IClientDependent
) => {
  return await httpPost<IClientDependent, IClientDependent>(
    `/client-dependents/`,
    clientDependent
  );
};

export const getLegalCaseReferrals = async (legal_case?: number) => {
  return await httpGet<ILegalCaseReferral[]>(
    `/referrals/${legal_case ? `?legal_case=${legal_case}` : ""}`
  );
};

export const getLegalCaseReferral = async (id: number) => {
  return await httpGet<ILegalCaseReferral>(`/referrals/${id}/`);
};

export const createLegalCaseReferral = async (
  legalCaseReferral: ILegalCaseReferral
) => {
  return await httpPost<ILegalCaseReferral, ILegalCaseReferral>(
    `/referrals/`,
    legalCaseReferral
  );
};

export const updateLegalCaseReferral = async (
  legalCaseReferral: ILegalCaseReferral
) => {
  return await httpPatch<ILegalCaseReferral, ILegalCaseReferral>(
    `/referrals/${legalCaseReferral.id}/`,
    legalCaseReferral
  );
};

export const deleteLegalCaseReferral = async (id: number) => {
  return await httpDelete<ILegalCaseReferral>(`/referrals/${id}/`);
};
