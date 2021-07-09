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
  id: number;
  created_at: Date;
  updated_at: Date;
  preferred_name: string;
  official_identifier: string;
  official_identifier_type: string;
  contact_number: string;
  contact_email: string;
  name: string;
  legal_cases: number[];
}

//Note: Cannot use Case so internally use LegalCase. User interface refers to Case.
export interface ILegalCase {
  id: number;
  created_at: Date;
  updated_at: Date;
  case_number: string;
  state: string;
  client: number;
  users: number[];
  case_types: number[];
  case_offices: number[];
}

export interface IMeeting {
  id: number;
  created_at: Date;
  updated_at: Date;
  legal_case: number;
  location: string;
  meeting_date: Date;
  meeting_type: string;
  notes: string;
}