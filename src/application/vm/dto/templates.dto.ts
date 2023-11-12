export class VmTemplateList {
  id: string;
  container: string;
  ownerName: string;
  name: string;
  os: string;
  cpu: number;
  memory: number;
  catalog: string;
  templateNICCount: number;
  numCoresPerSocket: number;
  sockets: number;
  totalStorageAllocatedMb: number;
  status: string;
  dateCreated: string;
  autoDeleteDate: string;
  isExpired: boolean;
}

// export class TemplateList {
//     templateList: Template[];
// }
