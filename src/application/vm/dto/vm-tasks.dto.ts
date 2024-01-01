export class VmTasksDto {
  status: number;
  type: string; /// ???
  performingUser: string; /// ? OwnerName Or ObjectName
  createDate: string;
  compilationDate: string;
  // what is سه روز اخیر
}

export interface VmTaskModel {
  otherAttributes: OtherAttributes;
  link: Link[];
  href: string;
  type: string;
  name: string;
  page: number;
  pageSize: number;
  total: number;
  record: VmTask[];
  vCloudExtension: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OtherAttributes {}

export interface Link {
  otherAttributes: OtherAttributes2;
  href: string;
  id: any;
  type: string;
  name: any;
  rel: string;
  model: any;
  vCloudExtension: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OtherAttributes2 {}

export interface VmTask {
  _type: string;
  link: any[];
  metadata?: any;
  href: string;
  id?: any;
  type?: any;
  otherAttributes: OtherAttributes;
  org: string;
  orgName: string;
  name: string;
  operationFull: string;
  message: string;
  startDate: string;
  endDate: string;
  status: string;
  progress?: any;
  ownerName: string;
  object: string;
  objectType: string;
  objectName: string;
  serviceNamespace: string;
  currentStepName?: any;
  currentStepProgress?: any;
  currentStepStartDate?: any;
  currentStepEndDate?: any;
}

export interface OtherAttributes3 {
  vmToolsVersion: string;
  taskStatusName: string;
  task: string;
  isVdcEnabled: string;
  pvdcHighestSupportedHardwareVersion: string;
  taskStatus: string;
  taskDetails: string;
}
