export type Nullable<T> = T | null;

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
  case_office_code: string;
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
  first_names: string;
  last_name: string;
  address?: string;
  alternative_contact_email?: string;
  alternative_contact_number?: string;
  civil_marriage_type?: string;
  date_of_birth?: string;
  dependents?: string;
  disabilities?: string;
  employment_status?: string;
  gender?: string;
  has_disability?: string;
  home_language?: string;
  marital_status?: string;
  nationality?: string;
  country_of_birth?: string;
  next_of_kin_contact_number?: string;
  next_of_kin_name?: string;
  next_of_kin_relationship?: string;
  province?: string;
  translator_language?: string;
  translator_needed?: string;
  users?: number[];
  non_field_errors?: string;
  preferred_contact_method?: string;
}

export interface IClientDependent {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  preferred_name: string;
  official_identifier: string;
  official_identifier_type: string;
  contact_number: string;
  contact_email: string;
  first_names: string;
  last_name: string;
  alternative_contact_email?: string;
  alternative_contact_number?: string;
  date_of_birth?: string;
  gender?: string;
  home_language?: string;
  nationality?: string;
  country_of_birth?: string;
  client?: number;
  non_field_errors?: string;
  details?: string;
  preferred_contact_method?: string;
  relationship_to_client?: string;
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
  summary?: string;
}

export interface INote {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  title: string;
  content: string;
  legal_case: number;
  file?: number | null;
  case_update?: number;
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
  name?: string | null;
  file?: number | null;
  case_update?: number;
}

export interface IUserInfo {
  token: string;
  user_id: number;
}

export interface ICredentials {
  username: string;
  password: string;
}

export interface IUser {
  id?: number;
  name: string;
  membership_number: string;
  contact_number: string;
  email: string;
  case_office: Nullable<number>;
}

export interface ILegalCaseFile {
  id?: number;
  combinedId?: string;
  created_at?: Date;
  updated_at?: Date;
  legal_case: number;
  upload: string;
  upload_file_name?: string;
  upload_file_extension?: string;
  description?: string;
}

export interface IClientFile {
  id?: number;
  combinedId?: string;
  created_at?: Date;
  updated_at?: Date;
  client: number;
  upload: string;
  upload_file_name?: string;
  upload_file_extension?: string;
  description?: string;
}

export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ILog {
  id?: number;
  created_at?: string;
  updated_at?: string;
  parent_id: number | undefined;
  parent_type: string;
  target_id: number | undefined;
  target_type: string;
  action: string;
  note: string;
  user: number;
  changes: {
    id: number;
    field: string;
    value: any;
    action: string;
    log: number;
  }[];
  extra: {
    user: {
      name: string;
    };
  };
}

export interface LocationState {
  pathname?: string;
  open?: boolean;
  message?: string;
  severity?: "success" | "error" | undefined;
}

export interface SnackbarState {
  open?: boolean;
  message?: string;
  severity?: "success" | "error" | "info" | undefined;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ILanguage {
  id: number;
  created_at: Date;
  updated_at: Date;
  label: string;
}

export interface ISiteNotice {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  message: string;
  active: boolean;
}

export interface ISetting {
  id: number;
  name: string;
  value: any;
}

export interface ILegalCaseReferral {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  legal_case: number;
  referred_to: string;
  referral_date: string;
  reference_number: string;
  details: string;
}
