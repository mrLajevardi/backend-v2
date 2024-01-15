export type VmListValue = {
  id: string;
  name: string;
  os: string;
  cpu: number;
  storage: number;
  memory: number;
  status: string;
  containerId: string;
  snapshot: boolean;
};

export class VmList {
  total: number;
  pageSize: number;
  page: number;
  pageCount: number;
  values: VmListValue[];
}
