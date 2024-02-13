export interface CreateUserResultDto {
  id: number;
  organization_id: number;
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
  organization_ids: any[];
  authorization_ids: any[];
  karma_user_ids: any[];
  group_ids: string[];
}

export interface Preferences {
  notification_config: NotificationConfig;
  locale: string;
}

export interface NotificationConfig {
  matrix: Matrix;
}

export interface Matrix {
  create: Create;
  update: Create;
  reminder_reached: Create;
  escalation: Create;
}

export interface Create {
  criteria: Criteria;
  channel: Channel;
}

export interface Channel {
  email: boolean;
  online: boolean;
}

export interface Criteria {
  owned_by_me: boolean;
  owned_by_nobody: boolean;
  subscribed: boolean;
  no: boolean;
}
