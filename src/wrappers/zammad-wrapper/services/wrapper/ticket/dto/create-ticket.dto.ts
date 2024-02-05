export interface CreateTicketDto {
  title: string;
  group: string;
  customer?: string;
  article?: Article;
}

export interface Article {
  subject: string;
  body: string;
  type: string;
  internal: boolean;
}

export interface CreateTicketResultDto {
  id: number;
  group_id: number;
  priority_id: number;
  state_id: number;
  organization_id: null;
  number: string;
  title: string;
  owner_id: number;
  customer_id: number;
  note: null;
  first_response_at: null;
  first_response_escalation_at: null;
  first_response_in_min: null;
  first_response_diff_in_min: null;
  close_at: null;
  close_escalation_at: null;
  close_in_min: null;
  close_diff_in_min: null;
  update_escalation_at: null;
  update_in_min: null;
  update_diff_in_min: null;
  last_contact_at: null;
  last_contact_agent_at: null;
  last_contact_customer_at: null;
  last_owner_update_at: null;
  create_article_type_id: number;
  create_article_sender_id: number;
  article_count: number;
  escalation_at: null;
  pending_time: null;
  type: null;
  time_unit: null;
  preferences: null;
  updated_by_id: number;
  created_by_id: number;
  created_at: Date;
  updated_at: Date;
  article_ids: number[];
  ticket_time_accounting_ids: any[];
}
