import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { Value } from './get-available-ip-addresses.dto';

export interface CreateEdgeConfig {
  authToken: string;
  name: string;
  userIpCount: number;
  vdcId: string;
}

export class CreateEdgeDto extends VcloudTask {
  name: string;
  ipRange: Value[];
}
