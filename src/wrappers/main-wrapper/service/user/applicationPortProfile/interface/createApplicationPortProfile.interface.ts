export interface CreateApplicationPortProfileInterface {
  description: string;
  name: string;
  vdcId: string;
  orgId: string;
  applicationPorts: object;
}

export interface CreateApplicationPortProfileDto {
  __vcloudTask: string;
}
