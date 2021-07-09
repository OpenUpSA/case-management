import { ILegalCase, IClient, ICaseType, ICaseOffice, IMeeting } from "./types";

export async function http<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}

export const getLegalCases = async (id?: number) => {
  return await http<ILegalCase[]>(`/api/v1/cases/`);
};

export const getLegalCase = async (id: number) => {
  return await http<ILegalCase>(`/api/v1/cases/${id}/`);
};

export const getClients = async () => {
  return await http<IClient[]>(`/api/v1/clients/`);
};

export const getClient = async (id: number) => {
  return await http<IClient>(`/api/v1/clients/${id}/`);
};

export const getCaseTypes = async () => {
  return await http<ICaseType[]>(`/api/v1/case-types/`);
};

export const getCaseOffices = async () => {
  return await http<ICaseOffice[]>(`/api/v1/case-offices/`);
};

export const getMeetings = async () => {
  return await http<IMeeting[]>(`/api/v1/meetings/`);
};

export const getMeeting = async (id: number) => {
  return await http<IMeeting>(`/api/v1/meetings/${id}/`);
};