export interface ICaseType {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  description: string;
}

export interface ICaseOffice {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
}

export interface IClient {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  legal_cases?: number[];
  preferred_name: string;
  official_identifier: string;
  official_identifier_type: string;
  contact_number: string;
  contact_email: string;
  name: string;
}

//Note: Cannot use Case so internally use LegalCase. User interface refers to Case.
export interface ILegalCase {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  users?: number[];
  case_number: string;
  state: string;
  client: number;
  case_types: number[];
  case_offices: number[];
}

export interface IMeeting {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  legal_case: number;
  location: string;
  meeting_date: string;
  meeting_type: string;
  notes: string;
}

export interface IUserInfo {
  token: string;
  user_id: number;
}

export interface ICredentials {
  username: string;
  password: string;
}

export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
