export interface GetOrgDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null;
  values: Value[];
}

export interface Value {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isEnabled: boolean;
  orgVdcCount: number;
  catalogCount: number;
  vappCount: number;
  runningVMCount: number;
  userCount: number;
  diskCount: number;
  canPublish: boolean;
}
