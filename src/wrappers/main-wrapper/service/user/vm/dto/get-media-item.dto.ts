export interface GetMediaItemDto {
  otherAttributes: OtherAttributes;
  link: VdcStorageProfile[];
  href: string;
  type: string;
  id: string;
  operationKey: null;
  description: string;
  tasks: Tasks;
  name: string;
  files: Files;
  status: number;
  owner: Owner;
  vdcStorageProfile: VdcStorageProfile;
  imageType: string;
  size: number;
  vCloudExtension: any[];
}

export interface Files {
  otherAttributes: OtherAttributes;
  file: File[];
  vCloudExtension: any[];
}

export interface File {
  otherAttributes: OtherAttributes;
  link: VdcStorageProfile[];
  href: null;
  type: null;
  id: null;
  operationKey: null;
  description: null;
  tasks: null;
  name: string;
  size: number;
  bytesTransferred: number;
  checksum: null;
  vCloudExtension: any[];
}

export interface VdcStorageProfile {
  otherAttributes: OtherAttributes;
  href: string;
  id: null | string;
  type: null | string;
  name: null | string;
  rel?: string;
  model?: null;
  vCloudExtension: any[];
}

type OtherAttributes = Record<string, never>;

export interface Owner {
  otherAttributes: OtherAttributes;
  link: any[];
  href: null;
  type: string;
  user: VdcStorageProfile;
  vCloudExtension: any[];
}

export interface Tasks {
  otherAttributes: OtherAttributes;
  task: Task[];
  vCloudExtension: any[];
}

export interface Task {
  otherAttributes: OtherAttributes;
  link: any[];
  href: string;
  type: string;
  id: string;
  operationKey: null;
  description: null;
  tasks: null;
  name: string;
  owner: VdcStorageProfile;
  error: null;
  user: VdcStorageProfile;
  organization: VdcStorageProfile;
  progress: number;
  params: null;
  details: string;
  vcTaskList: null;
  taskSteps: TaskSteps;
  result: null;
  status: string;
  operation: string;
  operationName: string;
  serviceNamespace: string;
  startTime: Date;
  endTime: null;
  expiryTime: Date;
  cancelRequested: boolean;
  vCloudExtension: any[];
}

export interface TaskSteps {
  otherAttributes: OtherAttributes;
  taskStep: any[];
  vCloudExtension: any[];
}
