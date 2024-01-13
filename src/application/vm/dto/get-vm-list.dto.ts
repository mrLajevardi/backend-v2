export type VmListValue = {
  id: string;
  name: string;
  os: string;
  cpu: number;
  storage: number;
  memory: number;
  status: number;
  containerId: string;
  snapshot: boolean;
  vmToolsVersion: number;
  description: string;
};

export class VmList {
  total: number;
  pageSize: number;
  page: number;
  pageCount: number;
  values: VmListValue[];
}
