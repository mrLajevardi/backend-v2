import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateVmSnapshotDto extends EndpointOptionsInterface {
  urlParams: CreateVmSnapshotUrlParams;
  body: string;
}

export interface CreateVmSnapshotUrlParams {
  vmId: string;
}

export class CreateVmSnapshotBody {
  'root:CreateSnapshotParams': CreateSnapshotParams;
}

class CreateSnapshotParams {
  $: CreateSnapshotParamsMetadata;
}
class CreateSnapshotParamsMetadata {
  'xmlns:root': string;
  memory: boolean;
  quiesce: boolean;
}
