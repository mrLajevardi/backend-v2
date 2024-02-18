export interface ShowGroupsDto {
  id: number;
  signature_id: null;
  email_address_id: null;
  name: string;
  assignment_timeout: null;
  follow_up_possible: string;
  follow_up_assignment: boolean;
  active: boolean;
  note: null;
  updated_by_id: number;
  created_by_id: number;
  created_at: Date;
  updated_at: Date;
  user_ids: number[];
}
