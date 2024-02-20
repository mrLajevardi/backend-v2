export interface GetAllStatesDto {
  id: number;
  state_type_id: number;
  name: string;
  next_state_id: number | null;
  ignore_escalation: boolean;
  default_create: boolean;
  default_follow_up: boolean;
  note: null;
  active: boolean;
  updated_by_id: number;
  created_by_id: number;
  created_at: Date;
  updated_at: Date;
}
