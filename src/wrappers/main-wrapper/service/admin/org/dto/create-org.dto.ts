import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';

export class CreateOrgDto extends VcloudTask {
  id: string;
  name: string;
}
