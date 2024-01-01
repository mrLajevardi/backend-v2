import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { Value } from './get-available-ip-addresses.dto';

export interface UpdateEdgeGatewayConfigDto {
  authToken: string;
  userIpCount: number;
  name: string;
  alreadyAssignedIpCounts: number;
  vdcId: string;
  alreadyAssignedIpList: Value[];
  connected?: boolean;
}

export class UpdateEdgeGatewayCoReturnType extends VcloudTask {
  name: string;
  ipRange: Value[];
}
