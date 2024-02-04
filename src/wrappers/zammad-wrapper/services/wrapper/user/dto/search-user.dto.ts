export interface SearchUserQueryParams {
  query: string;
  limit: number;
}

export interface SearchUserDto {
  id: number;
  organization_id: null;
  login: string;
  firstname: string;
  lastname: string;
  email: string;
  image: null;
  image_source: null;
  web: string;
  phone: string;
  fax: string;
  mobile: string;
  department: null;
  street: string;
  zip: string;
  city: string;
  country: string;
  address: null;
  vip: boolean;
  verified: boolean;
  active: boolean;
  note: string;
  last_login: null;
  source: null;
  login_failed: number;
  out_of_office: boolean;
  out_of_office_start_at: null;
  out_of_office_end_at: null;
  out_of_office_replacement_id: null;
  preferences: Preferences;
  updated_by_id: number;
  created_by_id: number;
  created_at: Date;
  updated_at: Date;
  role_ids: number[];
  two_factor_preference_ids: any[];
  organization_ids: any[];
  authorization_ids: any[];
  overview_sorting_ids: any[];
  group_ids: string[];
}

export interface Preferences {
  locale: string;
  tickets_closed: number;
  tickets_open: number;
}
